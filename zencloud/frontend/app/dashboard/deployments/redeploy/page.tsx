"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Rocket, GitBranch, Clock, CheckCircle2, XCircle, AlertCircle,
  Search, User, GitCommit, Download, ChevronRight, BarChart3, 
  Archive, Eye, FileText, Zap, History, Terminal, Activity,
  RotateCcw, AlertTriangle, Shield, Play, Calendar, Code,
  Package, Settings, RefreshCw, ChevronDown, Info, Globe
} from "lucide-react";

type Environment = "production" | "staging" | "development";
type DeploymentStatus = "success" | "failed" | "in_progress";

interface Project {
  id: string;
  name: string;
  currentVersion: string;
  environment: Environment;
  branch: string;
  commit: string;
  lastDeployed: string;
  status: DeploymentStatus;
  url: string;
}

interface RedeployConfig {
  clearCache: boolean;
  runMigrations: boolean;
  skipTests: boolean;
  enableMaintenanceMode: boolean;
  notifyTeam: boolean;
  customBuildCommand: string;
}

export default function RedeployPage() {
  const [selectedProject, setSelectedProject] = useState<string>("proj_1");
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployMode, setDeployMode] = useState<"quick" | "custom">("quick");
  const [searchQuery, setSearchQuery] = useState("");
  const [environmentFilter, setEnvironmentFilter] = useState<"all" | Environment>("all");
  
  const [config, setConfig] = useState<RedeployConfig>({
    clearCache: true,
    runMigrations: false,
    skipTests: false,
    enableMaintenanceMode: false,
    notifyTeam: true,
    customBuildCommand: ""
  });

  const projects: Project[] = [
    {
      id: "proj_1",
      name: "zencloud-web",
      currentVersion: "v2.5.3",
      environment: "production",
      branch: "main",
      commit: "a3f2c1d",
      lastDeployed: "2024-06-24T10:30:00Z",
      status: "success",
      url: "https://zencloud-web.app"
    },
    {
      id: "proj_2",
      name: "api-service",
      currentVersion: "v3.2.1",
      environment: "production",
      branch: "main",
      commit: "b7e9d2a",
      lastDeployed: "2024-06-24T08:15:00Z",
      status: "success",
      url: "https://api.zencloud.app"
    },
    {
      id: "proj_3",
      name: "dashboard-ui",
      currentVersion: "v1.8.2",
      environment: "staging",
      branch: "develop",
      commit: "c4d8e1f",
      lastDeployed: "2024-06-24T11:00:00Z",
      status: "success",
      url: "https://staging-dashboard.app"
    },
    {
      id: "proj_4",
      name: "mobile-backend",
      currentVersion: "v2.1.0",
      environment: "production",
      branch: "main",
      commit: "d1a5b3c",
      lastDeployed: "2024-06-23T14:20:00Z",
      status: "failed",
      url: "https://mobile-api.zencloud.app"
    },
    {
      id: "proj_5",
      name: "payment-service",
      currentVersion: "v4.1.0",
      environment: "production",
      branch: "main",
      commit: "e2b7c4d",
      lastDeployed: "2024-06-24T09:00:00Z",
      status: "success",
      url: "https://payments.zencloud.app"
    },
    {
      id: "proj_6",
      name: "analytics-engine",
      currentVersion: "v1.5.4",
      environment: "staging",
      branch: "develop",
      commit: "f3c8d5e",
      lastDeployed: "2024-06-23T16:30:00Z",
      status: "success",
      url: "https://staging-analytics.app"
    },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === "" || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.currentVersion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.branch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnvironment = environmentFilter === "all" || project.environment === environmentFilter;
    return matchesSearch && matchesEnvironment;
  });

  const currentProject = projects.find(p => p.id === selectedProject);

  const getStatusColor = (status: DeploymentStatus) => {
    switch (status) {
      case "success": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "failed": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "in_progress": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const getEnvironmentColor = (env: Environment) => {
    switch (env) {
      case "production": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "staging": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "development": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    }
  };

  const handleQuickRedeploy = (project: Project) => {
    setSelectedProject(project.id);
    setDeployMode("quick");
    setShowConfirmModal(true);
  };

  const handleCustomRedeploy = (project: Project) => {
    setSelectedProject(project.id);
    setDeployMode("custom");
    setShowConfigModal(true);
  };

  const confirmRedeploy = () => {
    setShowConfigModal(false);
    setShowConfirmModal(false);
    setIsDeploying(true);
    
    // Simulate deployment
    setTimeout(() => {
      setIsDeploying(false);
      alert(`Successfully redeployed ${currentProject?.name}`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Deployments</h1>
            <p className="text-sm text-gray-400">Redeploy applications with custom configurations</p>
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
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border-b-2 border-transparent transition"
          >
            <RotateCcw className="w-4 h-4" />
            Rollback
          </Link>
          <Link
            href="/dashboard/deployments/redeploy"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white border-b-2 border-[#FF6B35]"
          >
            <RefreshCw className="w-4 h-4" />
            Redeploy
          </Link>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Projects</p>
                <p className="text-xl font-bold text-white">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Healthy</p>
                <p className="text-xl font-bold text-white">
                  {projects.filter(p => p.status === "success").length}
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
                  {projects.filter(p => p.status === "failed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Production</p>
                <p className="text-xl font-bold text-white">
                  {projects.filter(p => p.environment === "production").length}
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
                  placeholder="Search projects..."
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#111116] border border-white/6 rounded-xl p-5 hover:border-white/10 transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    project.status === "success" ? "bg-gradient-to-br from-green-500 to-green-700" :
                    project.status === "failed" ? "bg-gradient-to-br from-red-500 to-red-700" :
                    "bg-gradient-to-br from-blue-500 to-blue-700"
                  }`}>
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white mb-1 truncate">{project.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(project.status)}`}>
                        {project.status.toUpperCase().replace("_", " ")}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getEnvironmentColor(project.environment)}`}>
                        {project.environment.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Version</span>
                  <span className="text-white font-medium">{project.currentVersion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Branch</span>
                  <span className="text-white font-mono">{project.branch}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Commit</span>
                  <span className="text-white font-mono">{project.commit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Last Deployed</span>
                  <span className="text-white">
                    {new Date(project.lastDeployed).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-2">
                <button
                  onClick={() => handleQuickRedeploy(project)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition"
                >
                  <Play className="w-4 h-4" />
                  Quick
                </button>
                <button
                  onClick={() => handleCustomRedeploy(project)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
                >
                  <Settings className="w-4 h-4" />
                  Custom
                </button>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <Archive className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No projects found</p>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Custom Config Modal */}
        {showConfigModal && currentProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Custom Redeploy</h2>
                    <p className="text-xs text-gray-400">{currentProject.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Project Info */}
                <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Deployment Target</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">Project</p>
                      <p className="text-white font-medium">{currentProject.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Version</p>
                      <p className="text-white font-medium">{currentProject.currentVersion}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Environment</p>
                      <p className="text-white font-medium capitalize">{currentProject.environment}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Branch</p>
                      <p className="text-white font-mono">{currentProject.branch}</p>
                    </div>
                  </div>
                </div>

                {/* Deployment Options */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Deployment Options</h3>
                  
                  <label className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.clearCache}
                      onChange={(e) => setConfig({...config, clearCache: e.target.checked})}
                      className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6B35] focus:ring-[#FF6B35] focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Clear Cache</p>
                      <p className="text-xs text-gray-400 mt-0.5">Remove all cached data before deployment</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.runMigrations}
                      onChange={(e) => setConfig({...config, runMigrations: e.target.checked})}
                      className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6B35] focus:ring-[#FF6B35] focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Run Database Migrations</p>
                      <p className="text-xs text-gray-400 mt-0.5">Execute pending database migrations during deployment</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.skipTests}
                      onChange={(e) => setConfig({...config, skipTests: e.target.checked})}
                      className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6B35] focus:ring-[#FF6B35] focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Skip Tests</p>
                      <p className="text-xs text-gray-400 mt-0.5">Deploy without running test suite (not recommended)</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.enableMaintenanceMode}
                      onChange={(e) => setConfig({...config, enableMaintenanceMode: e.target.checked})}
                      className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6B35] focus:ring-[#FF6B35] focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Enable Maintenance Mode</p>
                      <p className="text-xs text-gray-400 mt-0.5">Show maintenance page during deployment</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.notifyTeam}
                      onChange={(e) => setConfig({...config, notifyTeam: e.target.checked})}
                      className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6B35] focus:ring-[#FF6B35] focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Notify Team</p>
                      <p className="text-xs text-gray-400 mt-0.5">Send deployment notifications to team members</p>
                    </div>
                  </label>
                </div>

                {/* Custom Build Command */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Custom Build Command (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.customBuildCommand}
                    onChange={(e) => setConfig({...config, customBuildCommand: e.target.value})}
                    placeholder="npm run build:production"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50 font-mono"
                  />
                  <p className="text-xs text-gray-400 mt-1">Override the default build command</p>
                </div>

                {/* Warning */}
                {(config.skipTests || config.enableMaintenanceMode) && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-orange-300 font-medium mb-1">Warning</p>
                        <p className="text-xs text-orange-200/80">
                          {config.skipTests && "Skipping tests may introduce bugs into production. "}
                          {config.enableMaintenanceMode && "Users will not be able to access the application during deployment. "}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowConfigModal(false);
                      setShowConfirmModal(true);
                    }}
                    className="flex-1 px-4 py-3 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Continue to Deploy
                  </button>
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        {showConfirmModal && currentProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl max-w-lg w-full">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Confirm Redeploy</h2>
                    <p className="text-xs text-gray-400">Review deployment details</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Summary */}
                <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Deployment Summary</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Project</span>
                      <span className="text-white font-medium">{currentProject.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Version</span>
                      <span className="text-white font-medium">{currentProject.currentVersion}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Environment</span>
                      <span className="text-white font-medium capitalize">{currentProject.environment}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Mode</span>
                      <span className="text-white font-medium capitalize">{deployMode}</span>
                    </div>
                  </div>
                </div>

                {deployMode === "custom" && (
                  <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Configuration</h3>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${config.clearCache ? "bg-green-400" : "bg-gray-600"}`}></div>
                        <span className="text-gray-400">Clear Cache: {config.clearCache ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${config.runMigrations ? "bg-green-400" : "bg-gray-600"}`}></div>
                        <span className="text-gray-400">Run Migrations: {config.runMigrations ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${config.skipTests ? "bg-orange-400" : "bg-gray-600"}`}></div>
                        <span className="text-gray-400">Skip Tests: {config.skipTests ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${config.enableMaintenanceMode ? "bg-orange-400" : "bg-gray-600"}`}></div>
                        <span className="text-gray-400">Maintenance Mode: {config.enableMaintenanceMode ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${config.notifyTeam ? "bg-green-400" : "bg-gray-600"}`}></div>
                        <span className="text-gray-400">Notify Team: {config.notifyTeam ? "Yes" : "No"}</span>
                      </div>
                      {config.customBuildCommand && (
                        <div className="pt-2 mt-2 border-t border-white/5">
                          <p className="text-gray-400 mb-1">Custom Command:</p>
                          <p className="text-white font-mono text-[10px] bg-black/30 rounded px-2 py-1">{config.customBuildCommand}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={confirmRedeploy}
                    className="flex-1 px-4 py-3 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Deployment
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deploying Modal */}
        {isDeploying && currentProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl p-8 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-[#FF6B35] animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Deploying...</h3>
              <p className="text-sm text-gray-400 mb-4">
                Redeploying {currentProject.name}
              </p>
              <div className="space-y-2 text-xs text-left">
                <div className="flex items-center gap-2 text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Building application...</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                  <span>Running deployment...</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Verifying deployment...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
