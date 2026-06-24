"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Activity, Clock, User, GitCommit, CheckCircle2, XCircle,
  AlertCircle, Info, Rocket, Settings, Shield, Database,
  Globe, Server, Package, Code, Search, Filter, Calendar,
  Download, Eye, ChevronRight, TrendingUp, BarChart3,
  FileText, Zap, Key, UserPlus, UserMinus, LogIn, LogOut
} from "lucide-react";

type EventType = "deployment" | "authentication" | "system" | "database" | "configuration" | "security";
type EventSeverity = "info" | "warning" | "error" | "success";

interface SystemEvent {
  id: string;
  type: EventType;
  severity: EventSeverity;
  title: string;
  description: string;
  user?: string;
  source: string;
  timestamp: string;
  metadata?: Record<string, string | number>;
}

export default function MonitoringEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | EventType>("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | EventSeverity>("all");
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "all">("all");
  const [selectedEvent, setSelectedEvent] = useState<SystemEvent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const events: SystemEvent[] = [
    {
      id: "evt_1",
      type: "deployment",
      severity: "success",
      title: "Deployment Completed",
      description: "zencloud-web v2.5.3 deployed to production successfully",
      user: "John Doe",
      source: "zencloud-web",
      timestamp: "2024-06-24T12:45:00Z",
      metadata: {
        version: "v2.5.3",
        environment: "production",
        duration: "3m 24s"
      }
    },
    {
      id: "evt_2",
      type: "authentication",
      severity: "warning",
      title: "Failed Login Attempt",
      description: "Multiple failed login attempts from IP 203.0.113.45",
      source: "auth-service",
      timestamp: "2024-06-24T12:30:00Z",
      metadata: {
        ip: "203.0.113.45",
        attempts: 5,
        username: "admin"
      }
    },
    {
      id: "evt_3",
      type: "system",
      severity: "error",
      title: "Service Crashed",
      description: "api-service crashed due to out of memory error",
      source: "api-service",
      timestamp: "2024-06-24T12:15:00Z",
      metadata: {
        exitCode: 137,
        memoryUsage: "2048MB"
      }
    },
    {
      id: "evt_4",
      type: "database",
      severity: "success",
      title: "Database Backup Completed",
      description: "Automatic backup of production database completed",
      source: "backup-service",
      timestamp: "2024-06-24T12:00:00Z",
      metadata: {
        size: "2.4GB",
        duration: "45s",
        status: "success"
      }
    },
    {
      id: "evt_5",
      type: "security",
      severity: "warning",
      title: "SSL Certificate Expiring",
      description: "SSL certificate for zencloud-web.app expires in 7 days",
      source: "security-monitor",
      timestamp: "2024-06-24T11:45:00Z",
      metadata: {
        domain: "zencloud-web.app",
        expiresIn: "7 days"
      }
    },
    {
      id: "evt_6",
      type: "configuration",
      severity: "info",
      title: "Configuration Updated",
      description: "Environment variables updated for payment-service",
      user: "Jane Smith",
      source: "payment-service",
      timestamp: "2024-06-24T11:30:00Z",
      metadata: {
        changedKeys: 3
      }
    },
    {
      id: "evt_7",
      type: "authentication",
      severity: "success",
      title: "User Login",
      description: "User successfully authenticated",
      user: "Mike Johnson",
      source: "auth-service",
      timestamp: "2024-06-24T11:15:00Z",
      metadata: {
        ip: "192.168.1.105",
        userAgent: "Mozilla/5.0"
      }
    },
    {
      id: "evt_8",
      type: "deployment",
      severity: "error",
      title: "Deployment Failed",
      description: "mobile-backend deployment failed during database migration",
      user: "Sarah Williams",
      source: "mobile-backend",
      timestamp: "2024-06-24T11:00:00Z",
      metadata: {
        version: "v2.1.0",
        environment: "production",
        error: "Migration constraint violation"
      }
    },
    {
      id: "evt_9",
      type: "system",
      severity: "warning",
      title: "High Memory Usage",
      description: "Memory usage exceeded 85% on dashboard-ui",
      source: "dashboard-ui",
      timestamp: "2024-06-24T10:45:00Z",
      metadata: {
        memoryUsage: 87,
        threshold: 85
      }
    },
    {
      id: "evt_10",
      type: "security",
      severity: "info",
      title: "API Key Generated",
      description: "New API key generated for external integration",
      user: "Alex Brown",
      source: "api-service",
      timestamp: "2024-06-24T10:30:00Z",
      metadata: {
        keyId: "key_abc123",
        permissions: "read"
      }
    },
    {
      id: "evt_11",
      type: "database",
      severity: "warning",
      title: "Slow Query Detected",
      description: "Database query took 1.2s to execute",
      source: "database-monitor",
      timestamp: "2024-06-24T10:15:00Z",
      metadata: {
        duration: "1200ms",
        query: "SELECT * FROM orders JOIN users"
      }
    },
    {
      id: "evt_12",
      type: "configuration",
      severity: "success",
      title: "Feature Flag Enabled",
      description: "New payment gateway feature enabled in production",
      user: "Emily Davis",
      source: "payment-service",
      timestamp: "2024-06-24T10:00:00Z",
      metadata: {
        featureName: "stripe_integration",
        environment: "production"
      }
    },
    {
      id: "evt_13",
      type: "authentication",
      severity: "info",
      title: "User Logout",
      description: "User session ended",
      user: "John Doe",
      source: "auth-service",
      timestamp: "2024-06-24T09:45:00Z",
      metadata: {
        sessionDuration: "2h 15m"
      }
    },
    {
      id: "evt_14",
      type: "system",
      severity: "success",
      title: "Service Started",
      description: "analytics-engine service started successfully",
      source: "analytics-engine",
      timestamp: "2024-06-24T09:30:00Z",
      metadata: {
        version: "v1.5.4",
        uptime: "0s"
      }
    },
    {
      id: "evt_15",
      type: "deployment",
      severity: "info",
      title: "Deployment Started",
      description: "Beginning deployment of dashboard-ui to staging",
      user: "Mike Johnson",
      source: "dashboard-ui",
      timestamp: "2024-06-24T09:15:00Z",
      metadata: {
        version: "v1.8.2",
        environment: "staging"
      }
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    const matchesSeverity = severityFilter === "all" || event.severity === severityFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const eventDate = new Date(event.timestamp);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === "today") matchesDate = daysDiff === 0;
      else if (dateFilter === "week") matchesDate = daysDiff <= 7;
      else if (dateFilter === "month") matchesDate = daysDiff <= 30;
    }
    
    return matchesSearch && matchesType && matchesSeverity && matchesDate;
  });

  const getTypeIcon = (type: EventType) => {
    switch (type) {
      case "deployment": return <Rocket className="w-4 h-4" />;
      case "authentication": return <Shield className="w-4 h-4" />;
      case "system": return <Server className="w-4 h-4" />;
      case "database": return <Database className="w-4 h-4" />;
      case "configuration": return <Settings className="w-4 h-4" />;
      case "security": return <Key className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case "deployment": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "authentication": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "system": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "database": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "configuration": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "security": return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  const getSeverityColor = (severity: EventSeverity) => {
    switch (severity) {
      case "success": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "warning": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "error": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "info": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const getSeverityIcon = (severity: EventSeverity) => {
    switch (severity) {
      case "success": return <CheckCircle2 className="w-4 h-4" />;
      case "warning": return <AlertCircle className="w-4 h-4" />;
      case "error": return <XCircle className="w-4 h-4" />;
      case "info": return <Info className="w-4 h-4" />;
    }
  };

  const eventsByType = {
    deployment: events.filter(e => e.type === "deployment").length,
    authentication: events.filter(e => e.type === "authentication").length,
    system: events.filter(e => e.type === "system").length,
    database: events.filter(e => e.type === "database").length,
    configuration: events.filter(e => e.type === "configuration").length,
    security: events.filter(e => e.type === "security").length,
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">System Events</h1>
            <p className="text-sm text-gray-400">Monitor system activities and track events</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Rocket className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-gray-400">Deployments</p>
            </div>
            <p className="text-xl font-bold text-white">{eventsByType.deployment}</p>
          </div>
          <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400">Auth</p>
            </div>
            <p className="text-xl font-bold text-white">{eventsByType.authentication}</p>
          </div>
          <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-4 h-4 text-cyan-400" />
              <p className="text-xs text-gray-400">System</p>
            </div>
            <p className="text-xl font-bold text-white">{eventsByType.system}</p>
          </div>
          <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-green-400" />
              <p className="text-xs text-gray-400">Database</p>
            </div>
            <p className="text-xl font-bold text-white">{eventsByType.database}</p>
          </div>
          <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-4 h-4 text-orange-400" />
              <p className="text-xs text-gray-400">Config</p>
            </div>
            <p className="text-xl font-bold text-white">{eventsByType.configuration}</p>
          </div>
          <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Key className="w-4 h-4 text-red-400" />
              <p className="text-xs text-gray-400">Security</p>
            </div>
            <p className="text-xl font-bold text-white">{eventsByType.security}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                {(["all", "deployment", "authentication", "system", "database", "configuration", "security"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                      typeFilter === type
                        ? "bg-[#FF6B35] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {type === "all" ? "All" : type.slice(0, 4)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                {(["all", "success", "warning", "error", "info"] as const).map((severity) => (
                  <button
                    key={severity}
                    onClick={() => setSeverityFilter(severity)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                      severityFilter === severity
                        ? "bg-[#FF6B35] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                {(["today", "week", "month", "all"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateFilter(range)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                      dateFilter === range
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

        {/* Events Timeline */}
        <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Event Timeline</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {filteredEvents.length} events found
            </p>
          </div>
          <div className="divide-y divide-white/5">
            {filteredEvents.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No events found</p>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="px-6 py-5 hover:bg-white/2 transition cursor-pointer"
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowDetailModal(true);
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      event.severity === "success" ? "bg-gradient-to-br from-green-500 to-green-700" :
                      event.severity === "warning" ? "bg-gradient-to-br from-yellow-500 to-yellow-700" :
                      event.severity === "error" ? "bg-gradient-to-br from-red-500 to-red-700" :
                      "bg-gradient-to-br from-blue-500 to-blue-700"
                    }`}>
                      {getSeverityIcon(event.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-white">{event.title}</h3>
                          </div>
                          <p className="text-sm text-gray-300">{event.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getTypeColor(event.type)}`}>
                            {event.type.toUpperCase()}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getSeverityColor(event.severity)}`}>
                            {event.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          {getTypeIcon(event.type)}
                          <span className="capitalize">{event.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3 h-3" />
                          <span>{event.source}</span>
                        </div>
                        {event.user && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            <span>{event.user}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(event.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Event Detail Modal */}
        {showDetailModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedEvent.severity === "success" ? "bg-gradient-to-br from-green-500 to-green-700" :
                    selectedEvent.severity === "warning" ? "bg-gradient-to-br from-yellow-500 to-yellow-700" :
                    selectedEvent.severity === "error" ? "bg-gradient-to-br from-red-500 to-red-700" :
                    "bg-gradient-to-br from-blue-500 to-blue-700"
                  }`}>
                    {getSeverityIcon(selectedEvent.severity)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedEvent.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getTypeColor(selectedEvent.type)}`}>
                        {selectedEvent.type.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getSeverityColor(selectedEvent.severity)}`}>
                        {selectedEvent.severity.toUpperCase()}
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

              <div className="p-6 space-y-6">
                {/* Description */}
                <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
                  <p className="text-sm text-gray-300">{selectedEvent.description}</p>
                </div>

                {/* Details */}
                <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Event Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">Event Type</p>
                      <p className="text-white font-medium capitalize">{selectedEvent.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Severity</p>
                      <p className="text-white font-medium capitalize">{selectedEvent.severity}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Source</p>
                      <p className="text-white font-medium">{selectedEvent.source}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Timestamp</p>
                      <p className="text-white font-medium">
                        {new Date(selectedEvent.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {selectedEvent.user && (
                      <div>
                        <p className="text-gray-500 mb-1">User</p>
                        <p className="text-white font-medium">{selectedEvent.user}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
                  <div className="bg-gradient-to-br from-[#FF6B35]/10 to-transparent border border-[#FF6B35]/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {Object.entries(selectedEvent.metadata).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-gray-400 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-white font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
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
