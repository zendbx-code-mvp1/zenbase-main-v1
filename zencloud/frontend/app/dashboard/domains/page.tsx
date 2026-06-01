"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe, Plus, CheckCircle2, XCircle, Clock, Loader2,
  ExternalLink, Trash2, RefreshCw, Copy, ChevronRight,
  AlertTriangle, Shield, Zap, Search, X,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type DomainStatus = "active" | "pending" | "failed" | "none";

interface DomainEntry {
  projectId: string;
  projectName: string;
  subdomain: string;
  customDomain: string | null;
  status: string;
  domainStatus: DomainStatus;
}

function StatusBadge({ status }: { status: DomainStatus }) {
  const map = {
    active: { label: "Active", cls: "bg-green-500/10 text-green-400 border-green-500/20", icon: <CheckCircle2 className="w-3 h-3" /> },
    pending: { label: "Pending DNS", cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: <Clock className="w-3 h-3" /> },
    failed: { label: "Failed", cls: "bg-red-500/10 text-red-400 border-red-500/20", icon: <XCircle className="w-3 h-3" /> },
    none: { label: "No custom domain", cls: "bg-white/5 text-gray-500 border-white/8", icon: <Globe className="w-3 h-3" /> },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.cls}`}>
      {s.icon}{s.label}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="p-1 rounded text-gray-500 hover:text-white transition" title="Copy">
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function DomainsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [domains, setDomains] = useState<DomainEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Add domain modal state
  const [showAdd, setShowAdd] = useState(false);
  const [addProjectId, setAddProjectId] = useState("");
  const [addDomain, setAddDomain] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // DNS instructions modal
  const [dnsProject, setDnsProject] = useState<DomainEntry | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) loadDomains();
  }, [user, authLoading]);

  const loadDomains = async () => {
    try {
      setLoading(true);
      setError("");
      const projects = await api.getProjects();
      const entries: DomainEntry[] = projects.map((p: any) => ({
        projectId: p.id,
        projectName: p.name,
        subdomain: `${p.subdomain}.zencloud.dev`,
        customDomain: p.custom_domain || null,
        status: p.status,
        domainStatus: p.custom_domain
          ? (p.status === "running" || p.status === "active" ? "active" : "pending")
          : "none",
      }));
      setDomains(entries);
    } catch (e: any) {
      setError(e.message || "Failed to load domains");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!addProjectId || !addDomain.trim()) return;
    setAddLoading(true);
    setAddError("");
    try {
      // Basic domain validation
      const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      if (!domainRegex.test(addDomain.trim())) {
        throw new Error("Invalid domain format. Example: myapp.com");
      }
      await api.updateCustomDomain(addProjectId, addDomain.trim().toLowerCase());
      setShowAdd(false);
      setAddDomain("");
      setAddProjectId("");
      await loadDomains();
      // Show DNS instructions for the newly added domain
      const updated = domains.find(d => d.projectId === addProjectId);
      if (updated) setDnsProject({ ...updated, customDomain: addDomain.trim().toLowerCase(), domainStatus: "pending" });
    } catch (e: any) {
      setAddError(e.message || "Failed to add domain");
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveDomain = async (projectId: string) => {
    try {
      await api.updateCustomDomain(projectId, null);
      await loadDomains();
    } catch (e: any) {
      setError(e.message || "Failed to remove domain");
    }
  };

  const filtered = domains.filter(d =>
    d.projectName.toLowerCase().includes(search.toLowerCase()) ||
    d.subdomain.includes(search.toLowerCase()) ||
    (d.customDomain?.includes(search.toLowerCase()) ?? false)
  );

  const stats = {
    total: domains.length,
    custom: domains.filter(d => d.customDomain).length,
    active: domains.filter(d => d.domainStatus === "active").length,
    pending: domains.filter(d => d.domainStatus === "pending").length,
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0B0B0F] min-h-full space-y-6">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Domains</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage subdomains and custom domains for your projects</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadDomains} className="p-2 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setShowAdd(true); setAddError(""); }}
            className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-3 py-2 rounded-lg text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Domain
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs flex justify-between">
          {error}
          <button onClick={() => setError("")}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Projects", value: stats.total, icon: Globe, color: "#FF6B35" },
          { label: "Custom Domains", value: stats.custom, icon: Zap, color: "#8b5cf6" },
          { label: "Active", value: stats.active, icon: CheckCircle2, color: "#22c55e" },
          { label: "Pending DNS", value: stats.pending, icon: Clock, color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} className="bg-[#111116] border border-white/6 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.color + "18" }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-[10px] text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── SEARCH ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
        <input
          type="text"
          placeholder="Search projects or domains..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#111116] border border-white/6 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6B35]/40 transition"
        />
      </div>

      {/* ── DOMAIN TABLE ── */}
      {filtered.length === 0 ? (
        <div className="bg-[#111116] border border-white/6 rounded-xl flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Globe className="w-7 h-7 text-gray-600" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            {search ? "No results found" : "No projects yet"}
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            {search ? "Try a different search term" : "Create a project to get a free subdomain"}
          </p>
          {!search && (
            <Link href="/dashboard/projects/new" className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              <Plus className="w-4 h-4" /> New Project
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Project</div>
            <div className="col-span-3">Zencloud Subdomain</div>
            <div className="col-span-3">Custom Domain</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y divide-white/4">
            {filtered.map(d => (
              <div key={d.projectId} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/2 transition group">
                {/* Project */}
                <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    d.status === "running" ? "bg-green-400" :
                    d.status === "failed" ? "bg-red-400" :
                    d.status === "deploying" ? "bg-blue-400 animate-pulse" : "bg-gray-500"
                  }`} />
                  <div className="min-w-0">
                    <Link href={`/dashboard/projects/${d.projectId}`} className="text-sm font-medium text-white hover:text-[#FF6B35] transition truncate block">
                      {d.projectName}
                    </Link>
                    <span className="text-[10px] text-gray-500 capitalize">{d.status}</span>
                  </div>
                </div>

                {/* Subdomain */}
                <div className="col-span-3 flex items-center gap-1.5 min-w-0">
                  <span className="text-xs text-gray-300 font-mono truncate">{d.subdomain}</span>
                  <CopyButton text={d.subdomain} />
                  <a href={`https://${d.subdomain}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#FF6B35] transition shrink-0">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Custom Domain */}
                <div className="col-span-3 flex items-center gap-1.5 min-w-0">
                  {d.customDomain ? (
                    <>
                      <span className="text-xs text-white font-mono truncate">{d.customDomain}</span>
                      <CopyButton text={d.customDomain} />
                      <a href={`https://${d.customDomain}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#FF6B35] transition shrink-0">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  ) : (
                    <button
                      onClick={() => { setAddProjectId(d.projectId); setShowAdd(true); setAddError(""); }}
                      className="text-xs text-[#FF6B35] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add domain
                    </button>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <StatusBadge status={d.domainStatus} />
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                  {d.customDomain && (
                    <>
                      <button
                        onClick={() => setDnsProject(d)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition"
                        title="DNS Instructions"
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveDomain(d.projectId)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/8 transition"
                        title="Remove domain"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <Link href={`/dashboard/projects/${d.projectId}`} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition" title="View project">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HOW IT WORKS ── */}
      <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">How custom domains work</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { step: "1", icon: Plus, title: "Add your domain", desc: "Click 'Add Domain' and enter your custom domain (e.g. myapp.com or app.mysite.com)." },
            { step: "2", icon: Shield, title: "Configure DNS", desc: "Add a CNAME record pointing your domain to your ZenCloud subdomain." },
            { step: "3", icon: CheckCircle2, title: "Go live", desc: "DNS propagates in minutes. SSL is provisioned automatically — no setup needed." },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center shrink-0 mt-0.5">
                <s.icon className="w-3.5 h-3.5 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white mb-0.5">Step {s.step} — {s.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ADD DOMAIN MODAL ── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111116] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-sm font-semibold text-white">Add Custom Domain</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {addError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs">
                  {addError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Project</label>
                <select
                  value={addProjectId}
                  onChange={e => setAddProjectId(e.target.value)}
                  className="w-full bg-[#1a1a20] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6B35]/50 transition"
                >
                  <option value="">Select a project…</option>
                  {domains.map(d => (
                    <option key={d.projectId} value={d.projectId}>{d.projectName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Domain</label>
                <input
                  type="text"
                  placeholder="myapp.com or app.mysite.com"
                  value={addDomain}
                  onChange={e => setAddDomain(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddDomain()}
                  className="w-full bg-[#1a1a20] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6B35]/50 transition"
                />
                <p className="text-[10px] text-gray-600 mt-1.5">Enter a root domain or subdomain. Do not include https://</p>
              </div>

              {/* DNS preview */}
              {addDomain && addProjectId && (
                <div className="bg-[#0d0d12] border border-white/5 rounded-xl p-4">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">DNS Record to add</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600 mb-1">Type</p>
                      <p className="font-mono text-white bg-white/5 px-2 py-1 rounded">CNAME</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Name</p>
                      <p className="font-mono text-white bg-white/5 px-2 py-1 rounded truncate">
                        {addDomain.includes(".") ? addDomain.split(".")[0] : "@"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Value</p>
                      <p className="font-mono text-[#FF6B35] bg-white/5 px-2 py-1 rounded truncate">
                        {domains.find(d => d.projectId === addProjectId)?.subdomain ?? "…"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
              <button onClick={() => setShowAdd(false)} className="text-sm text-gray-400 hover:text-white transition px-3 py-2">
                Cancel
              </button>
              <button
                onClick={handleAddDomain}
                disabled={addLoading || !addProjectId || !addDomain.trim()}
                className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-5 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {addLoading ? "Saving…" : "Add Domain"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DNS INSTRUCTIONS MODAL ── */}
      {dnsProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111116] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <h2 className="text-sm font-semibold text-white">DNS Configuration</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">{dnsProject.customDomain}</p>
              </div>
              <button onClick={() => setDnsProject(null)} className="text-gray-500 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start gap-3 bg-yellow-500/5 border border-yellow-500/15 rounded-xl p-4">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-300 leading-relaxed">
                  Add the following DNS record at your domain registrar. Changes can take up to 48 hours to propagate, but usually complete within minutes.
                </p>
              </div>

              {/* CNAME record */}
              <div>
                <p className="text-xs font-semibold text-white mb-3">Required DNS Record</p>
                <div className="bg-[#0d0d12] border border-white/5 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-3 gap-px bg-white/5">
                    {["Type", "Name / Host", "Value / Points to"].map(h => (
                      <div key={h} className="bg-[#0d0d12] px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{h}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-white/5">
                    <div className="bg-[#111116] px-4 py-3 font-mono text-sm text-white">CNAME</div>
                    <div className="bg-[#111116] px-4 py-3 font-mono text-sm text-white flex items-center gap-1.5">
                      <span className="truncate">{dnsProject.customDomain?.split(".")[0] ?? "@"}</span>
                      <CopyButton text={dnsProject.customDomain?.split(".")[0] ?? "@"} />
                    </div>
                    <div className="bg-[#111116] px-4 py-3 font-mono text-sm text-[#FF6B35] flex items-center gap-1.5">
                      <span className="truncate">{dnsProject.subdomain}</span>
                      <CopyButton text={dnsProject.subdomain} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Registrar guides */}
              <div>
                <p className="text-xs font-semibold text-white mb-2">Popular registrar guides</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "Cloudflare", url: "https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/" },
                    { name: "GoDaddy", url: "https://www.godaddy.com/help/add-a-cname-record-19236" },
                    { name: "Namecheap", url: "https://www.namecheap.com/support/knowledgebase/article.aspx/9646/2237/how-to-create-a-cname-record-for-your-domain/" },
                  ].map(r => (
                    <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 bg-white/4 hover:bg-white/8 border border-white/6 rounded-lg text-xs text-gray-300 hover:text-white transition">
                      {r.name}
                      <ExternalLink className="w-3 h-3 text-gray-600" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/15 rounded-xl p-4">
                <Shield className="w-4 h-4 text-green-400 shrink-0" />
                <p className="text-xs text-gray-300">
                  SSL certificate will be automatically provisioned once DNS propagates. No manual setup required.
                </p>
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-white/5">
              <button onClick={() => setDnsProject(null)} className="bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
