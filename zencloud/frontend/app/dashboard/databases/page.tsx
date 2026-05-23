"use client";

import Link from "next/link";
import { Plus, Database } from "lucide-react";

export default function DatabasesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top Bar */}
      <div className="border-b border-[#1E1E1E] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">Databases</h1>
            <button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Database
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-[#1E1E1E] rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No databases yet</h3>
          <p className="text-gray-500 mb-6">Create your first database to get started</p>
          <button className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF5722] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            <Plus className="w-4 h-4" />
            New Database
          </button>
        </div>
      </div>
    </div>
  );
}
