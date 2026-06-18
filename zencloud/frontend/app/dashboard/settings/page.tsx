"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Key, Bell, CreditCard, Shield, Link2, Palette,
  Globe, Code, Lock, Smartphone, Mail, Camera, Save,
  Copy, Trash2, Eye, EyeOff, Plus, Check, X, AlertTriangle,
  Github, Gitlab, RefreshCw, Download, LogOut, Settings as SettingsIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    company: "",
    location: "",
    bio: "",
    website: "",
    avatar: ""
  });

  // API Keys state
  const [apiKeys, setApiKeys] = useState<Array<{
    id: string;
    key: string;
    name: string;
    created: string;
    lastUsed: string;
    visible: boolean;
  }>>([
    {
      id: "1",
      key: "zc_live_4f3d8b2a9e1c6h7j5k9m8n2p4q6r",
      name: "Production API Key",
      created: "2024-01-15",
      lastUsed: "2 hours ago",
      visible: false
    }
  ]);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyName, setNewKeyName] = useState("");

  // Notifications state
  const [notifications, setNotifications] = useState({
    deploymentSuccess: true,
    deploymentFailed: true,
    buildStarted: false,
    domainUpdated: true,
    securityAlert: true,
    weeklyReport: true,
    monthlyInvoice: true,
    promotionalEmails: false
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    defaultRegion: "us-east-1"
  });

  // Security state
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    smsAuth: false,
    lastPasswordChange: "30 days ago"
  });

  // Connected accounts
  const [connectedAccounts, setConnectedAccounts] = useState([
    { provider: "GitHub", connected: true, username: "johndoe", icon: Github },
    { provider: "GitLab", connected: false, username: "", icon: Gitlab }
  ]);

  const generateApiKey = () => {
    if (!newKeyName.trim()) {
      alert("Please enter a name for the API key");
      return;
    }
    const key = `zc_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const newKey = {
      id: Date.now().toString(),
      key,
      name: newKeyName,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      visible: true
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyValue(key);
    setShowNewKey(true);
    setNewKeyName("");
  };

  const deleteApiKey = (id: string) => {
    if (confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      setApiKeys(apiKeys.filter(k => k.id !== id));
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, visible: !k.visible } : k));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + "•".repeat(12) + key.substring(key.length - 4);
  };

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "api-keys", label: "API Keys", icon: Key },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "connected", label: "Connected Accounts", icon: Link2 }
  ];

  return (
    <div className="p-5 space-y-4 bg-[#0B0B0F] min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your account settings and preferences</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          Settings saved successfully
        </div>
      )}

      {/* Tabs + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-[#111116] border border-white/6 rounded-xl p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                  activeTab === tab.id
                    ? "bg-[#FF6B35] text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-4">

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-[#111116] border border-white/6 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Profile Settings</h2>
                <button
                  onClick={saveSettings}
                  className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-3 py-2 rounded-lg text-xs font-semibold transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFA500] flex items-center justify-center text-white text-2xl font-bold">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs">
                    <Camera className="w-3.5 h-3.5" />
                    Change Avatar
                  </button>
                  <p className="text-[10px] text-gray-500 mt-1">JPG, PNG or GIF (Max 2MB)</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Company</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-2">Website</label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-2">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-4">
              {/* Password */}
              <div className="bg-[#111116] border border-white/6 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-white">Password</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Last changed {security.lastPasswordChange}</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs">
                    <Lock className="w-3.5 h-3.5" />
                    Change Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-[#111116] border border-white/6 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-[#FF6B35]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Two-Factor Authentication</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {security.twoFactorEnabled ? "Enabled" : "Add an extra layer of security"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled })}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      security.twoFactorEnabled
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-[#FF6B35] hover:bg-[#e85d2a] text-white"
                    }`}
                  >
                    {security.twoFactorEnabled ? "Enabled" : "Enable"}
                  </button>
                </div>
                {security.twoFactorEnabled && (
                  <div className="pt-3 border-t border-white/5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.smsAuth}
                        onChange={(e) => setSecurity({ ...security, smsAuth: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 text-[#FF6B35]"
                      />
                      <div>
                        <span className="text-xs text-white">SMS Authentication</span>
                        <p className="text-[10px] text-gray-500">Receive codes via SMS</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Sessions */}
              <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-white">Active Sessions</h2>
                  <span className="text-[10px] text-gray-500">2 active</span>
                </div>
                <div className="space-y-3">
                  {[
                    { device: "Chrome on Windows", location: "San Francisco, US", current: true, lastActive: "Now" },
                    { device: "Safari on iPhone", location: "San Francisco, US", current: false, lastActive: "2 hours ago" }
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#0B0B0F] border border-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white font-medium">{session.device}</span>
                            {session.current && (
                              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded">Current</span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500">{session.location} • {session.lastActive}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <button className="text-xs text-red-400 hover:text-red-300 transition">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === "api-keys" && (
            <div className="bg-[#111116] border border-white/6 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">API Keys</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage your API keys for programmatic access</p>
                </div>
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] rounded">{apiKeys.length} keys</span>
              </div>

              {showNewKey && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 text-xs font-medium">New API Key Generated</p>
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
                      Make sure to copy this key now. You won't be able to see it again!
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
              <div className="p-4 bg-[#0B0B0F] border border-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Enter key name (e.g., Production API)"
                    className="flex-1 bg-[#111116] border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                  />
                  <button
                    onClick={generateApiKey}
                    className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-3 py-2 rounded-lg text-xs font-semibold transition shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Generate Key
                  </button>
                </div>
              </div>

              {/* API Keys List */}
              <div className="space-y-3">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="p-4 bg-[#0B0B0F] border border-white/5 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-white">{apiKey.name}</h3>
                          <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] rounded">Live</span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          Created {apiKey.created} • Last used {apiKey.lastUsed}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="p-2 hover:bg-red-500/10 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-[#111116] px-3 py-2 rounded text-xs text-gray-400 font-mono">
                        {apiKey.visible ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-2 hover:bg-white/5 rounded transition"
                        title={apiKey.visible ? "Hide" : "Show"}
                      >
                        {apiKey.visible ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="p-2 hover:bg-white/5 rounded transition"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-[#111116] border border-white/6 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Notification Preferences</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage how you receive notifications</p>
                </div>
                <button
                  onClick={saveSettings}
                  className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-3 py-2 rounded-lg text-xs font-semibold transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>

              {/* Deployment Notifications */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#FF6B35]" />
                  Deployments
                </h3>
                <div className="space-y-3 pl-6">
                  {[
                    { key: "deploymentSuccess", label: "Successful deployments", desc: "Get notified when deployments succeed" },
                    { key: "deploymentFailed", label: "Failed deployments", desc: "Get notified when deployments fail" },
                    { key: "buildStarted", label: "Build started", desc: "Get notified when builds begin" }
                  ].map((item) => (
                    <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded border-white/10 text-[#FF6B35]"
                      />
                      <div className="flex-1">
                        <span className="text-xs text-white group-hover:text-[#FF6B35] transition">{item.label}</span>
                        <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Security Notifications */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#FF6B35]" />
                  Security
                </h3>
                <div className="space-y-3 pl-6">
                  {[
                    { key: "securityAlert", label: "Security alerts", desc: "Important security updates and warnings" },
                    { key: "domainUpdated", label: "Domain changes", desc: "Get notified about domain and SSL updates" }
                  ].map((item) => (
                    <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded border-white/10 text-[#FF6B35]"
                      />
                      <div className="flex-1">
                        <span className="text-xs text-white group-hover:text-[#FF6B35] transition">{item.label}</span>
                        <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Billing Notifications */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#FF6B35]" />
                  Billing & Reports
                </h3>
                <div className="space-y-3 pl-6">
                  {[
                    { key: "monthlyInvoice", label: "Monthly invoices", desc: "Receive invoices and payment receipts" },
                    { key: "weeklyReport", label: "Weekly reports", desc: "Summary of your account activity" },
                    { key: "promotionalEmails", label: "Product updates", desc: "New features and promotional emails" }
                  ].map((item) => (
                    <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded border-white/10 text-[#FF6B35]"
                      />
                      <div className="flex-1">
                        <span className="text-xs text-white group-hover:text-[#FF6B35] transition">{item.label}</span>
                        <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="bg-[#111116] border border-white/6 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Preferences</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Customize your experience</p>
                </div>
                <button
                  onClick={saveSettings}
                  className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-3 py-2 rounded-lg text-xs font-semibold transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Theme */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Theme</label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                    className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Timezone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Date Format</label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                    className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                {/* Default Region */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-2">Default Deployment Region</label>
                  <select
                    value={preferences.defaultRegion}
                    onChange={(e) => setPreferences({ ...preferences, defaultRegion: e.target.value })}
                    className="w-full bg-[#0B0B0F] border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF6B35] transition"
                  >
                    <option value="us-east-1">US East (N. Virginia)</option>
                    <option value="us-west-2">US West (Oregon)</option>
                    <option value="eu-west-1">EU West (Ireland)</option>
                    <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Connected Accounts Tab */}
          {activeTab === "connected" && (
            <div className="bg-[#111116] border border-white/6 rounded-xl p-5 space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-white">Connected Accounts</h2>
                <p className="text-xs text-gray-500 mt-0.5">Link your external accounts for seamless integration</p>
              </div>

              <div className="space-y-3">
                {connectedAccounts.map((account) => (
                  <div key={account.provider} className="flex items-center justify-between p-4 bg-[#0B0B0F] border border-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <account.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{account.provider}</span>
                          {account.connected && (
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Connected
                            </span>
                          )}
                        </div>
                        {account.connected ? (
                          <p className="text-xs text-gray-500">@{account.username}</p>
                        ) : (
                          <p className="text-xs text-gray-500">Not connected</p>
                        )}
                      </div>
                    </div>
                    <button
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                        account.connected
                          ? "border border-white/8 text-gray-400 hover:text-white hover:bg-white/5"
                          : "bg-[#FF6B35] hover:bg-[#e85d2a] text-white"
                      }`}
                    >
                      {account.connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Danger Zone */}
              <div className="pt-5 border-t border-red-500/20">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Danger Zone
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">Irreversible actions</p>
                  </div>
                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-medium text-white">Delete Account</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Permanently delete your account and all data</p>
                    </div>
                    <button className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
