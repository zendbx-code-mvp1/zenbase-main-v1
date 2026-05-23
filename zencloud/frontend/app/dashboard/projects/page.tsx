"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Search, CheckCircle2, XCircle, Loader2,
  Clock, Server, TrendingUp, Play, Square, RotateCw,
  FolderGit2, Activity,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ProjectsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) loadProjects();
  }, [user, authLoading, router]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (projectId: string, action: string) => {
    try {
      if (action === "start") await api.startProject(projectId);
      else if (action === "stop") await api.stopProject(projectId);
      else if (action === "restart") await api.restartProject(projectId);
      else if (action === "deploy") await api.deployProject(projectId);
      loadProjects();
    } catch (err: any) {
      setError(err.message || `Failed to ${action} project`);
    }
  };

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      case "running": return <CheckCircle2 className="w-3 h-3" />;
      case "deploying": return <Loader2 className="w-3 h-3 animate-spin" />;
      case "failed": return <XCircle className="w-3 h-3" />;
      default: return <XCircle className="w-3 h-3" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Projects</h1>
            <p className="text-sm text-gray-400 mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link
            href="/dashboard/projects/new"
            className="bg-[#FF6B35] hover:bg-[#FF5722] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
          />
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1A1A1A] rounded-full mb-4">
              <FolderGit2 className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery
                ? "Try a different search term"
                : "Deploy your first app from a Git repository"}
            </p>
            {!searchQuery && (
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF5722] text-white px-6 py-3 rounded-lg font-medium transition"
              >
                <Plus className="w-5 h-5" />
                Create Project
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-5 hover:border-[#2A2A2A] transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="text-lg font-semibold text-white hover:text-[#FF6B35] transition truncate"
                      >
                        {project.name}
                      </Link>
                      <span
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${getStatusBg(project.status)} ${getStatusColor(project.status)}`}
                      >
                        {getStatusIcon(project.status)}
                        {project.status || "idle"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5" />
                        {project.framework || "Unknown"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {project.branch || "main"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {project.updated_at
                          ? new Date(project.updated_at).toLocaleString()
                          : "Never deployed"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    {project.status === "stopped" ? (
                      <button
                        onClick={() => handleAction(project.id, "start")}
                        className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition"
                        title="Start"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(project.id, "stop")}
                        className="p-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 rounded-lg transition"
                        title="Stop"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleAction(project.id, "restart")}
                      className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition"
                      title="Restart"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAction(project.id, "deploy")}
                      className="px-3 py-2 bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 text-[#FF6B35] rounded-lg transition text-sm font-medium"
                    >
                      Deploy
                    </button>
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-lg transition text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
