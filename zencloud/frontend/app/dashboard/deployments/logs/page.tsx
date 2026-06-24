"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Rocket, GitBranch, Clock, CheckCircle2, XCircle, AlertCircle,
  Search, Calendar, User, GitCommit, Download, ChevronRight,
  BarChart3, Archive, Eye, FileText, Zap, History, Terminal,
  PlayCircle, RefreshCw, Copy, Filter, Info, Code, Maximize2,
  ChevronDown, ChevronUp, AlertTriangle, Activity, RotateCcw
} from "lucide-react";

type LogLevel = "info" | "warning" | "error" | "success" | "debug";
type Environment = "production" | "staging" | "development";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: string;
}

interface BuildLog {
  id: string;
  project: string;
  environment: Environment;
  branch: string;
  commit: string;
  author: string;
  startedAt: string;
  status: "running" | "success" | "failed";
  duration?: string;
  logs: LogEntry[];
}

export default function BuildLogsPage() {
  const [selectedBuild, setSelectedBuild] = useState<string>("build_1");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | LogLevel>("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());

  const builds: BuildLog[] = [
    {
      id: "build_1",
      project: "zencloud-web",
      environment: "production",
      branch: "main",
      commit: "a3f2c1d",
      author: "John Doe",
      startedAt: "2024-06-24T10:30:00Z",
      status: "success",
      duration: "3m 24s",
      logs: [
        { timestamp: "10:30:01", level: "info", message: "Build started for zencloud-web" },
        { timestamp: "10:30:02", level: "info", message: "Cloning repository from main branch..." },
        { timestamp: "10:30:05", level: "success", message: "Repository cloned successfully" },
        { timestamp: "10:30:06", level: "info", message: "Installing dependencies..." },
        { timestamp: "10:30:08", level: "debug", message: "npm install --production", details: "Installing 245 packages..." },
        { timestamp: "10:30:45", level: "success", message: "Dependencies installed (245 packages)" },
        { timestamp: "10:30:46", level: "info", message: "Running build command: npm run build" },
        { timestamp: "10:30:48", level: "info", message: "Compiling TypeScript..." },
        { timestamp: "10:31:12", level: "success", message: "TypeScript compilation complete" },
        { timestamp: "10:31:13", level: "info", message: "Optimizing production build..." },
        { timestamp: "10:31:45", level: "info", message: "Generating static pages..." },
        { timestamp: "10:32:10", level: "success", message: "Build completed successfully" },
        { timestamp: "10:32:11", level: "info", message: "Creating deployment package..." },
        { timestamp: "10:32:15", level: "success", message: "Deployment package created (45.2 MB)" },
        { timestamp: "10:32:16", level: "info", message: "Uploading to production server..." },
        { timestamp: "10:32:58", level: "success", message: "Upload complete" },
        { timestamp: "10:32:59", level: "info", message: "Starting deployment..." },
        { timestamp: "10:33:20", level: "success", message: "Deployment successful" },
        { timestamp: "10:33:24", level: "success", message: "Build pipeline completed in 3m 24s" },
      ]
    },
    {
      id: "build_2",
      project: "api-service",
      environment: "production",
      branch: "main",
      commit: "b7e9d2a",
      author: "Jane Smith",
      startedAt: "2024-06-23T15:20:00Z",
      status: "success",
      duration: "2m 45s",
      logs: [
        { timestamp: "15:20:01", level: "info", message: "Build started for api-service" },
        { timestamp: "15:20:02", level: "info", message: "Cloning repository from main branch..." },
        { timestamp: "15:20:04", level: "success", message: "Repository cloned successfully" },
        { timestamp: "15:20:05", level: "info", message: "Installing dependencies..." },
        { timestamp: "15:20:35", level: "success", message: "Dependencies installed" },
        { timestamp: "15:20:36", level: "info", message: "Running tests..." },
        { timestamp: "15:21:15", level: "success", message: "All tests passed (42/42)" },
        { timestamp: "15:21:16", level: "info", message: "Building Docker image..." },
        { timestamp: "15:22:00", level: "success", message: "Docker image built successfully" },
        { timestamp: "15:22:01", level: "info", message: "Pushing to container registry..." },
        { timestamp: "15:22:35", level: "success", message: "Image pushed to registry" },
        { timestamp: "15:22:36", level: "info", message: "Deploying to production..." },
        { timestamp: "15:22:45", level: "success", message: "Deployment completed in 2m 45s" },
      ]
    },
    {
      id: "build_3",
      project: "mobile-backend",
      environment: "production",
      branch: "main",
      commit: "d1a5b3c",
      author: "Sarah Williams",
      startedAt: "2024-06-22T14:20:00Z",
      status: "failed",
      duration: "4m 12s",
      logs: [
        { timestamp: "14:20:01", level: "info", message: "Build started for mobile-backend" },
        { timestamp: "14:20:02", level: "info", message: "Cloning repository from main branch..." },
        { timestamp: "14:20:05", level: "success", message: "Repository cloned successfully" },
        { timestamp: "14:20:06", level: "info", message: "Installing dependencies..." },
        { timestamp: "14:20:45", level: "success", message: "Dependencies installed" },
        { timestamp: "14:20:46", level: "info", message: "Running database migrations..." },
        { timestamp: "14:21:00", level: "warning", message: "Migration warning: Column rename detected" },
        { timestamp: "14:21:15", level: "error", message: "Migration failed: Constraint violation", details: "FOREIGN KEY constraint failed on table 'users'" },
        { timestamp: "14:21:16", level: "error", message: "Rolling back changes..." },
        { timestamp: "14:21:20", level: "info", message: "Rollback completed" },
        { timestamp: "14:24:12", level: "error", message: "Build failed due to migration errors" },
      ]
    },
    {
      id: "build_4",
      project: "dashboard-ui",
      environment: "staging",
      branch: "develop",
      commit: "c4d8e1f",
      author: "Mike Johnson",
      startedAt: "2024-06-24T11:15:00Z",
      status: "running",
      logs: [
        { timestamp: "11:15:01", level: "info", message: "Build started for dashboard-ui" },
        { timestamp: "11:15:02", level: "info", message: "Cloning repository from develop branch..." },
        { timestamp: "11:15:05", level: "success", message: "Repository cloned successfully" },
        { timestamp: "11:15:06", level: "info", message: "Installing dependencies..." },
        { timestamp: "11:15:42", level: "success", message: "Dependencies installed" },
        { timestamp: "11:15:43", level: "info", message: "Running build command..." },
        { timestamp: "11:15:45", level: "info", message: "Compiling components..." },
      ]
    },
  ];

  const currentBuild = builds.find(b => b.id === selectedBuild) || builds[0];

  const filteredLogs = currentBuild.logs.filter(log => {
    const matchesSearch = searchQuery === "" || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "failed": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "running": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getEnvironmentColor = (env: Environment) => {
    switch (env) {
      case "production": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "staging": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "development": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "info": return "text-blue-400";
      case "success": return "text-green-400";
      case "warning": return "text-yellow-400";
      case "error": return "text-red-400";
      case "debug": return "text-gray-400";
    }
  };

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case "info": return <Info className="w-3 h-3" />;
      case "success": return <CheckCircle2 className="w-3 h-3" />;
      case "warning": return <AlertTriangle className="w-3 h-3" />;
      case "error": return <XCircle className="w-3 h-3" />;
      case "debug": return <Code className="w-3 h-3" />;
    }
  };

  const toggleLogExpansion = (index: number) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedLogs(newExpanded);
  };

  const copyLogsToClipboard = () => {
    const logsText = filteredLogs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}${log.details ? '\n' + log.details : ''}`
    ).join('\n');
    navigator.clipboard.writeText(logsText);
    alert('Logs copied to clipboard!');
  };

  const downloadLogs = () => {
    const logsText = filteredLogs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}${log.details ? '\n' + log.details : ''}`
    ).join('\n');
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentBuild.project}-${currentBuild.commit}-logs.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Deployments</h1>
            <p className="text-sm text-gray-400">View detailed build logs and debug information</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={copyLogsToClipboard}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={downloadLogs}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              <Download className="w-4 h-4" />
              Download
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
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border-b-2 border-transparent transition"
          >
            <History className="w-4 h-4" />
            History
          </Link>
          <Link
            href="/dashboard/deployments/logs"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white border-b-2 border-[#FF6B35]"
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Build Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <h2 className="text-sm font-semibold text-white">Recent Builds</h2>
                <p className="text-xs text-gray-400 mt-0.5">{builds.length} builds</p>
              </div>
              <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                {builds.map((build) => (
                  <button
                    key={build.id}
                    onClick={() => setSelectedBuild(build.id)}
                    className={`w-full px-4 py-3 text-left hover:bg-white/5 transition ${
                      selectedBuild === build.id ? "bg-white/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                          build.status === "success" ? "bg-gradient-to-br from-green-500 to-green-700" :
                          build.status === "failed" ? "bg-gradient-to-br from-red-500 to-red-700" :
                          "bg-gradient-to-br from-blue-500 to-blue-700"
                        }`}>
                          <Rocket className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-white truncate">{build.project}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${getStatusColor(build.status)}`}>
                        {build.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <GitBranch className="w-3 h-3" />
                        <span className="font-mono">{build.branch}</span>
                        <span className="text-gray-600">•</span>
                        <span className="font-mono">{build.commit}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <User className="w-3 h-3" />
                        <span>{build.author}</span>
                      </div>
                      {build.duration && (
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{build.duration}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Log Viewer */}
          <div className="lg:col-span-3 space-y-4">
            {/* Build Info Card */}
            <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    currentBuild.status === "success" ? "bg-gradient-to-br from-green-500 to-green-700" :
                    currentBuild.status === "failed" ? "bg-gradient-to-br from-red-500 to-red-700" :
                    "bg-gradient-to-br from-blue-500 to-blue-700"
                  }`}>
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{currentBuild.project}</h2>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusColor(currentBuild.status)}`}>
                        {currentBuild.status.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getEnvironmentColor(currentBuild.environment)}`}>
                        {currentBuild.environment.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <GitBranch className="w-3 h-3" />
                        <span className="font-mono">{currentBuild.branch}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <GitCommit className="w-3 h-3" />
                        <span className="font-mono">{currentBuild.commit}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {currentBuild.status === "running" && (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                    <span className="text-xs text-blue-400 font-medium">Running...</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Author</p>
                  <p className="text-sm text-white font-medium">{currentBuild.author}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Started</p>
                  <p className="text-sm text-white font-medium">
                    {new Date(currentBuild.startedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="text-sm text-white font-medium">{currentBuild.duration || "In progress"}</p>
                </div>
              </div>
            </div>

            {/* Log Controls */}
            <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                    {(["all", "info", "success", "warning", "error", "debug"] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setLevelFilter(level)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                          levelFilter === level
                            ? "bg-[#FF6B35] text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setAutoScroll(!autoScroll)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition ${
                      autoScroll
                        ? "bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20"
                        : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                    }`}
                  >
                    Auto-scroll
                  </button>
                </div>
              </div>
            </div>

            {/* Log Viewer Terminal */}
            <div className="bg-[#0d0d12] border border-white/6 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-[#111116] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-[#FF6B35]" />
                  <span className="text-sm font-semibold text-white">Build Output</span>
                  <span className="text-xs text-gray-400">
                    {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
              </div>
              <div className="p-4 font-mono text-xs max-h-[600px] overflow-y-auto">
                {filteredLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No logs found</p>
                    <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredLogs.map((log, index) => (
                      <div key={index} className="group">
                        <div className="flex items-start gap-3 py-1 px-2 rounded hover:bg-white/5 transition">
                          <span className="text-gray-500 shrink-0">{log.timestamp}</span>
                          <div className={`shrink-0 mt-0.5 ${getLevelColor(log.level)}`}>
                            {getLevelIcon(log.level)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`${getLevelColor(log.level)}`}>{log.message}</span>
                            {log.details && (
                              <button
                                onClick={() => toggleLogExpansion(index)}
                                className="ml-2 text-gray-500 hover:text-gray-400"
                              >
                                {expandedLogs.has(index) ? (
                                  <ChevronUp className="w-3 h-3 inline" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 inline" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        {log.details && expandedLogs.has(index) && (
                          <div className="ml-[120px] py-2 px-3 bg-white/5 rounded mt-1 mb-2 text-gray-400 border-l-2 border-[#FF6B35]/30">
                            {log.details}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Log Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { level: "info", count: currentBuild.logs.filter(l => l.level === "info").length, icon: Info },
                { level: "success", count: currentBuild.logs.filter(l => l.level === "success").length, icon: CheckCircle2 },
                { level: "warning", count: currentBuild.logs.filter(l => l.level === "warning").length, icon: AlertTriangle },
                { level: "error", count: currentBuild.logs.filter(l => l.level === "error").length, icon: XCircle },
                { level: "debug", count: currentBuild.logs.filter(l => l.level === "debug").length, icon: Code },
              ].map(({ level, count, icon: Icon }) => (
                <div key={level} className="bg-[#111116] border border-white/6 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${getLevelColor(level as LogLevel)}`} />
                      <span className="text-xs text-gray-400 capitalize">{level}</span>
                    </div>
                    <span className="text-lg font-bold text-white">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
