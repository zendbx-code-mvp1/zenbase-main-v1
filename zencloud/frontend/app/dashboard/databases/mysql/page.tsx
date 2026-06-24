"use client";

import { useState } from "react";
import { 
  Database, Plus, Copy, Trash2, RefreshCw, X, CheckCircle2, 
  Eye, EyeOff, Loader2, Server, Clock, Activity, HardDrive,
  Lock, Zap, Settings, BarChart3, AlertCircle, Info, ChevronRight
} from "lucide-react";

interface MySQLDatabase {
  id: string;
  name: string;
  host: string;
  port: number;
  status: "active" | "pending" | "failed" | "deleting";
  created_at: string;
  username: string;
  connection_string: string;
  version: string;
}

export default function MySQLPage() {
  const [databases, setDatabases] = useState<MySQLDatabase[]>([
    {
      id: "mysql_1",
      name: "production_db",
      host: "mysql-prod.zencloud.io",
      port: 3306,
      status: "active",
      created_at: "2024-06-01T10:00:00Z",
      username: "prod_user",
      connection_string: "mysql://prod_user:********@mysql-prod.zencloud.io:3306/production_db",
      version: "8.0"
    },
    {
      id: "mysql_2",
      name: "staging_db",
      host: "mysql-staging.zencloud.io",
      port: 3306,
      status: "active",
      created_at: "2024-06-10T14:30:00Z",
      username: "staging_user",
      connection_string: "mysql://staging_user:********@mysql-staging.zencloud.io:3306/staging_db",
      version: "8.0"
    },
    {
      id: "mysql_3",
      name: "dev_db",
      host: "mysql-dev.zencloud.io",
      port: 3306,
      status: "pending",
      created_at: "2024-06-20T09:15:00Z",
      username: "dev_user",
      connection_string: "mysql://dev_user:********@mysql-dev.zencloud.io:3306/dev_db",
      version: "8.0"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<MySQLDatabase | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [customName, setCustomName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "connection" | "settings">("overview");

  const createDatabase = () => {
    setCreateLoading(true);
    setTimeout(() => {
      const newDb: MySQLDatabase = {
        id: `mysql_${databases.length + 1}`,
        name: customName || `mysql_db_${databases.length + 1}`,
        host: "mysql-new.zencloud.io",
        port: 3306,
        status: "pending",
        created_at: new Date().toISOString(),
        username: `user_${databases.length + 1}`,
        connection_string: `mysql://user_${databases.length + 1}:********@mysql-new.zencloud.io:3306/${customName || `mysql_db_${databases.length + 1}`}`,
        version: "8.0"
      };
      setDatabases([...databases, newDb]);
      setSuccess("MySQL database created successfully!");
      setShowCreateModal(false);
      setCustomName("");
      setCreateLoading(false);
    }, 2000);
  };

  const deleteDatabase = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete database "${name}"? This action cannot be undone.`)) {
      return;
    }
    setDatabases(databases.filter(db => db.id !== id));
    setSuccess("Database deleted successfully");
    setShowDetailModal(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Copied to clipboard!");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">MySQL Databases</h1>
            <p className="text-sm text-gray-400">Manage your managed MySQL database instances</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            Create Database
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Error</p>
              <p className="text-xs text-red-400/80 mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Success</p>
              <p className="text-xs text-green-400/80 mt-0.5">{success}</p>
            </div>
            <button onClick={() => setSuccess("")} className="text-green-400 hover:text-green-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Overview */}
        {databases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Databases</p>
                  <p className="text-xl font-bold text-white">{databases.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Active</p>
                  <p className="text-xl font-bold text-white">
                    {databases.filter(db => db.status === "active").length}
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
                  <p className="text-xs text-gray-400">Pending</p>
                  <p className="text-xl font-bold text-white">
                    {databases.filter(db => db.status === "pending").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">MySQL</p>
                  <p className="text-xl font-bold text-white">v8.0</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Database List */}
        {loading ? (
          <div className="bg-[#111116] border border-white/6 rounded-xl p-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading databases...</p>
            </div>
          </div>
        ) : databases.length === 0 ? (
          <div className="bg-[#111116] border border-white/6 rounded-xl p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No databases yet</h3>
              <p className="text-sm text-gray-400 mb-6">Get started by creating your first MySQL database instance.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg font-medium transition"
              >
                Create Database
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {databases.map((db) => (
              <div
                key={db.id}
                onClick={() => {
                  setSelectedDatabase(db);
                  setShowDetailModal(true);
                }}
                className="bg-[#111116] border border-white/6 rounded-xl p-5 hover:border-[#FF6B35]/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`px-2 py-1 rounded-md text-[10px] font-semibold ${
                      db.status === "active"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : db.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        : db.status === "failed"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                    }`}
                  >
                    {db.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white mb-3 truncate group-hover:text-[#FF6B35] transition">
                  {db.name}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Server className="w-3.5 h-3.5" />
                    <span className="truncate">{db.host}:{db.port}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Created {new Date(db.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-gray-500">MySQL 8.0</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#FF6B35] transition" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Database Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Create MySQL Database</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCustomName("");
                    setError("");
                  }}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-400 mb-6">
                Create a new isolated MySQL 8.0 database instance with dedicated credentials.
              </p>

              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Database Name (Optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., myapp_production"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50 text-sm"
                  pattern="[a-z0-9_]+"
                  maxLength={20}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Only lowercase letters, numbers, and underscores. Auto-generated if empty.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-orange-400 mb-3 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  What's included:
                </h4>
                <ul className="text-xs text-gray-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <Database className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                    Isolated MySQL 8.0 instance
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                    Dedicated database user with full privileges
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                    Secure connection string (SSL enabled)
                  </li>
                  <li className="flex items-start gap-2">
                    <Activity className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                    Automatic backups and monitoring
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCustomName("");
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={createDatabase}
                  disabled={createLoading}
                  className="flex-1 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Database
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Database Detail Modal */}
        {showDetailModal && selectedDatabase && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl max-w-3xl w-full my-8">
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedDatabase.name}</h2>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold mt-1 ${
                        selectedDatabase.status === "active"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : selectedDatabase.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {selectedDatabase.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 px-6 border-b border-white/5">
                {[
                  { id: "overview", label: "Overview", icon: Info },
                  { id: "connection", label: "Connection", icon: Server },
                  { id: "settings", label: "Settings", icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition relative ${
                        activeTab === tab.id
                          ? "text-[#FF6B35]"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">MySQL Version</p>
                        <p className="text-sm font-semibold text-white">8.0.x</p>
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <p className="text-sm font-semibold text-white capitalize">{selectedDatabase.status}</p>
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Created</p>
                        <p className="text-sm font-semibold text-white">
                          {new Date(selectedDatabase.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Storage Engine</p>
                        <p className="text-sm font-semibold text-white">InnoDB</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-orange-400" />
                        Database Information
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Database Name:</span>
                          <span className="text-white font-mono">{selectedDatabase.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Username:</span>
                          <span className="text-white font-mono">{selectedDatabase.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Host:</span>
                          <span className="text-white font-mono">{selectedDatabase.host}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Port:</span>
                          <span className="text-white font-mono">{selectedDatabase.port}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Character Set:</span>
                          <span className="text-white font-mono">utf8mb4</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Collation:</span>
                          <span className="text-white font-mono">utf8mb4_unicode_ci</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Connection Tab */}
                {activeTab === "connection" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Connection String
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={selectedDatabase.connection_string}
                            readOnly
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-xs pr-10"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <button
                          onClick={() => copyToClipboard(selectedDatabase.connection_string)}
                          className="px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg transition flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-white mb-3">Connection Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-gray-500 mb-1">Host</p>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-mono flex-1">{selectedDatabase.host}</p>
                            <button
                              onClick={() => copyToClipboard(selectedDatabase.host)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Port</p>
                          <p className="text-white font-mono">{selectedDatabase.port}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Database</p>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-mono flex-1 truncate">{selectedDatabase.name}</p>
                            <button
                              onClick={() => copyToClipboard(selectedDatabase.name)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Username</p>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-mono flex-1 truncate">{selectedDatabase.username}</p>
                            <button
                              onClick={() => copyToClipboard(selectedDatabase.username)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Connect with MySQL CLI
                      </label>
                      <div className="bg-[#0B0B0F] border border-white/10 rounded-lg p-4">
                        <code className="text-xs text-gray-300 font-mono break-all">
                          mysql -h {selectedDatabase.host} -P {selectedDatabase.port} -u {selectedDatabase.username} -p {selectedDatabase.name}
                        </code>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Connect with Node.js (mysql2)
                      </label>
                      <div className="bg-[#0B0B0F] border border-white/10 rounded-lg p-4">
                        <code className="text-xs text-gray-300 font-mono block">
                          const mysql = require('mysql2');<br/>
                          const connection = mysql.createConnection(&#123;<br/>
                          &nbsp;&nbsp;host: '{selectedDatabase.host}',<br/>
                          &nbsp;&nbsp;port: {selectedDatabase.port},<br/>
                          &nbsp;&nbsp;user: '{selectedDatabase.username}',<br/>
                          &nbsp;&nbsp;password: 'your_password',<br/>
                          &nbsp;&nbsp;database: '{selectedDatabase.name}'<br/>
                          &#125;);
                        </code>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Connect with Python (mysql-connector)
                      </label>
                      <div className="bg-[#0B0B0F] border border-white/10 rounded-lg p-4">
                        <code className="text-xs text-gray-300 font-mono block">
                          import mysql.connector<br/>
                          <br/>
                          conn = mysql.connector.connect(<br/>
                          &nbsp;&nbsp;host='{selectedDatabase.host}',<br/>
                          &nbsp;&nbsp;port={selectedDatabase.port},<br/>
                          &nbsp;&nbsp;user='{selectedDatabase.username}',<br/>
                          &nbsp;&nbsp;password='your_password',<br/>
                          &nbsp;&nbsp;database='{selectedDatabase.name}'<br/>
                          )
                        </code>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-white mb-3">Database Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            setSuccess("Database refreshed successfully");
                          }}
                          className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition group"
                        >
                          <div className="flex items-center gap-3">
                            <RefreshCw className="w-4 h-4 text-orange-400" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-white">Refresh Status</p>
                              <p className="text-xs text-gray-400">Update database information</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
                        </button>

                        <button
                          onClick={() => {
                            setSuccess("Password reset successfully!");
                          }}
                          className="w-full flex items-center justify-between p-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-lg transition group"
                        >
                          <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-yellow-400" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-yellow-400">Reset Password</p>
                              <p className="text-xs text-yellow-400/70">Generate a new database password</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Danger Zone
                      </h3>
                      <p className="text-xs text-gray-400 mb-4">
                        Permanently delete this database. This action cannot be undone and all data will be lost.
                      </p>
                      <button
                        onClick={() => deleteDatabase(selectedDatabase.id, selectedDatabase.name)}
                        className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg font-medium transition text-sm"
                      >
                        Delete Database
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
