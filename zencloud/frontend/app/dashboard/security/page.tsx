"use client";

import { useState } from "react";
import {
  Key, Shield, Eye, EyeOff, Copy, Trash2, Plus, Check, X,
  AlertTriangle, Clock, Globe, Smartphone, Lock, FileText,
  Activity, Download, RefreshCw, Search, Filter, Info
} from "lucide-react";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  prefix: string;
  created: string;
  lastUsed: string;
  expiresAt: string | null;
  permissions: string[];
  visible: boolean;
  status: "active" | "expired" | "revoked";
};

type AccessToken = {
  id: string;
  name: string;
  token: string;
  scopes: string[];
  created: string;
  expiresAt: string;
  lastUsed: string;
};

type AuditLog = {
  id: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed";
};

type Session = {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  created: string;
  current: boolean;
};

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<"api-keys" | "tokens" | "audit" | "2fa" | "sessions">("api-keys");
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  // Audit Logs state
  const [auditSearchQuery, setAuditSearchQuery] = useState("");
  const [auditFilterStatus, setAuditFilterStatus] = useState<"all" | "success" | "failed">("all");
  const [auditFilterAction, setAuditFilterAction] = useState<string>("all");
  const [auditDateRange, setAuditDateRange] = useState<"today" | "week" | "month" | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Access Token state
  const [showNewToken, setShowNewToken] = useState(false);
  const [newToken, setNewToken] = useState("");
  const [newTokenName, setNewTokenName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [tokenExpiry, setTokenExpiry] = useState("90");
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API Key",
      key: "zc_live_4f3d8b2a9e1c6h7j5k9m8n2p4q6r8s0t",
      prefix: "zc_live_",
      created: "2024-01-15",
      lastUsed: "2 hours ago",
      expiresAt: null,
      permissions: ["read", "write", "deploy"],
      visible: false,
      status: "active"
    },
    {
      id: "2",
      name: "Development Key",
      key: "zc_test_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
      prefix: "zc_test_",
      created: "2024-02-20",
      lastUsed: "1 day ago",
      expiresAt: "2024-12-31",
      permissions: ["read"],
      visible: false,
      status: "active"
    }
  ]);

  const [accessTokens, setAccessTokens] = useState<AccessToken[]>([
    {
      id: "1",
      name: "GitHub Actions CI/CD",
      token: "zct_ghactions_a1b2c3d4e5f6g7h8i9j0",
      scopes: ["deployments:write", "projects:read", "logs:read"],
      created: "2024-03-01",
      expiresAt: "2025-03-01",
      lastUsed: "5 minutes ago"
    },
    {
      id: "2",
      name: "Mobile App API",
      token: "zct_mobile_k1l2m3n4o5p6q7r8s9t0",
      scopes: ["projects:read", "databases:read"],
      created: "2024-04-15",
      expiresAt: "2024-10-15",
      lastUsed: "2 days ago"
    },
    {
      id: "3",
      name: "Monitoring Dashboard",
      token: "zct_monitor_u1v2w3x4y5z6a7b8c9d0",
      scopes: ["metrics:read", "logs:read", "projects:read"],
      created: "2024-05-20",
      expiresAt: "2025-05-20",
      lastUsed: "1 hour ago"
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "1",
      action: "API Key Created",
      resource: "Production API Key",
      timestamp: "2024-06-18 10:30:00",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 115.0.0.0",
      status: "success"
    },
    {
      id: "2",
      action: "Project Deployed",
      resource: "E-commerce App",
      timestamp: "2024-06-18 09:15:00",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 115.0.0.0",
      status: "success"
    },
    {
      id: "3",
      action: "Login Attempt",
      resource: "User Account",
      timestamp: "2024-06-18 08:00:00",
      ipAddress: "203.0.113.0",
      userAgent: "Unknown",
      status: "failed"
    },
    {
      id: "4",
      action: "Password Changed",
      resource: "User Account",
      timestamp: "2024-06-17 14:22:00",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 115.0.0.0",
      status: "success"
    },
    {
      id: "5",
      action: "2FA Enabled",
      resource: "Security Settings",
      timestamp: "2024-06-17 13:45:00",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 115.0.0.0",
      status: "success"
    },
    {
      id: "6",
      action: "API Key Revoked",
      resource: "Development Key",
      timestamp: "2024-06-17 11:20:00",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 115.0.0.0",
      status: "success"
    },
    {
      id: "7",
      action: "Database Created",
      resource: "PostgreSQL Database",
      timestamp: "2024-06-16 16:10:00",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 115.0.0.0",
      status: "success"
    },
    {
      id: "8",
      action: "Deployment Failed",
      resource: "Portfolio Website",
      timestamp: "2024-06-16 15:30:00",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 115.0.0.0",
      status: "failed"
    },
    {
      id: "9",
      action: "Session Revoked",
      resource: "iPhone Session",
      timestamp: "2024-06-16 12:00:00",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 115.0.0.0",
      status: "success"
    },
    {
      id: "10",
      action: "Domain Added",
      resource: "app.example.com",
      timestamp: "2024-06-15 10:15:00",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 115.0.0.0",
      status: "success"
    },
    {
      id: "11",
      action: "Access Token Created",
      resource: "CI/CD Token",
      timestamp: "2024-06-15 09:00:00",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 115.0.0.0",
      status: "success"
    },
    {
      id: "12",
      action: "Login Attempt",
      resource: "User Account",
      timestamp: "2024-06-14 22:30:00",
      ipAddress: "198.51.100.0",
      userAgent: "Unknown",
      status: "failed"
    },
    {
      id: "13",
      action: "Project Deleted",
      resource: "Test Project",
      timestamp: "2024-06-14 14:20:00",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 115.0.0.0",
      status: "success"
    },
    {
      id: "14",
      action: "Environment Variable Updated",
      resource: "E-commerce App",
      timestamp: "2024-06-13 11:45:00",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 115.0.0.0",
      status: "success"
    },
    {
      id: "15",
      action: "Backup Code Used",
      resource: "2FA Authentication",
      timestamp: "2024-06-12 08:30:00",
      ipAddress: "192.168.1.101",
      userAgent: "Safari 16.0",
      status: "success"
    }
  ]);

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "Windows Desktop",
      browser: "Chrome 115",
      location: "San Francisco, US",
      ipAddress: "192.168.1.100",
      lastActive: "Now",
      created: "2024-06-18 08:00:00",
      current: true
    },
    {
      id: "2",
      device: "iPhone 14",
      browser: "Safari",
      location: "San Francisco, US",
      ipAddress: "192.168.1.101",
      lastActive: "2 hours ago",
      created: "2024-06-17 15:30:00",
      current: false
    }
  ]);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [setup2FA, setSetup2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const generate2FASecret = () => {
    // Simulate generating a secret
    const codes = Array.from({ length: 8 }, () => 
      `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    );
    setBackupCodes(codes);
    setSetup2FA(true);
  };

  const verify2FACode = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setSetup2FA(false);
      setShowBackupCodes(true);
      setVerificationCode("");
    } else {
      alert("Please enter a valid 6-digit code");
    }
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zenbase-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const regenerateBackupCodes = () => {
    if (confirm("This will invalidate your current backup codes. Continue?")) {
      const codes = Array.from({ length: 8 }, () => 
        `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      );
      setBackupCodes(codes);
    }
  };

  const availablePermissions = [
    { id: "read", label: "Read", description: "View resources" },
    { id: "write", label: "Write", description: "Create and update resources" },
    { id: "delete", label: "Delete", description: "Delete resources" },
    { id: "deploy", label: "Deploy", description: "Trigger deployments" },
    { id: "admin", label: "Admin", description: "Full access" }
  ];

  const availableScopes = [
    { id: "projects:read", label: "Read Projects", category: "Projects" },
    { id: "projects:write", label: "Write Projects", category: "Projects" },
    { id: "deployments:read", label: "Read Deployments", category: "Deployments" },
    { id: "deployments:write", label: "Trigger Deployments", category: "Deployments" },
    { id: "databases:read", label: "Read Databases", category: "Databases" },
    { id: "databases:write", label: "Manage Databases", category: "Databases" },
    { id: "domains:read", label: "Read Domains", category: "Domains" },
    { id: "domains:write", label: "Manage Domains", category: "Domains" },
    { id: "logs:read", label: "Read Logs", category: "Monitoring" },
    { id: "metrics:read", label: "Read Metrics", category: "Monitoring" },
    { id: "secrets:read", label: "Read Secrets", category: "Secrets" },
    { id: "secrets:write", label: "Manage Secrets", category: "Secrets" }
  ];

  const generateAccessToken = () => {
    if (!newTokenName.trim()) {
      alert("Please enter a token name");
      return;
    }
    if (selectedScopes.length === 0) {
      alert("Please select at least one scope");
      return;
    }

    const prefix = "zct_";
    const tokenBody = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15) +
                      Math.random().toString(36).substring(2, 15);
    const token = `${prefix}${tokenBody}`;
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(tokenExpiry));

    const newAccessToken: AccessToken = {
      id: Date.now().toString(),
      name: newTokenName,
      token,
      scopes: selectedScopes,
      created: new Date().toISOString().split('T')[0],
      expiresAt: expiryDate.toISOString().split('T')[0],
      lastUsed: "Never"
    };
    
    setAccessTokens([newAccessToken, ...accessTokens]);
    setNewToken(token);
    setShowNewToken(true);
    setNewTokenName("");
    setSelectedScopes([]);
    setTokenExpiry("90");
  };

  const generateApiKey = () => {
    if (!newKeyName.trim()) {
      alert("Please enter a name for the API key");
      return;
    }
    if (selectedPermissions.length === 0) {
      alert("Please select at least one permission");
      return;
    }

    const prefix = "zc_live_";
    const key = `${prefix}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key,
      prefix,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      expiresAt: null,
      permissions: selectedPermissions,
      visible: true,
      status: "active"
    };
    
    setApiKeys([newKey, ...apiKeys]);
    setNewKeyValue(key);
    setShowNewKey(true);
    setNewKeyName("");
    setSelectedPermissions([]);
  };

  const toggleKeyVisibility = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, visible: !k.visible } : k));
  };

  const deleteApiKey = (id: string) => {
    if (confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      setApiKeys(apiKeys.filter(k => k.id !== id));
    }
  };

  const revokeToken = (id: string) => {
    if (confirm("Revoke this access token?")) {
      setAccessTokens(accessTokens.filter(t => t.id !== id));
    }
  };

  const revokeSession = (id: string) => {
    if (confirm("Revoke this session?")) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Audit log filtering and export
  const filteredAuditLogs = auditLogs.filter(log => {
    // Search filter
    if (auditSearchQuery && !log.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) &&
        !log.resource.toLowerCase().includes(auditSearchQuery.toLowerCase()) &&
        !log.ipAddress.includes(auditSearchQuery)) {
      return false;
    }
    // Status filter
    if (auditFilterStatus !== "all" && log.status !== auditFilterStatus) {
      return false;
    }
    // Action filter
    if (auditFilterAction !== "all" && log.action !== auditFilterAction) {
      return false;
    }
    return true;
  });

  const uniqueActions = Array.from(new Set(auditLogs.map(log => log.action)));

  const paginatedLogs = filteredAuditLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAuditLogs.length / itemsPerPage);

  const exportAuditLogs = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const headers = ['Timestamp', 'Action', 'Resource', 'Status', 'IP Address', 'User Agent'];
      const rows = filteredAuditLogs.map(log => [
        log.timestamp,
        log.action,
        log.resource,
        log.status,
        log.ipAddress,
        log.userAgent
      ]);
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const json = JSON.stringify(filteredAuditLogs, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + "•".repeat(16) + key.substring(key.length - 4);
  };

  const tabs = [
    { id: "api-keys", label: "API Keys", icon: Key, count: apiKeys.length },
    { id: "tokens", label: "Access Tokens", icon: Lock, count: accessTokens.length },
    { id: "audit", label: "Audit Logs", icon: FileText, count: auditLogs.length },
    { id: "2fa", label: "Two-Factor Auth", icon: Smartphone, count: 0 },
    { id: "sessions", label: "Active Sessions", icon: Globe, count: sessions.length }
  ];

  return (
    <div className="p-5 space-y-4 bg-[#0B0B0F] min-h-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#FF6B35]" />
            Security
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage API keys, tokens, and security settings</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs">
          <Download className="w-3.5 h-3.5" />
          Export Logs
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#FF6B35] text-white"
                : "bg-[#111116] border border-white/8 text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? "bg-white/20" : "bg-white/5"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* API Keys Tab */}
      {activeTab === "api-keys" && (
        <div className="space-y-4">
          {/* New Key Alert */}
          {showNewKey && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <p className="text-green-400 text-sm font-medium">API Key Generated Successfully</p>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-[#0B0B0F] px-3 py-2 rounded text-xs text-white font-mono break-all">
                  {newKeyValue}
                </code>
                <button
                  onClick={() => copyToClipboard(newKeyValue)}
                  className="p-2 hover:bg-white/5 rounded transition shrink-0"
                  title="Copy"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400">
                  Make sure to copy this key now. You won't be able to see it again for security reasons!
                </p>
              </div>
              <button
                onClick={() => setShowNewKey(false)}
                className="text-xs text-gray-400 hover:text-white transition"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Create New Key */}
          <div className="bg-[#111116] border border-white/6 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Create New API Key</h2>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Key Name</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API, CI/CD Pipeline"
                className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Permissions</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {availablePermissions.map((perm) => (
                  <label
                    key={perm.id}
                    className={`flex items-start gap-2 p-3 rounded-lg border cursor-pointer transition ${
                      selectedPermissions.includes(perm.id)
                        ? "bg-[#FF6B35]/10 border-[#FF6B35]/30"
                        : "bg-[#0B0B0F] border-white/8 hover:border-white/15"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([...selectedPermissions, perm.id]);
                        } else {
                          setSelectedPermissions(selectedPermissions.filter(p => p !== perm.id));
                        }
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-white/10 text-[#FF6B35]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white">{perm.label}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{perm.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={generateApiKey}
              className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Generate API Key
            </button>
          </div>

          {/* API Keys List */}
          <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h2 className="text-sm font-semibold text-white">Your API Keys</h2>
              <span className="text-[10px] text-gray-500">{apiKeys.length} keys</span>
            </div>
            
            {apiKeys.length === 0 ? (
              <div className="p-12 text-center">
                <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-white mb-2">No API Keys</h3>
                <p className="text-xs text-gray-500">Create your first API key to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {apiKeys.map((key) => (
                  <div key={key.id} className="p-5 space-y-4 hover:bg-white/2 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-white">{key.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            key.status === "active" ? "bg-green-500/10 text-green-400" :
                            key.status === "expired" ? "bg-yellow-500/10 text-yellow-400" :
                            "bg-red-500/10 text-red-400"
                          }`}>
                            {key.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                          <span>Created {key.created}</span>
                          <span>•</span>
                          <span>Last used {key.lastUsed}</span>
                          {key.expiresAt && (
                            <>
                              <span>•</span>
                              <span>Expires {key.expiresAt}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteApiKey(key.id)}
                        className="p-2 hover:bg-red-500/10 rounded transition shrink-0"
                        title="Revoke"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-[#0B0B0F] px-3 py-2.5 rounded text-xs text-gray-400 font-mono">
                        {key.visible ? key.key : maskKey(key.key)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="p-2 hover:bg-white/5 rounded transition"
                        title={key.visible ? "Hide" : "Show"}
                      >
                        {key.visible ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(key.key)}
                        className="p-2 hover:bg-white/5 rounded transition"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Permissions:</span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {key.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="px-2 py-1 bg-white/5 text-gray-400 rounded text-[10px]"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Access Tokens Tab */}
      {activeTab === "tokens" && (
        <div className="space-y-4">
          {/* New Token Success Alert */}
          {showNewToken && newToken && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <p className="text-green-400 text-sm font-medium">Access Token Generated Successfully</p>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-[#0B0B0F] px-3 py-2 rounded text-xs text-white font-mono break-all">
                  {newToken}
                </code>
                <button
                  onClick={() => copyToClipboard(newToken)}
                  className="p-2 hover:bg-white/5 rounded transition shrink-0"
                  title="Copy"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400">
                  Make sure to copy this token now. You won't be able to see it again for security reasons!
                </p>
              </div>
              <button
                onClick={() => setShowNewToken(false)}
                className="text-xs text-gray-400 hover:text-white transition"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Create New Token */}
          <div className="bg-[#111116] border border-white/6 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Create New Access Token</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Token Name</label>
                <input
                  type="text"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                  placeholder="e.g., CI/CD Pipeline, Mobile App API"
                  className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Expiration</label>
                <select
                  value={tokenExpiry}
                  onChange={(e) => setTokenExpiry(e.target.value)}
                  className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                >
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Scopes & Permissions</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {availableScopes.map((scope) => (
                  <label
                    key={scope.id}
                    className={`flex items-start gap-2 p-3 rounded-lg border cursor-pointer transition ${
                      selectedScopes.includes(scope.id)
                        ? "bg-[#FF6B35]/10 border-[#FF6B35]/30"
                        : "bg-[#0B0B0F] border-white/8 hover:border-white/15"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedScopes.includes(scope.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedScopes([...selectedScopes, scope.id]);
                        } else {
                          setSelectedScopes(selectedScopes.filter(s => s !== scope.id));
                        }
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-white/10 text-[#FF6B35]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white">{scope.label}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{scope.category}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={generateAccessToken}
              className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Generate Access Token
            </button>
          </div>

          {/* Access Tokens List */}
          <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h2 className="text-sm font-semibold text-white">Your Access Tokens</h2>
              <span className="text-[10px] text-gray-500">{accessTokens.length} tokens</span>
            </div>
            
            {accessTokens.length === 0 ? (
              <div className="p-12 text-center">
                <Lock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-white mb-2">No Access Tokens</h3>
                <p className="text-xs text-gray-500">Create your first token to integrate with third-party services</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {accessTokens.map((token) => {
                  const isExpiringSoon = new Date(token.expiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
                  const isExpired = new Date(token.expiresAt) < new Date();

                  return (
                    <div key={token.id} className="p-5 space-y-4 hover:bg-white/2 transition">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-white">{token.name}</h3>
                            {isExpired ? (
                              <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] rounded">
                                Expired
                              </span>
                            ) : isExpiringSoon ? (
                              <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-[10px] rounded flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Expiring Soon
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Created {token.created}
                            </span>
                            <span>•</span>
                            <span>Last used {token.lastUsed}</span>
                            <span>•</span>
                            <span className={isExpired ? "text-red-400" : isExpiringSoon ? "text-yellow-400" : ""}>
                              Expires {token.expiresAt}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => revokeToken(token.id)}
                          className="p-2 hover:bg-red-500/10 rounded transition shrink-0"
                          title="Revoke"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-500 mt-1">Scopes:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {token.scopes.map((scope) => (
                            <span
                              key={scope}
                              className="px-2 py-1 bg-white/5 text-gray-400 rounded text-[10px] font-mono"
                            >
                              {scope}
                            </span>
                          ))}
                        </div>
                      </div>

                      {isExpiringSoon && !isExpired && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-yellow-300">
                            This token will expire soon. Consider creating a new token to avoid service interruption.
                          </p>
                        </div>
                      )}

                      {isExpired && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                          <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-red-300">
                            This token has expired and is no longer valid. Create a new token to restore access.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          {/* Filters and Stats */}
          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={auditSearchQuery}
                  onChange={(e) => {
                    setAuditSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search actions, resources, or IP addresses..."
                  className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg pl-10 pr-4 py-2.5 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                {/* Status Filter */}
                <select
                  value={auditFilterStatus}
                  onChange={(e) => {
                    setAuditFilterStatus(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>

                {/* Action Filter */}
                <select
                  value={auditFilterAction}
                  onChange={(e) => {
                    setAuditFilterAction(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                >
                  <option value="all">All Actions</option>
                  {uniqueActions.map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>

                {/* Export Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs">
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-[#1a1a1f] border border-white/8 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button
                      onClick={() => exportAuditLogs('csv')}
                      className="w-full px-4 py-2 text-xs text-left text-white hover:bg-white/5 transition first:rounded-t-lg"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => exportAuditLogs('json')}
                      className="w-full px-4 py-2 text-xs text-left text-white hover:bg-white/5 transition last:rounded-b-lg"
                    >
                      Export as JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Total Events</p>
                <p className="text-lg font-bold text-white">{filteredAuditLogs.length}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Successful</p>
                <p className="text-lg font-bold text-green-400">
                  {filteredAuditLogs.filter(l => l.status === "success").length}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Failed</p>
                <p className="text-lg font-bold text-red-400">
                  {filteredAuditLogs.filter(l => l.status === "failed").length}
                </p>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
            {paginatedLogs.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-white mb-2">No audit logs found</h3>
                <p className="text-xs text-gray-500">
                  {auditSearchQuery || auditFilterStatus !== "all" || auditFilterAction !== "all"
                    ? "Try adjusting your filters"
                    : "Your activity will appear here"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">Timestamp</th>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">Action</th>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">Resource</th>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">IP Address</th>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">User Agent</th>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/3">
                      {paginatedLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/2 transition group">
                          <td className="px-5 py-3 text-gray-400 font-mono text-[11px]">
                            {log.timestamp}
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-white font-medium">{log.action}</span>
                          </td>
                          <td className="px-5 py-3 text-gray-400 max-w-[200px] truncate">
                            {log.resource}
                          </td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => copyToClipboard(log.ipAddress)}
                              className="text-gray-400 font-mono hover:text-white transition flex items-center gap-1 group/ip"
                              title="Click to copy"
                            >
                              {log.ipAddress}
                              <Copy className="w-3 h-3 opacity-0 group-hover/ip:opacity-100 transition" />
                            </button>
                          </td>
                          <td className="px-5 py-3 text-gray-400 max-w-[150px] truncate" title={log.userAgent}>
                            {log.userAgent}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium ${
                              log.status === "success" 
                                ? "bg-green-500/10 text-green-400" 
                                : "bg-red-500/10 text-red-400"
                            }`}>
                              {log.status === "success" ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
                    <p className="text-xs text-gray-500">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAuditLogs.length)} of {filteredAuditLogs.length} entries
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
                              currentPage === page
                                ? "bg-[#FF6B35] text-white"
                                : "border border-white/8 text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* 2FA Tab */}
      {activeTab === "2fa" && (
        <div className="space-y-4">
          {!twoFactorEnabled && !setup2FA && (
            <div className="bg-[#111116] border border-white/6 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-[#FF6B35]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-white mb-2">Two-Factor Authentication</h2>
                  <p className="text-xs text-gray-400 mb-4">
                    Add an extra layer of security to your account by requiring a second verification method when signing in.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-blue-400 font-medium mb-1">
                            Recommended for enhanced security
                          </p>
                          <p className="text-xs text-blue-300">
                            Protect your account from unauthorized access even if your password is compromised.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-white">How it works:</h3>
                      <div className="space-y-2">
                        {[
                          "Install an authenticator app (Google Authenticator, Authy, etc.)",
                          "Scan the QR code to link your account",
                          "Enter the 6-digit code from your app to verify",
                          "Save backup codes in case you lose access to your device"
                        ].map((step, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-xs text-gray-400">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={generate2FASecret}
                      className="bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition"
                    >
                      Enable Two-Factor Authentication
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {setup2FA && !twoFactorEnabled && (
            <div className="bg-[#111116] border border-white/6 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-white mb-1">Set Up Authenticator App</h2>
                <p className="text-xs text-gray-400">Follow these steps to enable two-factor authentication</p>
              </div>

              {/* Step 1: Scan QR Code */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs font-bold">1</span>
                  <h3 className="text-xs font-semibold text-white">Scan QR Code</h3>
                </div>
                <p className="text-xs text-gray-400 pl-8">
                  Open your authenticator app and scan this QR code
                </p>
                <div className="pl-8">
                  <div className="w-48 h-48 bg-white rounded-lg p-4 flex items-center justify-center">
                    {/* QR Code Placeholder - In production, use a real QR code library */}
                    <div className="text-center">
                      <div className="grid grid-cols-8 gap-0.5 mb-2">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                          />
                        ))}
                      </div>
                      <p className="text-[8px] text-gray-600">QR Code</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-[#0B0B0F] border border-white/8 rounded-lg">
                    <p className="text-[10px] text-gray-500 mb-1">Or enter this key manually:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs text-white font-mono">
                        JBSWY3DPEHPK3PXP
                      </code>
                      <button
                        onClick={() => copyToClipboard("JBSWY3DPEHPK3PXP")}
                        className="p-1.5 hover:bg-white/5 rounded transition"
                      >
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Enter Code */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="text-xs font-semibold text-white">Verify Setup</h3>
                </div>
                <p className="text-xs text-gray-400 pl-8">
                  Enter the 6-digit code from your authenticator app
                </p>
                <div className="pl-8 space-y-3">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-40 bg-[#0B0B0F] border border-white/8 rounded-lg px-4 py-3 text-white text-center text-lg font-mono tracking-wider focus:outline-none focus:border-[#FF6B35] transition"
                    maxLength={6}
                  />
                  <button
                    onClick={verify2FACode}
                    disabled={verificationCode.length !== 6}
                    className="bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify and Enable
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <button
                  onClick={() => setSetup2FA(false)}
                  className="text-xs text-gray-400 hover:text-white transition"
                >
                  Cancel Setup
                </button>
              </div>
            </div>
          )}

          {twoFactorEnabled && (
            <div className="space-y-4">
              {/* Success Status */}
              <div className="bg-[#111116] border border-white/6 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-white mb-1">Two-Factor Authentication Active</h2>
                    <p className="text-xs text-gray-400">
                      Your account is protected with two-factor authentication
                    </p>
                  </div>
                  <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full">
                    Enabled
                  </span>
                </div>
              </div>

              {/* Backup Codes */}
              {showBackupCodes && backupCodes.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 space-y-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-green-400 mb-1">Save Your Backup Codes</h3>
                      <p className="text-xs text-green-300 mb-3">
                        Store these codes in a secure location. Each code can only be used once to access your account if you lose your device.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, i) => (
                      <div key={i} className="bg-[#0B0B0F] border border-white/8 rounded-lg p-3 text-center group relative">
                        <code className="text-xs text-white font-mono">{code}</code>
                        <button
                          onClick={() => copyToClipboard(code)}
                          className="absolute inset-0 bg-[#FF6B35]/90 rounded-lg opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        >
                          <Copy className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={downloadBackupCodes}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Codes
                    </button>
                    <button
                      onClick={() => setShowBackupCodes(false)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs"
                    >
                      I've Saved Them
                    </button>
                  </div>
                </div>
              )}

              {/* Manage 2FA */}
              <div className="bg-[#111116] border border-white/6 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Manage Two-Factor Authentication</h3>

                {/* Authenticator Apps */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-[#0B0B0F] border border-white/8 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-[#FF6B35]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">Authenticator App</p>
                        <p className="text-[10px] text-gray-500">Google Authenticator, Authy, etc.</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] rounded">Connected</span>
                  </div>
                </div>

                {/* Backup Codes Section */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <h4 className="text-xs font-semibold text-white">Backup Codes</h4>
                  <p className="text-xs text-gray-400">
                    You have <span className="text-white font-medium">{backupCodes.length || 8}</span> unused backup codes
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowBackupCodes(!showBackupCodes)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Codes
                    </button>
                    <button
                      onClick={regenerateBackupCodes}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Regenerate
                    </button>
                    <button
                      onClick={downloadBackupCodes}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-4 border-t border-red-500/20 space-y-3">
                  <h4 className="text-xs font-semibold text-red-400">Danger Zone</h4>
                  <p className="text-xs text-gray-400">
                    Disabling 2FA will make your account less secure
                  </p>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to disable two-factor authentication? This will make your account less secure.")) {
                        setTwoFactorEnabled(false);
                        setShowBackupCodes(false);
                      }
                    }}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold transition"
                  >
                    Disable Two-Factor Authentication
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === "sessions" && (
        <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div>
              <h2 className="text-sm font-semibold text-white">Active Sessions</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage devices with access to your account</p>
            </div>
            <span className="text-[10px] text-gray-500">{sessions.length} active</span>
          </div>

          <div className="divide-y divide-white/5">
            {sessions.map((session) => (
              <div key={session.id} className="p-5 hover:bg-white/2 transition">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-white">{session.device}</h3>
                          {session.current && (
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{session.browser}</p>
                      </div>
                      {!session.current && (
                        <button
                          onClick={() => revokeSession(session.id)}
                          className="text-xs text-red-400 hover:text-red-300 transition"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {session.location}
                      </span>
                      <span>•</span>
                      <span>{session.ipAddress}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
