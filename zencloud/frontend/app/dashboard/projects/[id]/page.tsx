"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ExternalLink, GitBranch, Clock, Play, Settings,
  Loader2, XCircle, CheckCircle2, AlertCircle, RotateCw, Square,
  Terminal, ChevronDown,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "deployments" | "logs" | "settings";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [logs, setLogs] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("deployments");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) loadData();
  }, [user, authLoading]);

  // Auto-refresh deployments every 3 seconds when on deployments tab
  useEffect(() => {
    if (activeTab === "deployments" && project) {
      const interval = setInterval(() => {
        api.getDeployments(params.id).then(setDeployments).catch(() => {});
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, project, params.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [proj, deps] = await Promise.all([
        api.getProject(params.id),
        api.getDeployments(params.id),
      ]);
      console.log("Deployments loaded:", deps);
      setProject(proj);
      setDeployments(deps);
    } catch (err: any) {
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      if (!project?.container_id) {
        setLogs("No container found. Deploy the project first to see logs.");
        return;
      }
      const data = await api.getProjectLogs(params.id);
      setLogs(typeof data === "string" ? data : data.logs || JSON.stringify(data, null, 2));
    } catch (err: any) {
      setLogs("Failed to load logs: " + err.message);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "logs") loadLogs();
  };

  const handleAction = async (action: string) => {
    try {
      setActionLoading(action);
      if (action === "deploy") await api.deployProject(params.id);
      else if (action === "start") await api.startProject(params.id);
      else if (action === "stop") await api.stopProject(params.id);
      else if (action === "restart") await api.restartProject(params.id);
      else if (action === "delete") {
        if (confirm(`Are you sure you want to delete "${project?.name}"? This action cannot be undone.`)) {
          await api.deleteProject(params.id);
          router.push("/dashboard/projects");
          return;
        } else {
          setActionLoading("");
          return;
        }
      }
      await loadData();
    } catch (err: any) {
      setError(err.message || `Failed to ${action}`);
    } finally {
      setActionLoading("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "text-green-500";
      case "stopped": return "text-gray-400";
      case "deploying": return "text-blue-500";
      case "failed": return "text-red-500";
      default: return "text-gray-400";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "running": return "bg-green-500/10 border-green-500/20";
      case "stopped": return "bg-gray-500/10 border-gray-500/20";
      case "deploying": return "bg-blue-500/10 border-blue-500/20";
      case "failed": return "bg-red-500/10 border-red-500/20";
      default: return "bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "deploying": return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
      case "failed": return <XCircle className="w-3.5 h-3.5" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const getDeployStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-500";
      case "failed": return "text-red-500";
      case "deploying": return "text-blue-500";
      default: return "text-gray-400";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] gap-4">
        <XCircle className="w-12 h-12 text-red-500" />
        <p className="text-white text-lg">{error}</p>
        <Link href="/dashboard/projects" className="text-[#FF6B35] hover:underline text-sm">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top Bar */}
      <div className="border-b border-[#1E1E1E] bg-[#0A0A0A] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/projects"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Projects
              </Link>
              <span className="text-gray-600">/</span>
              <h1 className="text-lg font-semibold text-white">{project?.name}</h1>
              {project?.status && (
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBg(project.status)} ${getStatusColor(project.status)}`}
                >
                  {getStatusIcon(project.status)}
                  {project.status}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {project?.status === "stopped" || !project?.container_id ? (
                <button
                  onClick={() => handleAction("start")}
                  disabled={!!actionLoading || !project?.container_id}
                  className="bg-green-500/10 hover:bg-green-500/20 text-green-500 px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!project?.container_id ? "Deploy the project first" : ""}
                >
                  {actionLoading === "start" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Start
                </button>
              ) : (
                <button
                  onClick={() => handleAction("stop")}
                  disabled={!!actionLoading || !project?.container_id}
                  className="bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === "stop" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
                  Stop
                </button>
              )}
              <button
                onClick={() => handleAction("restart")}
                disabled={!!actionLoading || !project?.container_id}
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title={!project?.container_id ? "Deploy the project first" : ""}
              >
                {actionLoading === "restart" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
                Restart
              </button>
              <button
                onClick={() => handleAction("deploy")}
                disabled={!!actionLoading}
                className="bg-[#FF6B35] hover:bg-[#FF5722] text-white px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading === "deploy" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Deploy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")}><XCircle className="w-4 h-4" /></button>
          </div>
        )}

        {/* Project Info Card */}
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Framework</div>
              <div className="text-white font-medium">{project?.framework || "—"}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Branch</div>
              <div className="text-white font-medium flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-gray-400" />
                {project?.branch || "main"}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Last Updated</div>
              <div className="text-white font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {project?.updated_at ? new Date(project.updated_at).toLocaleString() : "—"}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">URL</div>
              {project?.port ? (
                <a
                  href={`http://localhost:${project.port}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF6B35] hover:text-[#FF5722] transition flex items-center gap-1 font-medium"
                >
                  localhost:{project.port}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-gray-500">Deploy to get URL</span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#1E1E1E] mb-6">
          <div className="flex gap-1">
            {(["deployments", "logs", "settings"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[#FF6B35] text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "deployments" && (
          <div className="space-y-3">
            {deployments.length === 0 ? (
              <div className="text-center py-16 bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1A1A1A] rounded-full mb-4">
                  <Play className="w-6 h-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No deployments yet</h3>
                <p className="text-gray-400 mb-4">Trigger your first deployment to get started</p>
                <button
                  onClick={() => handleAction("deploy")}
                  className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF5722] text-white px-5 py-2.5 rounded-lg font-medium transition"
                >
                  <Play className="w-4 h-4" />
                  Deploy Now
                </button>
              </div>
            ) : (
              deployments.map((dep, i) => (
                <div key={dep.id || i} className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl overflow-hidden hover:border-[#2A2A2A] transition">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-white text-sm font-medium mb-1">
                            {dep.commit_message || `Deployment #${deployments.length - i}`}
                          </div>
                          <div className="text-gray-500 text-xs flex items-center gap-3">
                            {dep.commit_sha && (
                              <span className="font-mono">{dep.commit_sha.slice(0, 7)}</span>
                            )}
                            {dep.created_at && (
                              <span>{new Date(dep.created_at).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className={`text-sm font-medium capitalize ${getDeployStatusColor(dep.status)}`}>
                        {dep.status || "unknown"}
                      </span>
                    </div>
                    {dep.build_logs ? (
                      <div className="mt-3">
                        <div className="text-xs text-gray-400 mb-2">Build Logs:</div>
                        <pre className="p-3 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-xs text-gray-300 font-mono overflow-auto max-h-[400px] whitespace-pre-wrap">
                          {dep.build_logs}
                        </pre>
                      </div>
                    ) : dep.status === "pending" || dep.status === "building" ? (
                      <div className="mt-3 p-3 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-xs text-gray-400 flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Waiting for build logs...
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "logs" && (
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A] bg-[#0F0F0F]">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400 font-medium">Application Logs</span>
              <button
                onClick={loadLogs}
                className="ml-auto text-gray-500 hover:text-white transition"
                title="Refresh logs"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
            <pre className="p-4 text-xs text-green-400 font-mono overflow-auto max-h-[500px] whitespace-pre-wrap">
              {logs || "No logs available. Start the project to see output."}
            </pre>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Project Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    defaultValue={project?.name}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Repository URL</label>
                  <input
                    type="text"
                    defaultValue={project?.repository_url}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Branch</label>
                  <input
                    type="text"
                    defaultValue={project?.branch || "main"}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div className="pt-2">
                  <button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
              <h3 className="text-red-500 font-semibold mb-2">Danger Zone</h3>
              <p className="text-gray-400 text-sm mb-4">
                Deleting this project will remove all deployments and data. This cannot be undone.
              </p>
              <button 
                onClick={() => handleAction("delete")}
                disabled={!!actionLoading}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {actionLoading === "delete" && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
