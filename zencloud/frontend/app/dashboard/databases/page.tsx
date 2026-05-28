"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

interface Database {
  id: string;
  database_name: string;
  host: string;
  port: number;
  status: string;
  created_at: string;
}

interface DatabaseDetail extends Database {
  database_user: string;
  connection_string: string;
  user_id: string;
  updated_at: string;
}

export default function DatabasesPage() {
  const { user } = useAuth();
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseDetail | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [customName, setCustomName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const fetchDatabases = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/databases", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDatabases(data);
      } else if (response.status === 401) {
        setError("Authentication failed. Please login again.");
      } else {
        const errorData = await response.json();
        // Handle Pydantic validation errors
        if (Array.isArray(errorData.detail)) {
          const errorMessages = errorData.detail.map((err: any) => 
            `${err.loc?.join('.') || 'Field'}: ${err.msg}`
          ).join(', ');
          setError(errorMessages);
        } else if (typeof errorData.detail === 'string') {
          setError(errorData.detail);
        } else {
          setError("Failed to fetch databases");
        }
      }
    } catch (err) {
      console.error("Failed to fetch databases:", err);
      setError("Failed to connect to server. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabases();
  }, []);

  // Show loading or auth error
  if (!user) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">Please login to access databases.</p>
          </div>
        </div>
      </div>
    );
  }

  const createDatabase = async () => {
    const token = getToken();
    if (!token) {
      setError("Authentication required. Please login again.");
      return;
    }

    setCreateLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8000/databases", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: customName || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Database created successfully! Provisioning in progress...");
        setShowCreateModal(false);
        setCustomName("");
        fetchDatabases();
      } else {
        const errorData = await response.json();
        // Handle Pydantic validation errors (array of error objects)
        if (Array.isArray(errorData.detail)) {
          const errorMessages = errorData.detail.map((err: any) => 
            `${err.loc?.join('.') || 'Field'}: ${err.msg}`
          ).join(', ');
          setError(errorMessages);
        } else if (typeof errorData.detail === 'string') {
          setError(errorData.detail);
        } else if (typeof errorData.detail === 'object') {
          setError(JSON.stringify(errorData.detail));
        } else {
          setError("Failed to create database");
        }
      }
    } catch (err) {
      setError("Failed to create database");
    } finally {
      setCreateLoading(false);
    }
  };

  const viewDatabaseDetails = async (databaseId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/databases/${databaseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedDatabase(data);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error("Failed to fetch database details:", err);
    }
  };

  const deleteDatabase = async (databaseId: string, databaseName: string) => {
    if (!confirm(`Are you sure you want to delete database "${databaseName}"? This action cannot be undone.`)) {
      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/databases/${databaseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Database deleted successfully");
        fetchDatabases();
        setShowDetailModal(false);
      } else {
        const errorData = await response.json();
        // Handle Pydantic validation errors
        if (Array.isArray(errorData.detail)) {
          const errorMessages = errorData.detail.map((err: any) => 
            `${err.loc?.join('.') || 'Field'}: ${err.msg}`
          ).join(', ');
          setError(errorMessages);
        } else if (typeof errorData.detail === 'string') {
          setError(errorData.detail);
        } else {
          setError("Failed to delete database");
        }
      }
    } catch (err) {
      setError("Failed to delete database");
    }
  };

  const resetPassword = async (databaseId: string) => {
    if (!confirm("Are you sure you want to reset the database password?")) {
      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/databases/${databaseId}/reset-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Password reset successfully!");
        viewDatabaseDetails(databaseId);
      } else {
        const errorData = await response.json();
        // Handle Pydantic validation errors
        if (Array.isArray(errorData.detail)) {
          const errorMessages = errorData.detail.map((err: any) => 
            `${err.loc?.join('.') || 'Field'}: ${err.msg}`
          ).join(', ');
          setError(errorMessages);
        } else if (typeof errorData.detail === 'string') {
          setError(errorData.detail);
        } else {
          setError("Failed to reset password");
        }
      }
    } catch (err) {
      setError("Failed to reset password");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Copied to clipboard!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      case "deleting":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-8 bg-[#0B0B0F] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Databases</h1>
            <p className="text-gray-400 mt-2">Manage your PostgreSQL databases</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#FF6B35] hover:bg-[#ff5722] text-white px-6 py-2 rounded-lg font-medium transition"
          >
            + Create Database
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-400">
            {success}
          </div>
        )}

        {/* Database List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]"></div>
            <p className="mt-4 text-gray-400">Loading databases...</p>
          </div>
        ) : databases.length === 0 ? (
          <div className="bg-[#0d0d12] border border-white/10 rounded-lg p-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-white">No databases yet</h3>
              <p className="mt-2 text-gray-400">Get started by creating your first PostgreSQL database.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-6 bg-[#FF6B35] hover:bg-[#ff5722] text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Create Database
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {databases.map((db) => (
              <div
                key={db.id}
                onClick={() => viewDatabaseDetails(db.id)}
                className="bg-[#0d0d12] border border-white/10 rounded-lg p-6 hover:border-[#FF6B35]/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-[#FF6B35]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                        />
                      </svg>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      db.status
                    )}`}
                  >
                    {db.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-[#FF6B35] transition">
                  {db.database_name}
                </h3>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                      />
                    </svg>
                    {db.host}:{db.port}
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(db.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Database Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#0d0d12] border border-white/10 rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-4">Create New Database</h2>
              <p className="text-gray-400 mb-6">
                Create a new PostgreSQL database with isolated credentials.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Name (Optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., myapp"
                  className="w-full px-4 py-2 bg-[#0B0B0F] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  pattern="[a-z0-9_]+"
                  maxLength={20}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Only lowercase letters, numbers, and underscores. Leave empty for auto-generated name.
                </p>
              </div>

              <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-[#FF6B35] mb-2">What you'll get:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Isolated PostgreSQL database</li>
                  <li>✓ Dedicated database user</li>
                  <li>✓ Secure connection string</li>
                  <li>✓ Full administrative access</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={createDatabase}
                  disabled={createLoading}
                  className="flex-1 bg-[#FF6B35] hover:bg-[#ff5722] text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createLoading ? "Creating..." : "Create Database"}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCustomName("");
                    setError("");
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Database Detail Modal */}
        {showDetailModal && selectedDatabase && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-[#0d0d12] border border-white/10 rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedDatabase.database_name}</h2>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedDatabase.status
                    )}`}
                  >
                    {selectedDatabase.status}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Connection String */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Connection String
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedDatabase.connection_string}
                      readOnly
                      className="flex-1 px-4 py-2 bg-[#0B0B0F] border border-white/10 rounded-lg text-white font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedDatabase.connection_string)}
                      className="bg-[#FF6B35] hover:bg-[#ff5722] text-white px-6 py-2 rounded-lg font-medium transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Database Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Host</label>
                    <p className="text-white">{selectedDatabase.host}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Port</label>
                    <p className="text-white">{selectedDatabase.port}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Database Name
                    </label>
                    <p className="text-white font-mono text-sm break-all">{selectedDatabase.database_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                    <p className="text-white font-mono text-sm break-all">{selectedDatabase.database_user}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Created</label>
                    <p className="text-white">
                      {new Date(selectedDatabase.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Updated</label>
                    <p className="text-white">
                      {new Date(selectedDatabase.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Connection Example */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Connect with psql
                  </label>
                  <div className="bg-[#0B0B0F] border border-white/10 text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <code className="break-all">psql "{selectedDatabase.connection_string}"</code>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => resetPassword(selectedDatabase.id)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() =>
                      deleteDatabase(selectedDatabase.id, selectedDatabase.database_name)
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Delete Database
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
