"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Bell, BellOff, AlertTriangle, AlertCircle, Info, CheckCircle2,
  XCircle, Clock, TrendingUp, Activity, Server, Database, Globe,
  Cpu, HardDrive, Wifi, Shield, Search, Filter, Calendar,
  ChevronRight, Eye, Trash2, Settings, Users, Zap, BarChart3,
  Mail, MessageSquare, Phone, Slack
} from "lucide-react";

type AlertSeverity = "critical" | "warning" | "info";
type AlertStatus = "active" | "acknowledged" | "resolved";
type AlertCategory = "performance" | "security" | "availability" | "resource";

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  category: AlertCategory;
  source: string;
  timestamp: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  metrics?: {
    current: number;
    threshold: number;
    unit: string;
  };
}

interface AlertRule {
  id: string;
  name: string;
  description: string;
  category: AlertCategory;
  enabled: boolean;
  threshold: string;
  recipients: number;
}

export default function MonitoringAlertsPage() {
  const [selectedTab, setSelectedTab] = useState<"alerts" | "rules">("alerts");
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"all" | AlertSeverity>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | AlertStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | AlertCategory>("all");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const alerts: Alert[] = [
    {
      id: "alert_1",
      title: "High CPU Usage Detected",
      message: "CPU usage has exceeded 90% for the past 10 minutes on api-service",
      severity: "critical",
      status: "active",
      category: "performance",
      source: "api-service",
      timestamp: "2024-06-24T12:45:00Z",
      metrics: {
        current: 94,
        threshold: 90,
        unit: "%"
      }
    },
    {
      id: "alert_2",
      title: "SSL Certificate Expiring Soon",
      message: "SSL certificate for zencloud-web.app will expire in 7 days",
      severity: "warning",
      status: "acknowledged",
      category: "security",
      source: "zencloud-web",
      timestamp: "2024-06-24T10:30:00Z",
      acknowledgedBy: "John Doe"
    },
    {
      id: "alert_3",
      title: "Database Connection Pool Exhausted",
      message: "All database connections are in use. New requests are being queued.",
      severity: "critical",
      status: "active",
      category: "resource",
      source: "payment-service",
      timestamp: "2024-06-24T12:30:00Z",
      metrics: {
        current: 100,
        threshold: 95,
        unit: "%"
      }
    },
    {
      id: "alert_4",
      title: "Failed Login Attempts",
      message: "Multiple failed login attempts detected from IP 203.0.113.45",
      severity: "warning",
      status: "active",
      category: "security",
      source: "auth-service",
      timestamp: "2024-06-24T12:15:00Z"
    },
    {
      id: "alert_5",
      title: "Service Degradation",
      message: "Response time for /api/users endpoint has increased by 200%",
      severity: "warning",
      status: "acknowledged",
      category: "performance",
      source: "api-service",
      timestamp: "2024-06-24T11:45:00Z",
      acknowledgedBy: "Jane Smith",
      metrics: {
        current: 1200,
        threshold: 400,
        unit: "ms"
      }
    },
    {
      id: "alert_6",
      title: "Disk Space Low",
      message: "Available disk space is below 15% on production server",
      severity: "critical",
      status: "active",
      category: "resource",
      source: "prod-server-01",
      timestamp: "2024-06-24T11:30:00Z",
      metrics: {
        current: 12,
        threshold: 15,
        unit: "%"
      }
    },
    {
      id: "alert_7",
      title: "API Rate Limit Exceeded",
      message: "External API rate limit reached. Some requests are being throttled.",
      severity: "warning",
      status: "resolved",
      category: "availability",
      source: "integration-service",
      timestamp: "2024-06-24T10:00:00Z",
      resolvedAt: "2024-06-24T11:00:00Z"
    },
    {
      id: "alert_8",
      title: "Memory Usage High",
      message: "Memory usage has exceeded 85% on dashboard-ui service",
      severity: "warning",
      status: "active",
      category: "resource",
      source: "dashboard-ui",
      timestamp: "2024-06-24T09:30:00Z",
      metrics: {
        current: 87,
        threshold: 85,
        unit: "%"
      }
    },
    {
      id: "alert_9",
      title: "Deployment Successful",
      message: "New version v2.5.3 successfully deployed to production",
      severity: "info",
      status: "resolved",
      category: "availability",
      source: "zencloud-web",
      timestamp: "2024-06-24T09:00:00Z",
      resolvedAt: "2024-06-24T09:05:00Z"
    },
    {
      id: "alert_10",
      title: "Backup Completed",
      message: "Database backup completed successfully (2.4GB)",
      severity: "info",
      status: "resolved",
      category: "resource",
      source: "backup-service",
      timestamp: "2024-06-24T03:00:00Z",
      resolvedAt: "2024-06-24T03:45:00Z"
    }
  ];

  const alertRules: AlertRule[] = [
    {
      id: "rule_1",
      name: "High CPU Usage",
      description: "Trigger when CPU usage exceeds threshold",
      category: "performance",
      enabled: true,
      threshold: "> 90% for 10 minutes",
      recipients: 5
    },
    {
      id: "rule_2",
      name: "Memory Threshold",
      description: "Alert on high memory consumption",
      category: "resource",
      enabled: true,
      threshold: "> 85%",
      recipients: 4
    },
    {
      id: "rule_3",
      name: "API Response Time",
      description: "Monitor API endpoint response times",
      category: "performance",
      enabled: true,
      threshold: "> 1000ms",
      recipients: 6
    },
    {
      id: "rule_4",
      name: "SSL Certificate Expiry",
      description: "Alert before SSL certificates expire",
      category: "security",
      enabled: true,
      threshold: "< 30 days",
      recipients: 3
    },
    {
      id: "rule_5",
      name: "Failed Login Attempts",
      description: "Detect potential brute force attacks",
      category: "security",
      enabled: true,
      threshold: "> 10 attempts in 5 minutes",
      recipients: 4
    },
    {
      id: "rule_6",
      name: "Service Availability",
      description: "Monitor service uptime and availability",
      category: "availability",
      enabled: true,
      threshold: "< 99.9%",
      recipients: 8
    },
    {
      id: "rule_7",
      name: "Database Connections",
      description: "Monitor database connection pool usage",
      category: "resource",
      enabled: true,
      threshold: "> 90%",
      recipients: 5
    },
    {
      id: "rule_8",
      name: "Disk Space",
      description: "Alert on low disk space",
      category: "resource",
      enabled: true,
      threshold: "< 20%",
      recipients: 6
    },
    {
      id: "rule_9",
      name: "Error Rate",
      description: "Monitor application error rates",
      category: "availability",
      enabled: false,
      threshold: "> 5%",
      recipients: 7
    },
    {
      id: "rule_10",
      name: "Network Latency",
      description: "Detect network performance issues",
      category: "performance",
      enabled: false,
      threshold: "> 200ms",
      recipients: 3
    }
  ];

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = searchQuery === "" || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || alert.category === categoryFilter;
    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "warning": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "info": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="w-4 h-4" />;
      case "warning": return <AlertCircle className="w-4 h-4" />;
      case "info": return <Info className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case "active": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "acknowledged": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "resolved": return "bg-green-500/10 text-green-400 border-green-500/20";
    }
  };

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case "performance": return <TrendingUp className="w-4 h-4" />;
      case "security": return <Shield className="w-4 h-4" />;
      case "availability": return <Activity className="w-4 h-4" />;
      case "resource": return <Server className="w-4 h-4" />;
    }
  };

  const activeAlerts = alerts.filter(a => a.status === "active").length;
  const criticalAlerts = alerts.filter(a => a.severity === "critical" && a.status === "active").length;
  const acknowledgedAlerts = alerts.filter(a => a.status === "acknowledged").length;
  const resolvedAlerts = alerts.filter(a => a.status === "resolved").length;

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Monitoring Alerts</h1>
            <p className="text-sm text-gray-400">Monitor and manage system alerts and notifications</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
              <Settings className="w-4 h-4" />
              Configure
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Active Alerts</p>
                <p className="text-xl font-bold text-white">{activeAlerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Critical</p>
                <p className="text-xl font-bold text-white">{criticalAlerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Acknowledged</p>
                <p className="text-xl font-bold text-white">{acknowledgedAlerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Resolved</p>
                <p className="text-xl font-bold text-white">{resolvedAlerts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5">
          <button
            onClick={() => setSelectedTab("alerts")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              selectedTab === "alerts"
                ? "text-white border-[#FF6B35]"
                : "text-gray-400 hover:text-white border-transparent"
            }`}
          >
            <Bell className="w-4 h-4" />
            Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setSelectedTab("rules")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              selectedTab === "rules"
                ? "text-white border-[#FF6B35]"
                : "text-gray-400 hover:text-white border-transparent"
            }`}
          >
            <Settings className="w-4 h-4" />
            Alert Rules ({alertRules.length})
          </button>
        </div>

        {/* Alerts Tab */}
        {selectedTab === "alerts" && (
          <>
            {/* Filters */}
            <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search alerts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                    {(["all", "critical", "warning", "info"] as const).map((severity) => (
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
                    {(["all", "active", "acknowledged", "resolved"] as const).map((status) => (
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
                    {(["all", "performance", "security", "availability", "resource"] as const).map((category) => (
                      <button
                        key={category}
                        onClick={() => setCategoryFilter(category)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                          categoryFilter === category
                            ? "bg-[#FF6B35] text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {category === "all" ? "All" : category.slice(0, 4)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h2 className="text-sm font-semibold text-white">System Alerts</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {filteredAlerts.length} alerts found
                </p>
              </div>
              <div className="divide-y divide-white/5">
                {filteredAlerts.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No alerts found</p>
                    <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="px-6 py-5 hover:bg-white/2 transition cursor-pointer"
                      onClick={() => {
                        setSelectedAlert(alert);
                        setShowDetailModal(true);
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          alert.severity === "critical" ? "bg-gradient-to-br from-red-500 to-red-700" :
                          alert.severity === "warning" ? "bg-gradient-to-br from-yellow-500 to-yellow-700" :
                          "bg-gradient-to-br from-blue-500 to-blue-700"
                        }`}>
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-white mb-1">{alert.title}</h3>
                              <p className="text-sm text-gray-300">{alert.message}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getSeverityColor(alert.severity)}`}>
                                {alert.severity.toUpperCase()}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(alert.status)}`}>
                                {alert.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              {getCategoryIcon(alert.category)}
                              <span className="capitalize">{alert.category}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Server className="w-3 h-3" />
                              <span>{alert.source}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(alert.timestamp).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {alert.metrics && (
                              <div className="flex items-center gap-1.5">
                                <BarChart3 className="w-3 h-3" />
                                <span>
                                  {alert.metrics.current}{alert.metrics.unit} / {alert.metrics.threshold}{alert.metrics.unit}
                                </span>
                              </div>
                            )}
                            {alert.acknowledgedBy && (
                              <div className="flex items-center gap-1.5 text-orange-400">
                                <Users className="w-3 h-3" />
                                <span>Ack by {alert.acknowledgedBy}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Alert Rules Tab */}
        {selectedTab === "rules" && (
          <div className="space-y-4">
            <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h2 className="text-sm font-semibold text-white">Alert Rules</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {alertRules.filter(r => r.enabled).length} active rules • {alertRules.length} total
                </p>
              </div>
              <div className="divide-y divide-white/5">
                {alertRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="px-6 py-5 hover:bg-white/2 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center shrink-0">
                        {getCategoryIcon(rule.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-white">{rule.name}</h3>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                rule.enabled
                                  ? "bg-green-500/10 text-green-400"
                                  : "bg-gray-500/10 text-gray-400"
                              }`}>
                                {rule.enabled ? "ENABLED" : "DISABLED"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">{rule.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <div className="flex items-center gap-1.5">
                                <BarChart3 className="w-3 h-3" />
                                <span>Threshold: {rule.threshold}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3 h-3" />
                                <span>{rule.recipients} recipients</span>
                              </div>
                              <div className="flex items-center gap-1.5 capitalize">
                                {getCategoryIcon(rule.category)}
                                <span>{rule.category}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button className="p-2 hover:bg-white/5 rounded-lg transition text-gray-400 hover:text-white">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-white/5 rounded-lg transition text-gray-400 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alert Detail Modal */}
        {showDetailModal && selectedAlert && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedAlert.severity === "critical" ? "bg-gradient-to-br from-red-500 to-red-700" :
                    selectedAlert.severity === "warning" ? "bg-gradient-to-br from-yellow-500 to-yellow-700" :
                    "bg-gradient-to-br from-blue-500 to-blue-700"
                  }`}>
                    {getSeverityIcon(selectedAlert.severity)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedAlert.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getSeverityColor(selectedAlert.severity)}`}>
                        {selectedAlert.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(selectedAlert.status)}`}>
                        {selectedAlert.status.toUpperCase()}
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
                {/* Message */}
                <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Alert Message</h3>
                  <p className="text-sm text-gray-300">{selectedAlert.message}</p>
                </div>

                {/* Details */}
                <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">Source</p>
                      <p className="text-white font-medium">{selectedAlert.source}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Category</p>
                      <p className="text-white font-medium capitalize">{selectedAlert.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Triggered</p>
                      <p className="text-white font-medium">
                        {new Date(selectedAlert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Status</p>
                      <p className="text-white font-medium capitalize">{selectedAlert.status}</p>
                    </div>
                    {selectedAlert.acknowledgedBy && (
                      <div>
                        <p className="text-gray-500 mb-1">Acknowledged By</p>
                        <p className="text-white font-medium">{selectedAlert.acknowledgedBy}</p>
                      </div>
                    )}
                    {selectedAlert.resolvedAt && (
                      <div>
                        <p className="text-gray-500 mb-1">Resolved At</p>
                        <p className="text-white font-medium">
                          {new Date(selectedAlert.resolvedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                {selectedAlert.metrics && (
                  <div className="bg-gradient-to-br from-[#FF6B35]/10 to-transparent border border-[#FF6B35]/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Current Value</span>
                        <span className="text-lg font-bold text-white">
                          {selectedAlert.metrics.current}{selectedAlert.metrics.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Threshold</span>
                        <span className="text-sm font-semibold text-[#FF6B35]">
                          {selectedAlert.metrics.threshold}{selectedAlert.metrics.unit}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-[#FF6B35] h-2 rounded-full"
                          style={{
                            width: `${Math.min((selectedAlert.metrics.current / selectedAlert.metrics.threshold) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedAlert.status === "active" && (
                    <button
                      onClick={() => {
                        alert("Alert acknowledged");
                        setShowDetailModal(false);
                      }}
                      className="flex-1 px-4 py-3 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition"
                    >
                      Acknowledge
                    </button>
                  )}
                  {(selectedAlert.status === "active" || selectedAlert.status === "acknowledged") && (
                    <button
                      onClick={() => {
                        alert("Alert resolved");
                        setShowDetailModal(false);
                      }}
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition"
                    >
                      Resolve
                    </button>
                  )}
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
