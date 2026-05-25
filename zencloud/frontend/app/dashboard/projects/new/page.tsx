"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Github, GitBranch, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Creating project with:", { name, repositoryUrl, branch });

    try {
      const result = await api.createProject({
        name,
        repository_url: repositoryUrl,
        branch,
      });
      console.log("Project created successfully:", result);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Failed to create project:", err);
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top Bar */}
      <div className="border-b border-[#1E1E1E] bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">Create New Project</h1>
          <p className="text-gray-400">Deploy your application from a Git repository</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Connect GitHub */}
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Connect Repository</h2>
            <button
              type="button"
              className="w-full bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white px-4 py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Github className="w-5 h-5" />
              Connect GitHub Account
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Or enter a public repository URL below
            </p>
          </div>

          {/* Project Details */}
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  placeholder="my-awesome-project"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Repository URL *
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  required
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: https://github.com/vercel/next.js
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Branch *
                </label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="main"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                    className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-gray-400 hover:text-white transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#FF6B35] hover:bg-[#FF5722] text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
