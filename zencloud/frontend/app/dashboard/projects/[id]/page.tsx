"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, GitBranch, Clock, Circle, Play, Pause, RotateCw, Trash2, Settings } from "lucide-react";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = {
    id: params.id,
    name: "my-portfolio",
    url: "my-portfolio.zencloud.dev",
    framework: "Next.js",
    status: "active",
    branch: "main",
    commit: "a3f2c1d",
    lastDeploy: "2 hours ago"
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top Bar */}
      <div className="border-b border-[#1E1E1E] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Projects
              </Link>
              <span className="text-gray-600">/</span>
              <h1 className="text-lg font-medium text-white">{project.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white px-3 py-2 rounded-lg text-sm transition flex items-center gap-2">
                <Play className="w-4 h-4" />
                Deploy
              </button>
              <button className="bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white px-3 py-2 rounded-lg text-sm transition">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Project Info */}
        <div className="bg-[#121212] border border-[#1E1E1E] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Circle className="w-2.5 h-2.5 fill-current text-green-500" />
              <span className="text-sm font-medium text-green-500 capitalize">{project.status}</span>
            </div>
            <a
              href={`https://${project.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6B35] hover:text-[#FF5722] transition flex items-center gap-1 text-sm"
            >
              {project.url}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Framework</div>
              <div className="text-white font-medium">{project.framework}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Branch</div>
              <div className="text-white font-medium flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                {project.branch}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Last Deploy</div>
              <div className="text-white font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {project.lastDeploy}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#1E1E1E] mb-6">
          <div className="flex gap-6">
            <button className="pb-3 border-b-2 border-[#FF6B35] text-white text-sm font-medium">
              Deployments
            </button>
            <button className="pb-3 border-b-2 border-transparent text-gray-400 hover:text-white text-sm font-medium transition">
              Logs
            </button>
            <button className="pb-3 border-b-2 border-transparent text-gray-400 hover:text-white text-sm font-medium transition">
              Settings
            </button>
          </div>
        </div>

        {/* Deployments List */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#121212] border border-[#1E1E1E] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Circle className="w-2 h-2 fill-current text-green-500" />
                  <div>
                    <div className="text-white text-sm font-medium mb-1">
                      Deployment #{i}
                    </div>
                    <div className="text-gray-500 text-xs">
                      Commit: a3f2c1d • {i} hours ago
                    </div>
                  </div>
                </div>
                <div className="text-sm text-green-500">Success</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
