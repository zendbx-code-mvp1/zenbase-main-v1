"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Rocket, GitBranch, Clock, CheckCircle2, XCircle, AlertCircle,
  Search, Calendar, User, Download, ChevronRight, BarChart3, 
  Archive, Eye, FileText, Zap, History, Terminal, PlayCircle,
  RefreshCw, Copy, Filter, Info, Code, Pause, Server, Activity,
  ChevronDown, ChevronUp, AlertTriangle, Wifi, WifiOff, Maximize2,
  TrendingUp, Database, Globe
} from "lucide-react";

type LogLevel = "info" | "warn" | "error" | "debug" | "trace";
type LogSource = "application" | "nginx" | "database" | "system";

interface RuntimeLogEntry {
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  details?: string;
  requestId?: string;
  userId?: string;
  ip?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  duration?: number;
}

interface DeployedApp {
  id: string;
  project: string;
  environment: "production" | "staging" | "development";
  url: string;
  status: "running" | "stopped" | "restarting";
  uptime: string;
  requests: number;
  errors: number;
}

// Sample runtime logs - moved outside component to avoid re-creation
const getSampleLogs = (): Record<string, RuntimeLogEntry[]> => ({
  app_1: [
    { timestamp: new Date().toISOString(), level: "info", source: "application", message: "Server started on port 3000" },
    { timestamp: new Date(Date.now() - 1000).toISOString(), level: "info", source: "nginx", message: "GET /api/users HTTP/1.1", method: "GET", path: "/api/users", statusCode: 200, duration: 45, ip: "192.168.1.105" },
    { timestamp: new Date(Date.now() - 2000).toISOString(), level: "info", source: "application", message: "User authentication successful", userId: "user_12345", requestId: "req_abc123" },
    { timestamp: new Date(Date.now() - 3000).toISOString(), level: "debug", source: "database", message: "Query executed: SELECT * FROM users WHERE id = ?", duration: 12 },
    { timestamp: new Date(Date.now() - 4000).toISOString(), level: "info", source: "nginx", message: "POST /api/auth/login HTTP/1.1", method: "POST", path: "/api/auth/login", statusCode: 200, duration: 234, ip: "10.0.1.42" },
    { timestamp: new Date(Date.now() - 5000).toISOString(), level: "warn", source: "application", message: "Rate limit approaching for IP 10.0.1.42", details: "Current: 95/100 requests per minute", ip: "10.0.1.42" },
    { timestamp: new Date(Date.now() - 6000).toISOString(), level: "error", source: "application", message: "Failed to connect to external API", details: "ECONNREFUSED: Connection refused at service.external.com:443\nRetrying in 30s...", requestId: "req_xyz789" },
    { timestamp: new Date(Date.now() - 7000).toISOString(), level: "info", source: "nginx", message: "GET /api/projects HTTP/1.1", method: "GET", path: "/api/projects", statusCode: 200, duration: 67, ip: "172.16.0.23" },
    { timestamp: new Date(Date.now() - 8000).toISOString(), level: "debug", source: "database", message: "Connection pool stats: active=5, idle=10, waiting=0" },
    { timestamp: new Date(Date.now() - 9000).toISOString(), level: "info", source: "application", message: "Cache hit for key: user_profile_12345", requestId: "req_cache001" },
    { timestamp: new Date(Date.now() - 10000).toISOString(), level: "info", source: "nginx", message: "PUT /api/settings HTTP/1.1", method: "PUT", path: "/api/settings", statusCode: 200, duration: 123, ip: "192.168.1.105" },
    { timestamp: new Date(Date.now() - 11000).toISOString(), level: "warn", source: "system", message: "High memory usage detected: 85% of 2GB", details: "Consider scaling up or optimizing memory usage" },
    { timestamp: new Date(Date.now() - 12000).toISOString(), level: "error", source: "application", message: "Validation error in user input", details: "Field 'email' must be a valid email address", requestId: "req_val456", userId: "user_67890" },
    { timestamp: new Date(Date.now() - 13000).toISOString(), level: "info", source: "nginx", message: "GET /api/deployments HTTP/1.1", method: "GET", path: "/api/deployments", statusCode: 200, duration: 89, ip: "10.0.1.88" },
    { timestamp: new Date(Date.now() - 14000).toISOString(), level: "trace", source: "application", message: "Function call: getUserProfile(12345)", details: "Stack trace available" },
    { timestamp: new Date(Date.now() - 15000).toISOString(), level: "info", source: "database", message: "Database backup completed successfully", details: "Size: 2.4GB, Duration: 45s" },
  ],
  app_2: [
    { timestamp: new Date().toISOString(), level: "info", source: "application", message: "API server running on port 8000" },
    { timestamp: new Date(Date.now() - 500).toISOString(), level: "info", source: "nginx", message: "POST /v1/users HTTP/1.1", method: "POST", path: "/v1/users", statusCode: 201, duration: 156, ip: "203.0.113.45" },
    { timestamp: new Date(Date.now() - 1500).toISOString(), level: "debug", source: "database", message: "Query: INSERT INTO users (name, email) VALUES (?, ?)", duration: 8 },
    { timestamp: new Date(Date.now() - 2500).toISOString(), level: "error", source: "application", message: "JWT token validation failed", details: "Token expired at 2024-06-24T10:00:00Z", requestId: "req_jwt123" },
    { timestamp: new Date(Date.now() - 3500).toISOString(), level: "info", source: "nginx", message: "GET /v1/health HTTP/1.1", method: "GET", path: "/v1/health", statusCode: 200, duration: 2, ip: "10.0.0.1" },
    { timestamp: new Date(Date.now() - 4500).toISOString(), level: "warn", source: "database", message: "Slow query detected", details: "Query took 1.2s: SELECT * FROM orders JOIN users", duration: 1200 },
  ],
  app_3: [
    { timestamp: new Date().toISOString(), level: "info", source: "application", message: "Dashboard UI server started" },
    { timestamp: new Date(Date.now() - 800).toISOString(), level: "info", source: "nginx", message: "GET /dashboard HTTP/1.1", method: "GET", path: "/dashboard", statusCode: 200, duration: 234, ip: "192.168.100.5" },
    { timestamp: new Date(Date.now() - 1800).toISOString(), level: "debug", source: "application", message: "Rendering dashboard with 12 widgets" },
    { timestamp: new Date(Date.now() - 2800).toISOString(), level: "info", source: "nginx", message: "GET /api/stats HTTP/1.1", method: "GET", path: "/api/stats", statusCode: 200, duration: 45, ip: "192.168.100.5" },
  ],
  app_4: [
    { timestamp: new Date().toISOString(), level: "info", source: "application", message: "Payment service initialized" },
    { timestamp: new Date(Date.now() - 1200).toISOString(), level: "info", source: "application", message: "Processing payment transaction", requestId: "pay_tx_789", userId: "user_999" },
    { timestamp: new Date(Date.now() - 2200).toISOString(), level: "info", source: "nginx", message: "POST /v1/payments HTTP/1.1", method: "POST", path: "/v1/payments", statusCode: 200, duration: 456, ip: "198.51.100.10" },
    { timestamp: new Date(Date.now() - 3200).toISOString(), level: "warn", source: "application", message: "Payment gateway response time high", details: "Gateway took 3.2s to respond", requestId: "pay_tx_789" },
    { timestamp: new Date(Date.now() - 4200).toISOString(), level: "error", source: "application", message: "Payment declined by issuer", details: "Reason: Insufficient funds", requestId: "pay_tx_790", userId: "user_888" },
    { timestamp: new Date(Date.now() - 5200).toISOString(), level: "info", source: "application", message: "Refund processed successfully", requestId: "refund_tx_123", userId: "user_777" },
  ],
});

