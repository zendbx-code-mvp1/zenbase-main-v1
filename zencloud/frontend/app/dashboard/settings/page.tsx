"use client";

import { User, Key, Bell, CreditCard, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<Array<{ id: string; key: string; name: string; created: string; visible: boolean }>>([]);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState("");

  const generateApiKey = () => {
    const key = `zc_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const newKey = {
      id: Date.now().toString(),
      key,
      name: `API Key ${apiKeys.length + 1}`,
      created: new Date().toISOString(),
      visible: true
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyValue(key);
    setShowNewKey(true);
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const toggleKeyVisibility = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, visible: !k.visible } : k));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + "..." + key.substring(key.length - 4);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top Bar */}
      <div className="border-b border-[#1E1E1E] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold text-white">Settings</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-[#FF6B35]" />
              <h2 className="text-lg font-medium text-white">Profile</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  value={user?.username || ""}
                  readOnly
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5 text-[#FF6B35]" />
              <h2 className="text-lg font-medium text-white">API Keys</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">Manage your API keys for programmatic access</p>
            
            {showNewKey && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm font-medium mb-2">New API Key Generated</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-[#1E1E1E] px-3 py-2 rounded text-sm text-white font-mono">
                    {newKeyValue}
                  </code>
                  <button
                    onClick={() => copyToClipboard(newKeyValue)}
                    className="p-2 hover:bg-white/5 rounded transition"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Make sure to copy this key now. You won't be able to see it again!</p>
              </div>
            )}

            {apiKeys.length > 0 && (
              <div className="mb-4 space-y-2">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center gap-3 p-3 bg-[#1E1E1E] rounded-lg">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{apiKey.name}</p>
                      <code className="text-xs text-gray-400 font-mono">
                        {apiKey.visible ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                    </div>
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-2 hover:bg-white/5 rounded transition"
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
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => deleteApiKey(apiKey.id)}
                      className="p-2 hover:bg-red-500/10 rounded transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={generateApiKey}
              className="bg-[#FF6B35] hover:bg-[#FF5722] text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Generate New Key
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-[#FF6B35]" />
              <h2 className="text-lg font-medium text-white">Notifications</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-gray-300">Email notifications for deployments</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-gray-300">Email notifications for failures</span>
              </label>
            </div>
          </div>

          {/* Billing */}
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-[#FF6B35]" />
              <h2 className="text-lg font-medium text-white">Billing</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium mb-1">Free Plan</div>
                <div className="text-sm text-gray-400">2 projects included</div>
              </div>
              <button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
