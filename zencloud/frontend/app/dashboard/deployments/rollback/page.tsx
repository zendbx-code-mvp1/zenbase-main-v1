"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Rocket, GitBranch, Clock, CheckCircle2, XCircle, AlertCircle,
  Search, User, GitCommit, Download, ChevronRight, BarChart3, 
  Archive, Eye, FileText, Zap, History, Terminal, Activity,
  RotateCcw, AlertTriangle, Shield, TrendingDown, Calendar,
  Code, Package, ArrowLeft, Play, Info
} from "lucide-react";

type DeploymentStatus = "success" | "failed" | "rolled_back";
type Environment = "production" | "staging" | "development";

interface DeploymentVersion {
  id: string;
  version: string;
  project: string;
  environment: Environment;
  status: DeploymentStatus;
  branch: string;
  commit: string;
  commitMessage: string;
  author: string;
  deployedAt: string;
  duration: string;
  isCurrentVersion: boolean;
  canRollback: boolean;
  metrics?: {
    uptime: string;
    requests: number;
    errors: number;
    errorRate: string;
  };
}

export default function RollbackPage() {
  const [selectedProject, setSelectedProject] = useState<string>("proj_1");
  const [searchQuery, setSearchQuery] = useState("");
  const [environmentFilter, setEnvironmentFilter] = useState<"all" | Environment>("all");
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<DeploymentVersion | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const projects = [
    { id: "proj_1", name: "zencloud-web", activeVersions: 3 },
    { id: "proj_2", name: "api-service", activeVersions: 2 },
    { id: "proj_3", name: "dashboard-ui", activeVersions: 2 },
    { id: "proj_4", name: "payment-service", activeVersions: 4 },
  ];

  const versions: Record<string, DeploymentVersion[]> = {
    proj_1: [
      {
        id: "v1",
        version: "v2.5.3",
        project: "zencloud-web",
        environment: "production",
        status: "success",
        branch: "main",
        commit: "a3f2c1d",
        commitMessage: "Fix authentication bug and update dependencies",
        author: "John Doe",
        deployedAt: "2024-06-24T10:30:00Z",
        duration: "3m 24s",
        isCurrentVersion: true,
        canRollback: false,
        metrics: {
          uptime: "2h 15m",
          requests: 8542,
          errors: 3,
          errorRate: "0.04%"
        }
      },
      {
        id: "v2",
        version: "v2.5.2",
        project: "zencloud-web",
        environment: "production",
        status: "success",
        branch: "main",
        commit: "b7e9d2a",
        commitMessage: "Add new user management features",
        author: "Jane Smith",
        deployedAt: "2024-06-23T15:20:00Z",
        duration: "2m 45s",
        isCurrentVersion: false,
        canRollback: true,
        metrics: {
          uptime: "8h 45m",
          requests: 45632,
          errors: 12,
          errorRate: "0.03%"
        }
      },
      {
        id: "v3",
        version: "v2.5.1",
        project: "zencloud-web",
        environment: "production",
        status: "success",
        branch: "main",
        commit: "c4d8e1f",
        commitMessage: "Implement dashboard redesign",
        author: "Mike Johnson",
        deployedAt: "2024-06-22T09:45:00Z",
        duration: "2m 58s",
        isCurrentVersion: false,
        canRollback: true,
        metrics: {
          uptime: "12h 30m",
          requests: 92341,
          errors: 8,
          errorRate: "0.01%"
        }
      },
      {
        id: "v4",
        version: "v2.5.0",
        project: "zencloud-web",
        environment: "production",
        status: "rolled_back",
        branch: "main",
        commit: "d1a5b3c",
        commitMessage: "Major feature release with new API",
        author: "Sarah Williams",
        deployedAt: "2024-06-21T14:20:00Z",
        duration: "4m 12s",
        isCurrentVersion: false,
        canRollback: false,
      },
      {
        id: "v5",
        version: "v2.4.8",
        project: "zencloud-web",
        environment: "production",
        status: "success",
        branch: "main",
        commit: "e2b7c4d",
        commitMessage: "Performance optimizations and bug fixes",
        author: "Alex Brown",
        deployedAt: "2024-06-20T11:00:00Z",
        duration: "3m 15s",
        isCurrentVersion: false,
        canRollback: true,
      },
    ],
    proj_2: [
      {
        id: "v1",
        version: "v3.2.1",
        project: "api-service",
        environment: "production",
        status: "success",
        branch: "main",
        commit: "f3c8d5e",
        commitMessage: "Update authentication endpoints",
        author: "Emily Davis",
        deployedAt: "2024-06-24T08:15:00Z",
        duration: "2m 30s",
        isCurrentVersion: true,
        canRollback: false,
        metrics: {
          uptime: "4h 30m",
          requests: 125834,
          errors: 45,
          errorRate: "0.04%"
        }
      },
      {
        id: "v2",
        version: "v3.2.0",
        project: "api-service",
        environment: "production",
        status: "success",
        branch: "main",
        commit: "g4h9f6e",
        commitMessage: "Add new payment webhooks",
        author: "John Doe",
        deployedAt: "2024-06-23T16:30:00Z",
        duration: "3m 10s",
        isCurrentVersion: false,
        canRollback: true,
        metrics: {
          uptime: "15h 45m",
          requests: 234567,
          errors: 23,
          errorRate: "0.01%"
        }
      },
    ],
    proj_3: [
      {
        id: "v1",
        version: "v1.8.2",
        project: "dashboard-ui",
        environment: "staging",
        status: "success",
        branch: "develop",
        commit: "h5i0g7f",
        commitMessage: "New analytics dashboard",
        author: "Mike Johnson",
        deployedAt: "2024-06-24T11:00:00Z",
        duration: "2m 45s",
        isCurrentVersion: true,
        canRollback: false,
        metrics: {
          uptime: "1h 45m",
          requests: 2341,
          errors: 5,
          errorRate: "0.21%"
        }
      },
      {
        id: "v2",
        version: "v1.8.1",
        project: "dashboard-ui",
        environment: "staging",
        status: "success",
        branch: "develop",
        commit: "i6j1h8g",
        commitMessage: "Fix table sorting issues",
        author: "Jane Smith",
        deployedAt: "2024-06-23T14:20:00Z",
        duration: "2m 20s",
        isCurrentVersion: false,
        canRollback: true,
      },
    ],
    proj_4: [
      {
        id: "v1",
        version: "v4.1.0",
        project: "payment-service",
        environment: "production",
        status: "success",
        branch: "main",
        commit: "j7k2i9h",
        commitMessage: "Integrate new payment gateway",
        author: "Alex Brown",
        deployedAt: "2024-06-24T09:00:00Z",
        duration: "3m 40s",
        isCurrentVersion: true,
        canRollback: false,
        metrics: {
          uptime: "3h 45m",
          requests: 15624,
          errors: 2,
          errorRate: "0.01%"
        }
      },
      {
        id: "v2",
        version: "v4.0.9",
        project: "payment-service",
        environment: "production",
        status: "success",
        branch: "main",
        commit: "k8l3j0i",
        commitMessage: "Fix payment timeout issues",
        author: "Sarah Williams",
        deployedAt: "2024-06-23T13:45:00Z",
        duration: "2m 55s",
        isCurrentVersion: false,
        canRollback: true,
        metrics: {
          uptime: "19h 15m",
          requests: 78945,
          errors: 12,
          errorRate: "0.02%"
        }
      },
      {
        id: "v3",
        version: "v4.0.8",
        project: "payment-service",
        environment: "production",
        status: "failed",
        branch: "main",
        commit: "l9m4k1j",
        commitMessage: "Add refund processing",
        author: "Emily Davis",
        deployedAt: "2024-06-22T10:30:00Z",
        duration: "4m 20s",
        isCurrentVersion: false,
        canRollback: false,
      },
      {
        id: "v4",
        version: "v4.0.7",
        project: "payment-service",
        environment: "production",
        status: "success",
        branch: "main",
        commit: "m0n5l2k",
        commitMessage: "Security patches and updates",
        author: "John Doe",
        deployedAt: "2024-06-21T16:00:00Z",
        duration: "3m 05s",
        isCurrentVersion: false,
        canRollback: true,
      },
    ],
  };

  const currentVersions = versions[selectedProject] || [];
  const currentProject = projects.find(p => p.id === selectedProject);

  const filteredVersions = currentVersions.filter(version => {
    const matchesSearch = searchQuery === "" || 
      version.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.commit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.commitMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnvironment = environmentFilter === "all" || version.environment === environmentFilter;
    return matchesSearch && matchesEnvironment;
  });

  const currentVersion = currentVersions.find(v => v.isCurrentVersion);

  const getStatusColor = (status: DeploymentStatus) => {
    switch (status) {
      case "success": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "failed": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "rolled_back": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    }
  };

  const getEnvironmentColor = (env: Environment) => {
    switch (env) {
      case "production": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "staging": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "development": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    }
  };

  const handleRollbackClick = (version: DeploymentVersion) => {
    setSelectedVersion(version);
    setShowRollbackModal(true);
  };

  const confirmRollback = () => {
    setShowRollbackModal(false);
    setShowConfirmModal(true);
    // Simulate rollback process
    setTimeout(() => {
      setShowConfirmModal(false);
      alert(`Successfully rolled back to ${selectedVersion?.version}`);
      setSelectedVersion(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Deployments</h1>
            <p className="text-sm text-gray-400">Rollback to previous deployment versions</p>
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
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white border-b-2 border-[#FF6B35]"
          >
            <RotateCcw className="w-4 h-4" />
            Rollback
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Project Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <h2 className="text-sm font-semibold text-white">Projects</h2>
                <p className="text-xs text-gray-400 mt-0.5">{projects.length} total</p>
              </div>
              <div className="divide-y divide-white/5">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`w-full px-4 py-3 text-left hover:bg-white/5 transition ${
                      selectedProject === project.id ? "bg-white/5" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#FF6B35] to-orange-600 rounded flex items-center justify-center shrink-0">
                          <Package className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white truncate">{project.name}</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 ml-8">
                      {project.activeVersions} versions available
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#111116] border border-white/6 rounded-xl p-4 mt-4">
              <h3 className="text-xs font-semibold text-white mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Total Versions</span>
                  <span className="text-sm font-bold text-white">{currentVersions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Can Rollback</span>
                  <span className="text-sm font-bold text-green-400">
                    {currentVersions.filter(v => v.canRollback).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Rolled Back</span>
                  <span className="text-sm font-bold text-orange-400">
                    {currentVersions.filter(v => v.status === "rolled_back").length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Version History */}
          <div className="lg:col-span-3 space-y-4">
            {/* Current Version Card */}
            {currentVersion && (
              <div className="bg-gradient-to-br from-green-500/10 to-green-900/5 border border-green-500/20 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-semibold text-white">{currentVersion.version}</h2>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-[10px] font-bold uppercase">
                          Current
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{currentVersion.commitMessage}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <GitBranch className="w-3 h-3" />
                          <span className="font-mono">{currentVersion.branch}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <GitCommit className="w-3 h-3" />
                          <span className="font-mono">{currentVersion.commit}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <User className="w-3 h-3" />
                          <span>{currentVersion.author}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(currentVersion.deployedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {currentVersion.metrics && (
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-green-500/20">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Uptime</p>
                      <p className="text-sm text-white font-semibold">{currentVersion.metrics.uptime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Requests</p>
                      <p className="text-sm text-white font-semibold">{currentVersion.metrics.requests.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Errors</p>
                      <p className="text-sm text-red-400 font-semibold">{currentVersion.metrics.errors}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Error Rate</p>
                      <p className="text-sm text-white font-semibold">{currentVersion.metrics.errorRate}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Filters */}
            <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search versions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50"
                    />
                  </div>
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

            {/* Version History List */}
            <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h2 className="text-sm font-semibold text-white">Version History</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {filteredVersions.length} versions • {currentProject?.name}
                </p>
              </div>
              <div className="divide-y divide-white/5">
                {filteredVersions.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Archive className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No versions found</p>
                    <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  filteredVersions.map((version) => (
                    <div
                      key={version.id}
                      className={`px-6 py-5 hover:bg-white/2 transition ${
                        version.isCurrentVersion ? "bg-white/5" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            version.isCurrentVersion ? "bg-gradient-to-br from-green-500 to-green-700" :
                            version.status === "success" ? "bg-gradient-to-br from-blue-500 to-blue-700" :
                            version.status === "failed" ? "bg-gradient-to-br from-red-500 to-red-700" :
                            "bg-gradient-to-br from-orange-500 to-orange-700"
                          }`}>
                            {version.isCurrentVersion ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : version.status === "rolled_back" ? (
                              <RotateCcw className="w-4 h-4 text-white" />
                            ) : (
                              <Package className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-sm font-semibold text-white">{version.version}</h3>
                              {version.isCurrentVersion && (
                                <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[10px] font-bold uppercase">
                                  Current
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(version.status)}`}>
                                {version.status === "rolled_back" ? "ROLLED BACK" : version.status.toUpperCase()}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getEnvironmentColor(version.environment)}`}>
                                {version.environment.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">{version.commitMessage}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                              <div className="flex items-center gap-1">
                                <GitCommit className="w-3 h-3" />
                                <span className="font-mono">{version.commit}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{version.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {new Date(version.deployedAt).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{version.duration}</span>
                              </div>
                            </div>
                            {version.metrics && (
                              <div className="flex items-center gap-4 mt-3 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-gray-500">Uptime:</span>
                                  <span className="text-white font-medium">{version.metrics.uptime}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-gray-500">Requests:</span>
                                  <span className="text-white font-medium">{version.metrics.requests.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-gray-500">Errors:</span>
                                  <span className="text-red-400 font-medium">{version.metrics.errors}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-gray-500">Error Rate:</span>
                                  <span className="text-white font-medium">{version.metrics.errorRate}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {version.canRollback && (
                            <button
                              onClick={() => handleRollbackClick(version)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Rollback
                            </button>
                          )}
                          {!version.canRollback && !version.isCurrentVersion && (
                            <div className="px-4 py-2 bg-white/5 border border-white/10 text-gray-500 text-sm font-medium rounded-lg">
                              Unavailable
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rollback Confirmation Modal */}
        {showRollbackModal && selectedVersion && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Confirm Rollback</h2>
                    <p className="text-xs text-gray-400">This action will revert your deployment</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Warning */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-orange-300 font-medium mb-1">Important Notice</p>
                      <p className="text-xs text-orange-200/80">
                        Rolling back will replace the current version with the selected version. 
                        This may cause temporary downtime. Make sure you understand the implications.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current vs Target */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Current Version</p>
                    <p className="text-lg font-bold text-white mb-1">{currentVersion?.version}</p>
                    <p className="text-xs text-gray-400">{currentVersion?.commitMessage}</p>
                  </div>
                  <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Target Version</p>
                    <p className="text-lg font-bold text-white mb-1">{selectedVersion.version}</p>
                    <p className="text-xs text-gray-400">{selectedVersion.commitMessage}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Rollback Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">Project</p>
                      <p className="text-white font-medium">{selectedVersion.project}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Environment</p>
                      <p className="text-white font-medium capitalize">{selectedVersion.environment}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Commit</p>
                      <p className="text-white font-mono">{selectedVersion.commit}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Author</p>
                      <p className="text-white">{selectedVersion.author}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={confirmRollback}
                    className="flex-1 px-4 py-3 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Confirm Rollback
                  </button>
                  <button
                    onClick={() => {
                      setShowRollbackModal(false);
                      setSelectedVersion(null);
                    }}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl p-8 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-[#FF6B35] animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Rolling Back...</h3>
              <p className="text-sm text-gray-400">
                Please wait while we rollback to {selectedVersion?.version}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
