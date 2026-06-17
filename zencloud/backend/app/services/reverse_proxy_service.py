"""
ReverseProxyService — manages Nginx config files for deployed projects.

Responsibilities:
  - Generate per-project Nginx upstream + server block configs
  - Reserve and validate unique subdomains
  - Write/delete config files in the mounted conf.d directory
  - Reload Nginx after any config change

This service does NOT build images, start containers, or manage SSL.
"""
import re  # noqa: E402 (must come after docstring)
import subprocess
import logging
from pathlib import Path
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

NGINX_CONF_DIR = Path(settings.NGINX_CONF_DIR)
NGINX_CONTAINER = settings.NGINX_CONTAINER
BASE_DOMAIN = settings.BASE_DOMAIN


class SubdomainError(ValueError):
    """Raised when a subdomain is invalid or already taken."""


class ReverseProxyService:
    """
    Manages Nginx reverse-proxy configurations for deployed projects.

    Each deployed project gets its own file:
        conf.d/<subdomain>.conf

    The file contains a single server block that proxies requests to the
    project's container on its assigned port.  The default.conf catch-all
    (created in Task 1) handles everything else.
    """

    # ------------------------------------------------------------------ #
    # Public API                                                           #
    # ------------------------------------------------------------------ #

    def generate_project_config(self, project) -> Path:
        """
        Write an Nginx server block for *project* into conf.d and reload.

        Expects the project object to have:
            project.subdomain  str
            project.port       str | int
            project.name       str

        Returns the path of the written config file.
        Raises ValueError if the project has no port assigned.
        """
        if not project.port:
            raise ValueError(
                f"Project '{project.name}' has no port assigned — "
                "deploy the container before generating a proxy config."
            )

        subdomain = project.subdomain
        port = int(project.port)
        config_content = self._build_server_block(subdomain, port, project.name)

        config_path = self._config_path(subdomain)
        config_path.parent.mkdir(parents=True, exist_ok=True)
        config_path.write_text(config_content, encoding="utf-8")

        logger.info("Generated proxy config: %s → port %d", config_path, port)
        self.reload_nginx()
        return config_path

    def delete_project_config(self, project) -> bool:
        """
        Remove the Nginx config for *project* and reload.

        Returns True if a file was deleted, False if it didn't exist.
        """
        config_path = self._config_path(project.subdomain)

        if not config_path.exists():
            logger.warning("Config file not found, nothing to delete: %s", config_path)
            return False

        config_path.unlink()
        logger.info("Deleted proxy config: %s", config_path)
        self.reload_nginx()
        return True

    def reload_nginx(self) -> bool:
        """
        Send a reload signal to the Nginx container.

        Uses `docker exec <container> nginx -s reload` so the running
        process picks up the new conf.d files without a full restart.

        Returns True on success.  Logs but does not raise on failure so
        callers are not blocked if Nginx is temporarily unavailable.
        """
        try:
            result = subprocess.run(
                ["docker", "exec", NGINX_CONTAINER, "nginx", "-s", "reload"],
                capture_output=True,
                text=True,
                timeout=10,
            )
            if result.returncode != 0:
                logger.error("Nginx reload failed: %s", result.stderr.strip())
                return False

            logger.info("Nginx reloaded successfully.")
            return True

        except subprocess.TimeoutExpired:
            logger.error("Nginx reload timed out.")
            return False
        except Exception as exc:
            logger.error("Nginx reload error: %s", exc)
            return False

    def reserve_subdomain(self, project_name: str) -> str:
        """
        Derive a unique, URL-safe subdomain from *project_name*.

        Slugifies the name and appends a numeric suffix if the subdomain
        is already taken by an existing conf.d file.

        Returns the reserved subdomain string.
        Raises SubdomainError if a valid slug cannot be produced.
        """
        base = self._slugify(project_name)
        if not base:
            raise SubdomainError(
                f"Cannot derive a valid subdomain from name '{project_name}'."
            )

        candidate = base
        counter = 1
        while self._config_path(candidate).exists():
            candidate = f"{base}-{counter}"
            counter += 1

        logger.info("Reserved subdomain: %s", candidate)
        return candidate

    def get_project_url(self, project) -> str:
        """
        Return the public URL for *project*.

        Priority:
          1. custom_domain (if set)
          2. <subdomain>.<BASE_DOMAIN>  when BASE_DOMAIN is not 'localhost'
          3. http://localhost:<port>    for local development
        """
        if getattr(project, "custom_domain", None):
            return f"http://{project.custom_domain}"

        if BASE_DOMAIN and BASE_DOMAIN != "localhost":
            return f"http://{project.subdomain}.{BASE_DOMAIN}"

        if project.port:
            return f"http://localhost:{project.port}"

        return "Not deployed"

    def validate_subdomain(self, name: str) -> bool:
        """
        Return True if *name* is a valid subdomain label.

        Rules:
          - 3–63 characters
          - Only lowercase letters, digits, hyphens
          - Must not start or end with a hyphen
          - No consecutive hyphens
        """
        if not name or not isinstance(name, str):
            return False

        pattern = r"^[a-z0-9]([a-z0-9\-]{1,61}[a-z0-9])?$"
        if not re.match(pattern, name):
            return False

        if "--" in name:
            return False

        return True

    # ------------------------------------------------------------------ #
    # Private helpers                                                      #
    # ------------------------------------------------------------------ #

    def _config_path(self, subdomain: str) -> Path:
        """Return the full path for a project's conf.d file."""
        return NGINX_CONF_DIR / f"{subdomain}.conf"

    def _slugify(self, name: str) -> str:
        """
        Convert an arbitrary string into a lowercase, hyphen-separated slug
        suitable for use as a subdomain.
        """
        slug = name.lower()
        # Replace any non-alphanumeric char with a hyphen
        slug = re.sub(r"[^a-z0-9]+", "-", slug)
        # Strip leading/trailing hyphens
        slug = slug.strip("-")
        # Collapse consecutive hyphens
        slug = re.sub(r"-{2,}", "-", slug)
        # Enforce max label length (63 chars per RFC 1035)
        return slug[:63]

    def _build_server_block(self, subdomain: str, port: int, project_name: str) -> str:
        """
        Render an Nginx server block that proxies to the project container.

        The upstream block uses 127.0.0.1:<port> because all project
        containers are on the host network from Nginx's perspective when
        using Docker port mappings.  If containers are on the same Docker
        network as Nginx, switch the upstream address to the container name.
        """
        return f"""\
# Auto-generated by ReverseProxyService — do not edit manually.
# Project: {project_name}  |  Subdomain: {subdomain}

upstream {subdomain}_upstream {{
    server 127.0.0.1:{port};
    keepalive 16;
}}

server {{
    listen 80;
    server_name {subdomain}.{BASE_DOMAIN};

    # Proxy settings
    location / {{
        proxy_pass         http://{subdomain}_upstream;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Forward real client info
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 10s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;

        # Buffer settings
        proxy_buffering    on;
        proxy_buffer_size  4k;
        proxy_buffers      8 4k;
    }}

    # Health probe — used by monitoring
    location /_proxy_health {{
        return 200 'ok';
        add_header Content-Type text/plain;
    }}
}}
"""
