"use client";

import { User, Key, Bell, CreditCard } from "lucide-react";

export default function SettingsPage() {
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="john@example.com"
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
            <button className="bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white px-4 py-2 rounded-lg text-sm transition">
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
