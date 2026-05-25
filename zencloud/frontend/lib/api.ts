const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    console.log(`API Request: ${options.method || 'GET'} ${url}`, options.body);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    console.log(`API Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      console.error('API Error:', error);
      throw new Error(error.detail || 'Request failed');
    }

    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  }

  // Auth
  async register(email: string, username: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    
    // Auto-login after registration
    return this.login(email, password);
  }

  async login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    localStorage.removeItem('token');
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Projects
  async getProjects() {
    return this.request('/projects/');
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`);
  }

  async createProject(data: { name: string; repository_url: string; branch: string }) {
    return this.request('/projects/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: any) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async deployProject(id: string) {
    return this.request(`/projects/${id}/deploy`, {
      method: 'POST',
    });
  }

  async startProject(id: string) {
    return this.request(`/projects/${id}/start`, {
      method: 'POST',
    });
  }

  async stopProject(id: string) {
    return this.request(`/projects/${id}/stop`, {
      method: 'POST',
    });
  }

  async restartProject(id: string) {
    return this.request(`/projects/${id}/restart`, {
      method: 'POST',
    });
  }

  async getProjectLogs(id: string, tail: number = 100) {
    return this.request(`/projects/${id}/logs?tail=${tail}`);
  }

  async getProjectStats(id: string) {
    return this.request(`/projects/${id}/stats`);
  }

  // GitHub
  async getGitHubRepos() {
    return this.request('/github/repositories');
  }

  async getGitHubBranches(repoFullName: string) {
    return this.request(`/github/repositories/${encodeURIComponent(repoFullName)}/branches`);
  }

  // Deployments
  async getRecentDeployments(limit: number = 10) {
    return this.request(`/deployments/recent?limit=${limit}`);
  }

  async getDeployments(projectId: string) {
    return this.request(`/deployments/project/${projectId}`);
  }

  async getDeployment(id: string) {
    return this.request(`/deployments/${id}`);
  }

  async getDeploymentLogs(id: string) {
    return this.request(`/deployments/${id}/logs`);
  }
}

export const api = new ApiClient();
