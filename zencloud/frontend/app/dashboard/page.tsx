"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Plus, Search, Activity, Clock, CheckCircle2, XCircle, Loader2,
  Zap, TrendingUp, Server, Database, Play, Square, RotateCw, Trash2
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
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

    if (user) {
      loadProjects();
    }
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

  const handleProjectAction = async (projectId: string, action: string) => {
    try {
      switch (action) {
        case "start":
          await api.startProject(projectId);
          break;
        case "stop":
          await api.stopProject(projectId);
          break;
        case "restart":
          await api.restartProject(projectId);
          break;
        case "deploy":
          await api.deployProject(projectId);
          break;
      }
      loadProjects();
    } catch (err: any) {
      setError(err.message || `Failed to ${action} project`);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const stats = {
    total: projects.length,
    running: projects.filter(p => p.status === "running").length,
    stopped: projects.filter(p => p.status === "stopped").length,
    deploying: projects.filter(p => p.status === "deploying").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-green-500";
      case "stopped":
        return "text-gray-500";
      case "deploying":
        return "text-blue-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500/10 border-green-500/20";
      case "stopped":
        return "bg-gray-500/10 border-gray-500/20";
      case "deploying":
        return "bg-blue-500/10 border-blue-500/20";
      case "failed":
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle2 className="w-3 h-3" />;
      case "stopped":
        return <XCircle className="w-3 h-3" />;
      case "deploying":
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case "failed":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
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
      {/* Top Bar */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1">Manage and monitor your deployments</p>
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-300">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Projects</span>
              <Server className="w-5 h-5 text-gray-500" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>

          <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Running</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-500">{stats.running}</div>
          </div>

          <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Stopped</span>
              <XCircle className="w-5 h-5 text-gray-500" />
            </div>
            <div className="text-3xl font-bold text-gray-400">{stats.stopped}</div>
          </div>

          <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Deploying</span>
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-500">{stats.deploying}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
            />
          </div>
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1A1A1A] rounded-full mb-4">
              <Activity className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? "Try a different search term" : "Get started by creating your first project"}
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
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-5 hover:border-[#2A2A2A] transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link 
                        href={`/dashboard/projects/${project.id}`}
                        className="text-lg font-semibold text-white hover:text-[#FF6B35] transition"
                      >
                        {project.name}
                      </Link>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBg(project.status)} ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        {project.status || "idle"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Server className="w-4 h-4" />
                        {project.environment || "production"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {project.updated_at ? new Date(project.updated_at).toLocaleString() : "Never deployed"}
                      </span>
                      {project.repository_url && (
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4" />
                          {project.branch || "main"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {project.status === "stopped" ? (
                      <button
                        onClick={() => handleProjectAction(project.id, "start")}
                        className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition"
                        title="Start"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleProjectAction(project.id, "stop")}
                        className="p-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 rounded-lg transition"
                        title="Stop"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleProjectAction(project.id, "restart")}
                      className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition"
                      title="Restart"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleProjectAction(project.id, "deploy")}
                      className="px-3 py-2 bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 text-[#FF6B35] rounded-lg transition text-sm font-medium"
                      title="Deploy"
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
