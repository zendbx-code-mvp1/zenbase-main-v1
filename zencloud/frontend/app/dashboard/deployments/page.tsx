"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Rocket, GitBranch, Clock, CheckCircle2, XCircle, AlertCircle,
  Play, Pause, RotateCcw, Trash2, Filter, Search, Calendar,
  User, GitCommit, Package, Server, Activity, ExternalLink,
  ChevronRight, BarChart3, TrendingUp, Zap, Info, Eye, History, Terminal, RefreshCw
} from "lucide-react";

type DeploymentStatus = "success" | "failed" | "in_progress" | "queued" | "cancelled";
type Environment = "production" | "staging" | "development";

interface Deployment {
  id: string;
  project: string;
  environment: Environment;
  status: DeploymentStatus;
  branch: string;
  commit: string;
  commitMessage: string;
  author: string;
  started: string;
  duration: string;
  url?: string;
  buildTime?: string;
  deployTime?: string;
}

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: "dep_1",
      project: "zencloud-web",
      environment: "production",
      status: "success",
      branch: "main",
      commit: "a3f2c1d",
      commitMessage: "Fix authentication bug and update dependencies",
      author: "John Doe",
      started: "2024-06-24T10:30:00Z",
      duration: "3m 24s",
      url: "https://zencloud-web.app",
      buildTime: "2m 10s",
      deployTime: "1m 14s"
    },
    {
      id: "dep_2",
      project: "api-service",
      environment: "production",
      status: "in_progress",
      branch: "main",
      commit: "b7e9d2a",
      commitMessage: "Add new API endpoints for user management",
      author: "Jane Smith",
      started: "2024-06-24T11:15:00Z",
      duration: "1m 45s",
      buildTime: "1m 30s",
      deployTime: "0m 15s"
    },
    {
      id: "dep_3",
      project: "dashboard-ui",
      environment: "staging",
      status: "success",
      branch: "develop",
      commit: "c4d8e1f",
      commitMessage: "Implement new dashboard features",
      author: "Mike Johnson",
      started: "2024-06-24T09:45:00Z",
      duration: "2m 58s",
      url: "https://staging-dashboard.app",
      buildTime: "1m 50s",
      deployTime: "1m 08s"
    },
    {
      id: "dep_4",
      project: "mobile-backend",
      environment: "production",
      status: "failed",
      branch: "main",
      commit: "d1a5b3c",
      commitMessage: "Update database schema and migrations",
      author: "Sarah Williams",
      started: "2024-06-24T08:20:00Z",
      duration: "4m 12s",
      buildTime: "3m 45s",
      deployTime: "0m 27s"
    },
    {
      id: "dep_5",
      project: "payment-service",
      environment: "staging",
      status: "queued",
      branch: "feature/payment-v2",
      commit: "e2b7c4d",
      commitMessage: "Integrate new payment gateway",
      author: "Alex Brown",
      started: "2024-06-24T11:30:00Z",
      duration: "-"
    },
    {
      id: "dep_6",
      project: "analytics-engine",
      environment: "development",
      status: "success",
      branch: "develop",
      commit: "f3c8d5e",
      commitMessage: "Optimize query performance",
      author: "Emily Davis",
      started: "2024-06-24T07:00:00Z",
      duration: "5m 30s",
      buildTime: "4m 20s",
      deployTime: "1m 10s"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DeploymentStatus>("all");
  const [environmentFilter, setEnvironmentFilter] = useState<"all" | Environment>("all");
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getStatusIcon = (status: DeploymentStatus) => {
    switch (status) {
      case "success": return <CheckCircle2 className="w-4 h-4" />;
      case "failed": return <XCircle className="w-4 h-4" />;
      case "in_progress": return <Activity className="w-4 h-4 animate-pulse" />;
      case "queued": return <Clock className="w-4 h-4" />;
      case "cancelled": return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: DeploymentStatus) => {
    switch (status) {
      case "success": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "failed": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "in_progress": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "queued": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "cancelled": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getEnvironmentColor = (env: Environment) => {
    switch (env) {
      case "production": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "staging": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "development": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    }
  };

  const filteredDeployments = deployments.filter(dep => {
    const matchesSearch = searchQuery === "" || 
      dep.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || dep.status === statusFilter;
    const matchesEnvironment = environmentFilter === "all" || dep.environment === environmentFilter;
    return matchesSearch && matchesStatus && matchesEnvironment;
  });

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Deployments</h1>
            <p className="text-sm text-gray-400">Monitor and manage your application deployments</p>
          </div>
          <button className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
            <Rocket className="w-4 h-4" />
            New Deployment
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5">
          <Link
            href="/dashboard/deployments"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white border-b-2 border-[#FF6B35]"
          >
            <Zap className="w-4 h-4" />
            Active
          </Link>
          <Link
            href="/dashboard/deployments/history"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border-b-2 border-transparent transition"
          >
            <History className="w-4 h-4" />
            History
          </Link>
          <Link
            href="/dashboard/deployments/logs"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border-b-2 border-transparent transition"
          >
            <Terminal className="w-4 h-4" />
            Build Logs
          </Link>
          <Link
            href="/dashboard/deployments/runtime"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border-b-2 border-transparent transition"
          >
            <Activity className="w-4 h-4" />
            Runtime Logs
          </Link>
          <Link
            href="/dashboard/deployments/rollback"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border-b-2 border-transparent transition"
          >
            <RotateCcw className="w-4 h-4" />
            Rollback
          </Link>
          <Link
            href="/dashboard/deployments/redeploy"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border-b-2 border-transparent transition"
          >
            <RefreshCw className="w-4 h-4" />
            Redeploy
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Successful</p>
                <p className="text-xl font-bold text-white">
                  {deployments.filter(d => d.status === "success").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-gray-400">In Progress</p>
                <p className="text-xl font-bold text-white">
                  {deployments.filter(d => d.status === "in_progress").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Failed</p>
                <p className="text-xl font-bold text-white">
                  {deployments.filter(d => d.status === "failed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Queued</p>
                <p className="text-xl font-bold text-white">
                  {deployments.filter(d => d.status === "queued").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search deployments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                {(["all", "success", "in_progress", "failed", "queued"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                      statusFilter === status
                        ? "bg-[#FF6B35] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {status === "in_progress" ? "Active" : status}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                {(["all", "production", "staging", "development"] as const).map((env) => (
                  <button
                    key={env}
                    onClick={() => setEnvironmentFilter(env)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                      environmentFilter === env
                        ? "bg-[#FF6B35] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deployments List */}
        <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Recent Deployments</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {filteredDeployments.length} deployments found
            </p>
          </div>
          <div className="divide-y divide-white/5">
            {filteredDeployments.map((deployment) => (
              <div
                key={deployment.id}
                className="px-6 py-4 hover:bg-white/2 transition cursor-pointer"
                onClick={() => {
                  setSelectedDeployment(deployment);
                  setShowDetailModal(true);
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      deployment.status === "success" ? "bg-gradient-to-br from-green-500 to-green-700" :
                      deployment.status === "failed" ? "bg-gradient-to-br from-red-500 to-red-700" :
                      deployment.status === "in_progress" ? "bg-gradient-to-br from-blue-500 to-blue-700" :
                      "bg-gradient-to-br from-gray-500 to-gray-700"
                    }`}>
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-white">{deployment.project}</h3>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusColor(deployment.status)}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(deployment.status)}
                            {deployment.status.toUpperCase().replace("_", " ")}
                          </span>
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getEnvironmentColor(deployment.environment)}`}>
                          {deployment.environment.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">{deployment.commitMessage}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3" />
                          {deployment.branch}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitCommit className="w-3 h-3" />
                          {deployment.commit}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {deployment.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {deployment.duration}
                        </span>
                        {deployment.url && (
                          <a
                            href={deployment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#FF6B35] hover:text-[#FF6B35]/80"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Site
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Redeploy functionality");
                      }}
                      className="p-2 hover:bg-white/5 rounded-lg transition text-gray-400 hover:text-white"
                      title="Redeploy"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
            ))}
            {filteredDeployments.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Rocket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No deployments found</p>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Deployment Detail Modal */}
        {showDetailModal && selectedDeployment && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
              {/* Header */}
              <div className="sticky top-0 bg-[#111116] px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedDeployment.status === "success" ? "bg-gradient-to-br from-green-500 to-green-700" :
                    selectedDeployment.status === "failed" ? "bg-gradient-to-br from-red-500 to-red-700" :
                    selectedDeployment.status === "in_progress" ? "bg-gradient-to-br from-blue-500 to-blue-700" :
                    "bg-gradient-to-br from-gray-500 to-gray-700"
                  }`}>
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedDeployment.project}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusColor(selectedDeployment.status)}`}>
                        {selectedDeployment.status.toUpperCase().replace("_", " ")}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getEnvironmentColor(selectedDeployment.environment)}`}>
                        {selectedDeployment.environment.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Overview */}
                <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Deployment Overview</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">Project</p>
                      <p className="text-white font-medium">{selectedDeployment.project}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Environment</p>
                      <p className="text-white font-medium capitalize">{selectedDeployment.environment}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Branch</p>
                      <p className="text-white font-mono">{selectedDeployment.branch}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Commit</p>
                      <p className="text-white font-mono">{selectedDeployment.commit}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Author</p>
                      <p className="text-white">{selectedDeployment.author}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Duration</p>
                      <p className="text-white">{selectedDeployment.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Commit Info */}
                <div className="bg-gradient-to-br from-[#FF6B35]/10 to-transparent border border-[#FF6B35]/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <GitCommit className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Commit Message</p>
                      <p className="text-xs text-gray-300">{selectedDeployment.commitMessage}</p>
                    </div>
                  </div>
                </div>

                {/* Build Details */}
                {selectedDeployment.buildTime && (
                  <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Build & Deploy Times</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-gray-400">Build Time</span>
                        </div>
                        <span className="text-sm font-semibold text-white">{selectedDeployment.buildTime}</span>
                      </div>
                      {selectedDeployment.deployTime && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs text-gray-400">Deploy Time</span>
                          </div>
                          <span className="text-sm font-semibold text-white">{selectedDeployment.deployTime}</span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#FF6B35]" />
                            <span className="text-xs text-gray-400">Total Duration</span>
                          </div>
                          <span className="text-sm font-bold text-white">{selectedDeployment.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* URL */}
                {selectedDeployment.url && (
                  <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Deployment URL</h3>
                    <a
                      href={selectedDeployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#FF6B35] hover:text-[#FF6B35]/80 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">{selectedDeployment.url}</span>
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedDeployment.status === "success" && (
                    <button className="flex-1 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Redeploy
                    </button>
                  )}
                  {selectedDeployment.status === "in_progress" && (
                    <button className="flex-1 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2">
                      <Pause className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                  {selectedDeployment.status === "failed" && (
                    <button className="flex-1 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Retry
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
