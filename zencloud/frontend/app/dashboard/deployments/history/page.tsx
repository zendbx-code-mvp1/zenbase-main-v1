"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Rocket, GitBranch, Clock, CheckCircle2, XCircle, AlertCircle,
  RotateCcw, Filter, Search, Calendar, User, GitCommit, Download,
  ChevronRight, TrendingUp, BarChart3, Archive, Eye, FileText, Zap, History, Terminal, Activity, RefreshCw
} from "lucide-react";

type DeploymentStatus = "success" | "failed" | "cancelled";
type Environment = "production" | "staging" | "development";

interface HistoricalDeployment {
  id: string;
  project: string;
  environment: Environment;
  status: DeploymentStatus;
  branch: string;
  commit: string;
  commitMessage: string;
  author: string;
  startedAt: string;
  completedAt: string;
  duration: string;
  url?: string;
  buildTime?: string;
  deployTime?: string;
}

export default function DeploymentHistoryPage() {
  const [deployments] = useState<HistoricalDeployment[]>([
    {
      id: "hist_1",
      project: "zencloud-web",
      environment: "production",
      status: "success",
      branch: "main",
      commit: "a3f2c1d",
      commitMessage: "Fix authentication bug and update dependencies",
      author: "John Doe",
      startedAt: "2024-06-24T10:30:00Z",
      completedAt: "2024-06-24T10:33:24Z",
      duration: "3m 24s",
      url: "https://zencloud-web.app",
      buildTime: "2m 10s",
      deployTime: "1m 14s"
    },
    {
      id: "hist_2",
      project: "api-service",
      environment: "production",
      status: "success",
      branch: "main",
      commit: "b7e9d2a",
      commitMessage: "Add new API endpoints for user management",
      author: "Jane Smith",
      startedAt: "2024-06-23T15:20:00Z",
      completedAt: "2024-06-23T15:22:45Z",
      duration: "2m 45s",
      buildTime: "1m 50s",
      deployTime: "0m 55s"
    },
    {
      id: "hist_3",
      project: "dashboard-ui",
      environment: "staging",
      status: "success",
      branch: "develop",
      commit: "c4d8e1f",
      commitMessage: "Implement new dashboard features",
      author: "Mike Johnson",
      startedAt: "2024-06-23T09:45:00Z",
      completedAt: "2024-06-23T09:47:58Z",
      duration: "2m 58s",
      url: "https://staging-dashboard.app",
      buildTime: "1m 50s",
      deployTime: "1m 08s"
    },
    {
      id: "hist_4",
      project: "mobile-backend",
      environment: "production",
      status: "failed",
      branch: "main",
      commit: "d1a5b3c",
      commitMessage: "Update database schema and migrations",
      author: "Sarah Williams",
      startedAt: "2024-06-22T14:20:00Z",
      completedAt: "2024-06-22T14:24:12Z",
      duration: "4m 12s",
      buildTime: "3m 45s",
      deployTime: "0m 27s"
    },
    {
      id: "hist_5",
      project: "payment-service",
      environment: "staging",
      status: "success",
      branch: "main",
      commit: "e2b7c4d",
      commitMessage: "Integrate new payment gateway",
      author: "Alex Brown",
      startedAt: "2024-06-22T11:00:00Z",
      completedAt: "2024-06-22T11:03:15Z",
      duration: "3m 15s",
      buildTime: "2m 05s",
      deployTime: "1m 10s"
    },
    {
      id: "hist_6",
      project: "analytics-engine",
      environment: "development",
      status: "success",
      branch: "develop",
      commit: "f3c8d5e",
      commitMessage: "Optimize query performance",
      author: "Emily Davis",
      startedAt: "2024-06-21T16:30:00Z",
      completedAt: "2024-06-21T16:36:00Z",
      duration: "5m 30s",
      buildTime: "4m 20s",
      deployTime: "1m 10s"
    },
    {
      id: "hist_7",
      project: "zencloud-web",
      environment: "production",
      status: "success",
      branch: "main",
      commit: "g4h9f6e",
      commitMessage: "Update landing page design",
      author: "John Doe",
      startedAt: "2024-06-21T10:15:00Z",
      completedAt: "2024-06-21T10:18:30Z",
      duration: "3m 30s",
      url: "https://zencloud-web.app",
      buildTime: "2m 15s",
      deployTime: "1m 15s"
    },
    {
      id: "hist_8",
      project: "api-service",
      environment: "staging",
      status: "cancelled",
      branch: "feature/v2",
      commit: "h5i0g7f",
      commitMessage: "Refactor authentication middleware",
      author: "Jane Smith",
      startedAt: "2024-06-20T13:45:00Z",
      completedAt: "2024-06-20T13:46:10Z",
      duration: "1m 10s",
      buildTime: "1m 05s",
      deployTime: "0m 05s"
    },
    {
      id: "hist_9",
      project: "payment-service",
      environment: "production",
      status: "success",
      branch: "main",
      commit: "i6j1h8g",
      commitMessage: "Fix payment processing timeout",
      author: "Alex Brown",
      startedAt: "2024-06-20T09:00:00Z",
      completedAt: "2024-06-20T09:02:40Z",
      duration: "2m 40s",
      buildTime: "1m 45s",
      deployTime: "0m 55s"
    },
    {
      id: "hist_10",
      project: "dashboard-ui",
      environment: "production",
      status: "success",
      branch: "main",
      commit: "j7k2i9h",
      commitMessage: "Add new analytics dashboard",
      author: "Mike Johnson",
      startedAt: "2024-06-19T15:30:00Z",
      completedAt: "2024-06-19T15:33:45Z",
      duration: "3m 45s",
      url: "https://dashboard.app",
      buildTime: "2m 30s",
      deployTime: "1m 15s"
    },
    {
      id: "hist_11",
      project: "mobile-backend",
      environment: "staging",
      status: "failed",
      branch: "develop",
      commit: "k8l3j0i",
      commitMessage: "Add push notification service",
      author: "Sarah Williams",
      startedAt: "2024-06-19T11:20:00Z",
      completedAt: "2024-06-19T11:23:50Z",
      duration: "3m 50s",
      buildTime: "3m 20s",
      deployTime: "0m 30s"
    },
    {
      id: "hist_12",
      project: "analytics-engine",
      environment: "production",
      status: "success",
      branch: "main",
      commit: "l9m4k1j",
      commitMessage: "Improve data aggregation pipeline",
      author: "Emily Davis",
      startedAt: "2024-06-18T14:00:00Z",
      completedAt: "2024-06-18T14:06:20Z",
      duration: "6m 20s",
      buildTime: "5m 10s",
      deployTime: "1m 10s"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DeploymentStatus>("all");
  const [environmentFilter, setEnvironmentFilter] = useState<"all" | Environment>("all");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("all");
  const [selectedDeployment, setSelectedDeployment] = useState<HistoricalDeployment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getStatusColor = (status: DeploymentStatus) => {
    switch (status) {
      case "success": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "failed": return "bg-red-500/10 text-red-400 border-red-500/20";
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
    
    let matchesDate = true;
    if (dateRange !== "all") {
      const deployDate = new Date(dep.startedAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - deployDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateRange === "today") matchesDate = daysDiff === 0;
      else if (dateRange === "week") matchesDate = daysDiff <= 7;
      else if (dateRange === "month") matchesDate = daysDiff <= 30;
    }
    
    return matchesSearch && matchesStatus && matchesEnvironment && matchesDate;
  });

  const successRate = deployments.length > 0 
    ? Math.round((deployments.filter(d => d.status === "success").length / deployments.length) * 100)
    : 0;

  const avgDuration = deployments.length > 0
    ? deployments.reduce((acc, d) => {
        const minutes = parseInt(d.duration.split("m")[0]);
        const seconds = parseInt(d.duration.split(" ")[1]?.replace("s", "") || "0");
        return acc + minutes * 60 + seconds;
      }, 0) / deployments.length
    : 0;

  const formatAvgDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Deployments</h1>
            <p className="text-sm text-gray-400">View and analyze past deployment records</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5">
          <Link
            href="/dashboard/deployments"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border-b-2 border-transparent transition"
          >
            <Zap className="w-4 h-4" />
            Active
          </Link>
          <Link
            href="/dashboard/deployments/history"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white border-b-2 border-[#FF6B35]"
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
              <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                <Archive className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Deployments</p>
                <p className="text-xl font-bold text-white">{deployments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Success Rate</p>
                <p className="text-xl font-bold text-white">{successRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Avg. Duration</p>
                <p className="text-xl font-bold text-white">{formatAvgDuration(avgDuration)}</p>
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
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                {(["all", "success", "failed", "cancelled"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                      statusFilter === status
                        ? "bg-[#FF6B35] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {status}
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
                    {env === "all" ? "All Env" : env.slice(0, 4)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                {(["today", "week", "month", "all"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                      dateRange === range
                        ? "bg-[#FF6B35] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deployment History Table */}
        <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Deployment Records</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {filteredDeployments.length} deployments found
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Environment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDeployments.map((deployment) => (
                  <tr
                    key={deployment.id}
                    className="hover:bg-white/2 transition cursor-pointer"
                    onClick={() => {
                      setSelectedDeployment(deployment);
                      setShowDetailModal(true);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          deployment.status === "success" ? "bg-gradient-to-br from-green-500 to-green-700" :
                          deployment.status === "failed" ? "bg-gradient-to-br from-red-500 to-red-700" :
                          "bg-gradient-to-br from-gray-500 to-gray-700"
                        }`}>
                          <Rocket className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{deployment.project}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{deployment.commitMessage}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${getEnvironmentColor(deployment.environment)}`}>
                        {deployment.environment.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${getStatusColor(deployment.status)}`}>
                        {deployment.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <GitBranch className="w-3 h-3" />
                        <span className="font-mono">{deployment.branch}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <User className="w-3 h-3" />
                        <span>{deployment.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-xs text-white font-mono">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {deployment.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                      {new Date(deployment.completedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDeployment(deployment);
                            setShowDetailModal(true);
                          }}
                          className="p-1.5 hover:bg-white/5 rounded-lg transition text-gray-400 hover:text-white"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {deployment.status === "success" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("Redeploy functionality");
                            }}
                            className="p-1.5 hover:bg-white/5 rounded-lg transition text-gray-400 hover:text-white"
                            title="Redeploy"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDeployments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <Archive className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">No deployment history found</p>
                      <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                    "bg-gradient-to-br from-gray-500 to-gray-700"
                  }`}>
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedDeployment.project}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusColor(selectedDeployment.status)}`}>
                        {selectedDeployment.status.toUpperCase()}
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
                {/* Timeline */}
                <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-4">Deployment Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Started</p>
                        <p className="text-xs text-gray-400">
                          {new Date(selectedDeployment.startedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {selectedDeployment.buildTime && (
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-yellow-500/10 rounded-full flex items-center justify-center shrink-0">
                          <BarChart3 className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">Build Completed</p>
                          <p className="text-xs text-gray-400">Duration: {selectedDeployment.buildTime}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        selectedDeployment.status === "success" ? "bg-green-500/10" :
                        selectedDeployment.status === "failed" ? "bg-red-500/10" :
                        "bg-gray-500/10"
                      }`}>
                        {selectedDeployment.status === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : selectedDeployment.status === "failed" ? (
                          <XCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {selectedDeployment.status === "success" ? "Completed Successfully" :
                           selectedDeployment.status === "failed" ? "Failed" : "Cancelled"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(selectedDeployment.completedAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Total duration: {selectedDeployment.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overview */}
                <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Deployment Details</h3>
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
                      <p className="text-gray-500 mb-1">Status</p>
                      <p className="text-white capitalize">{selectedDeployment.status}</p>
                    </div>
                  </div>
                </div>

                {/* Commit Message */}
                <div className="bg-gradient-to-br from-[#FF6B35]/10 to-transparent border border-[#FF6B35]/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <GitCommit className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Commit Message</p>
                      <p className="text-xs text-gray-300">{selectedDeployment.commitMessage}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                {selectedDeployment.buildTime && selectedDeployment.deployTime && (
                  <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-gray-400">Build Time</span>
                        </div>
                        <span className="text-sm font-semibold text-white">{selectedDeployment.buildTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-gray-400">Deploy Time</span>
                        </div>
                        <span className="text-sm font-semibold text-white">{selectedDeployment.deployTime}</span>
                      </div>
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
                      className="flex items-center gap-2 text-[#FF6B35] hover:text-[#FF6B35]/80 transition text-sm"
                    >
                      <span>{selectedDeployment.url}</span>
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
                  <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Logs
                  </button>
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