export default function RuntimeLogsPage() {
  const [selectedApp, setSelectedApp] = useState<string>("app_1");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | LogLevel>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | LogSource>("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());
  const [logs, setLogs] = useState<RuntimeLogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const apps: DeployedApp[] = [
    {
      id: "app_1",
      project: "zencloud-web",
      environment: "production",
      url: "https://zencloud-web.app",
      status: "running",
      uptime: "12d 5h 23m",
      requests: 152847,
      errors: 23
    },
    {
      id: "app_2",
      project: "api-service",
      environment: "production",
      url: "https://api.zencloud.app",
      status: "running",
      uptime: "8d 14h 52m",
      requests: 892341,
      errors: 156
    },
    {
      id: "app_3",
      project: "dashboard-ui",
      environment: "staging",
      url: "https://staging-dashboard.app",
      status: "running",
      uptime: "3d 2h 15m",
      requests: 45632,
      errors: 12
    },
    {
      id: "app_4",
      project: "payment-service",
      environment: "production",
      url: "https://payments.zencloud.app",
      status: "running",
      uptime: "5d 18h 41m",
      requests: 234156,
      errors: 8
    },
  ];

  // Initialize logs on component mount and when app changes
  useEffect(() => {
    const sampleLogs = getSampleLogs();
    setLogs(sampleLogs[selectedApp] || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApp]);

  // Simulate live log streaming
  useEffect(() => {
    if (!isPaused && isLive) {
      const interval = setInterval(() => {
        const newLog: RuntimeLogEntry = {
          timestamp: new Date().toISOString(),
          level: ["info", "warn", "error", "debug"][Math.floor(Math.random() * 4)] as LogLevel,
          source: ["application", "nginx", "database", "system"][Math.floor(Math.random() * 4)] as LogSource,
          message: [
            "Incoming request processed",
            "Cache entry expired",
            "Background job completed",
            "Health check passed",
            "Session created",
            "API call successful"
          ][Math.floor(Math.random() * 6)],
          requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
        };
        setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, isLive]);

  useEffect(() => {
    if (autoScroll && !isPaused) {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll, isPaused]);

  const currentApp = apps.find(a => a.id === selectedApp) || apps[0];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === "" || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.path?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesSource = sourceFilter === "all" || log.source === sourceFilter;
    return matchesSearch && matchesLevel && matchesSource;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "stopped": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "restarting": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "production": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "staging": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "development": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "info": return "text-blue-400";
      case "warn": return "text-yellow-400";
      case "error": return "text-red-400";
      case "debug": return "text-gray-400";
      case "trace": return "text-purple-400";
    }
  };

  const getLevelBg = (level: LogLevel) => {
    switch (level) {
      case "info": return "bg-blue-500/10";
      case "warn": return "bg-yellow-500/10";
      case "error": return "bg-red-500/10";
      case "debug": return "bg-gray-500/10";
      case "trace": return "bg-purple-500/10";
    }
  };

  const getSourceIcon = (source: LogSource) => {
    switch (source) {
      case "application": return <Code className="w-3 h-3" />;
      case "nginx": return <Globe className="w-3 h-3" />;
      case "database": return <Database className="w-3 h-3" />;
      case "system": return <Server className="w-3 h-3" />;
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
      `[${new Date(log.timestamp).toISOString()}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}${log.details ? '\n' + log.details : ''}`
    ).join('\n');
    navigator.clipboard.writeText(logsText);
    alert('Logs copied to clipboard!');
  };

  const downloadLogs = () => {
    const logsText = filteredLogs.map(log => 
      `[${new Date(log.timestamp).toISOString()}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}${log.details ? '\n' + log.details : ''}`
    ).join('\n');
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentApp.project}-runtime-logs-${Date.now()}.txt`;
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
            <p className="text-sm text-gray-400">Monitor live application logs in real-time</p>
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
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border-b-2 border-transparent transition"
          >
            <Terminal className="w-4 h-4" />
            Build Logs
          </Link>
          <Link
            href="/dashboard/deployments/runtime"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white border-b-2 border-[#FF6B35]"
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
          {/* Application Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <h2 className="text-sm font-semibold text-white">Deployed Apps</h2>
                <p className="text-xs text-gray-400 mt-0.5">{apps.length} running</p>
              </div>
              <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app.id)}
                    className={`w-full px-4 py-3 text-left hover:bg-white/5 transition ${
                      selectedApp === app.id ? "bg-white/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-700 rounded flex items-center justify-center shrink-0">
                          <Server className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-white truncate">{app.project}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${getStatusColor(app.status)}`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <Globe className="w-3 h-3" />
                        <span className="truncate">{app.url.replace('https://', '')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>Uptime: {app.uptime}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>{app.requests.toLocaleString()} requests</span>
                        <span className="text-red-400">{app.errors} errors</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Log Viewer */}
          <div className="lg:col-span-3 space-y-4">
            {/* App Info Card */}
            <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                    <Server className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{currentApp.project}</h2>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusColor(currentApp.status)}`}>
                        {currentApp.status.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getEnvironmentColor(currentApp.environment)}`}>
                        {currentApp.environment.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        {isLive ? <Wifi className="w-3 h-3 text-green-400" /> : <WifiOff className="w-3 h-3 text-gray-400" />}
                        <span>{isLive ? "Live" : "Offline"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {currentApp.status === "running" && !isPaused && (
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                    <span className="text-xs text-green-400 font-medium">Streaming...</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Uptime</p>
                  <p className="text-sm text-white font-medium">{currentApp.uptime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Requests</p>
                  <p className="text-sm text-white font-medium">{currentApp.requests.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Errors</p>
                  <p className="text-sm text-red-400 font-medium">{currentApp.errors}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Error Rate</p>
                  <p className="text-sm text-white font-medium">
                    {((currentApp.errors / currentApp.requests) * 100).toFixed(2)}%
                  </p>
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
                    {(["all", "info", "warn", "error", "debug", "trace"] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setLevelFilter(level)}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                          levelFilter === level
                            ? "bg-[#FF6B35] text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                    {(["all", "application", "nginx", "database", "system"] as const).map((source) => (
                      <button
                        key={source}
                        onClick={() => setSourceFilter(source)}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                          sourceFilter === source
                            ? "bg-[#FF6B35] text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {source === "all" ? "All" : source.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                      isPaused
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                    }`}
                  >
                    {isPaused ? <PlayCircle className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    {isPaused ? "Resume" : "Pause"}
                  </button>
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
                  <Activity className="w-4 h-4 text-[#FF6B35]" />
                  <span className="text-sm font-semibold text-white">Runtime Output</span>
                  <span className="text-xs text-gray-400">
                    {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
                  </span>
                  {isPaused && (
                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded text-[10px] font-semibold">
                      PAUSED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
              </div>
              <div className="p-4 font-mono text-xs max-h-[600px] overflow-y-auto" id="log-container">
                {filteredLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400">No logs found</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {isPaused ? "Resume streaming to see new logs" : "Try adjusting your filters"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {filteredLogs.map((log, index) => {
                      const time = new Date(log.timestamp);
                      const timeStr = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                      const msStr = time.getMilliseconds().toString().padStart(3, '0');
                      
                      return (
                        <div key={index} className="group">
                          <div className="flex items-start gap-2 py-1 px-2 rounded hover:bg-white/5 transition">
                            <span className="text-gray-600 shrink-0 font-medium">{timeStr}.{msStr}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${getLevelBg(log.level)} ${getLevelColor(log.level)}`}>
                              {log.level}
                            </span>
                            <div className={`shrink-0 mt-0.5 ${getLevelColor(log.level)}`}>
                              {getSourceIcon(log.source)}
                            </div>
                            <span className="text-gray-500 shrink-0 text-[10px]">[{log.source}]</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-gray-300">{log.message}</span>
                              {log.requestId && (
                                <span className="ml-2 text-gray-600 text-[10px]">req:{log.requestId}</span>
                              )}
                              {log.method && log.path && (
                                <span className="ml-2 text-blue-400">{log.method} {log.path}</span>
                              )}
                              {log.statusCode && (
                                <span className={`ml-2 font-semibold ${
                                  log.statusCode >= 200 && log.statusCode < 300 ? 'text-green-400' :
                                  log.statusCode >= 400 && log.statusCode < 500 ? 'text-yellow-400' :
                                  log.statusCode >= 500 ? 'text-red-400' : 'text-gray-400'
                                }`}>
                                  {log.statusCode}
                                </span>
                              )}
                              {log.duration && (
                                <span className="ml-2 text-gray-500">{log.duration}ms</span>
                              )}
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
                            <div className="ml-[140px] py-2 px-3 bg-white/5 rounded mt-1 mb-2 text-gray-400 border-l-2 border-[#FF6B35]/30 text-[11px] whitespace-pre-wrap">
                              {log.details}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={logsEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Log Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { level: "info", count: logs.filter(l => l.level === "info").length, color: "text-blue-400" },
                { level: "warn", count: logs.filter(l => l.level === "warn").length, color: "text-yellow-400" },
                { level: "error", count: logs.filter(l => l.level === "error").length, color: "text-red-400" },
                { level: "debug", count: logs.filter(l => l.level === "debug").length, color: "text-gray-400" },
                { level: "trace", count: logs.filter(l => l.level === "trace").length, color: "text-purple-400" },
              ].map(({ level, count, color }) => (
                <div key={level} className="bg-[#111116] border border-white/6 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${color} capitalize font-medium`}>{level}</span>
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
