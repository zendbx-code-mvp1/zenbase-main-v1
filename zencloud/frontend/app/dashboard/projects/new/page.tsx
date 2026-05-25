"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Github, GitBranch, Loader2, Rocket, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const project = await api.createProject({ name, repository_url: repositoryUrl, branch });
      setCreated(project);
      // Redirect to the project detail page so the user sees the live deployment status
      setTimeout(() => router.push(`/dashboard/projects/${project.id}`), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[#0B0B0F]">
      {/* Top Bar */}
      <div className="border-b border-white/5 bg-[#0d0d12]">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-1">New Project</h1>
          <p className="text-sm text-gray-400">
            Connect a Git repository and deploy instantly.
          </p>
        </div>

        {/* Success state */}
        {created && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 flex items-center gap-4 mb-6">
            <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Project created!</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Deployment triggered — redirecting to project page…
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Repository */}
          <div className="bg-[#111116] border border-white/6 rounded-xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-white">Repository</h2>

            {/* GitHub connect (UI only for now) */}
            <button
              type="button"
              className="w-full bg-white/5 hover:bg-white/8 border border-white/8 text-white px-4 py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm"
            >
              <Github className="w-4 h-4" />
              Connect GitHub Account
            </button>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex-1 h-px bg-white/5" />
              or enter a public URL
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Repository URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                required
                className="w-full bg-[#1a1a20] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6B35]/60 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Branch <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="main"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                  className="w-full bg-[#1a1a20] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6B35]/60 transition"
                />
              </div>
            </div>
          </div>

          {/* Project details */}
          <div className="bg-[#111116] border border-white/6 rounded-xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-white">Project Details</h2>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="my-awesome-project"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#1a1a20] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6B35]/60 transition"
              />
              <p className="text-[10px] text-gray-600 mt-1">
                Used as your subdomain: <span className="text-gray-400">{name ? name.toLowerCase().replace(/[^a-z0-9-]/g, "-") : "your-name"}.zencloud.dev</span>
              </p>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-[#FF6B35]/5 border border-[#FF6B35]/15 rounded-xl p-4">
            <p className="text-xs font-semibold text-[#FF6B35] mb-2 flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5" />
              What happens next
            </p>
            <ul className="space-y-1 text-xs text-gray-400">
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#FF6B35]" />Project is created and a deployment is triggered immediately</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#FF6B35]" />You'll be taken to the project page to watch the live status</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#FF6B35]" />The dashboard will reflect the new project and deployment</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/dashboard/projects" className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !!created}
              className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating & deploying…" : created ? "Redirecting…" : "Create & Deploy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
