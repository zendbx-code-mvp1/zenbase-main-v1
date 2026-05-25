"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Activity, CheckCircle2, XCircle, Loader2, Zap,
  Server, Play, Square, RotateCw, ArrowUpRight,
  GitBranch, Clock, AlertTriangle, RefreshCw,
  Package, Globe, Circle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

/* ── Horizontal progress bar ── */
function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(pct, 100)}%`, background: color }}
      />
    </div>
  );
}

/* ── Donut ring ── */
function DonutRing({ segments }: { segments: { value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 28, cx = 36, cy = 36, stroke = 8;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      {total === 0 ? (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f1f1f" strokeWidth={stroke} />
      ) : (
        segments.map((seg, i) => {
          const dash = (seg.value / total) * circ;
          const el = (
            <circle
              key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
            />
          );
          offset += dash;
          return el;
        })
      )}
    </svg>
  );
}

/* ── helpers ── */
function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function statusDot(status: string) {
  const map: Record<string, string> = {
    running: "bg-green-400", stopped: "bg-gray-500",
    deploying: "bg-blue-400", failed: "bg-red-400",
    pending: "bg-yellow-400", success: "bg-green-400",
  };
  return map[status] ?? "bg-gray-500";
}

function statusText(status: string) {
  const map: Record<string, string> = {
    running: "text-green-400", stopped: "text-gray-400",
    deploying: "text-blue-400", failed: "text-red-400",
    pending: "text-yellow-400", success: "text-green-400",
  };
  return map[status] ?? "text-gray-400";
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState<any[]>([]);
  const [recentDeploys, setRecentDeploys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) loadAll();
  }, [user, authLoading]);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [projs, deploys] = await Promise.all([
        api.getProjects(),
        api.getRecentDeployments(20).catch(() => []),
      ]);
      setProjects(projs);
      setRecentDeploys(deploys);
      setLastRefresh(new Date());
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAction = async (id: string, action: string) => {
    try {
      if (action === "start") await api.startProject(id);
      else if (action === "stop") await api.stopProject(id);
      else if (action === "restart") await api.restartProject(id);
      else if (action === "deploy") await api.deployProject(id);
      loadAll();
    } catch (e: any) {
      setError(e.message || `Failed to ${action}`);
    }
  };

  /* ── derived stats from real data ── */
  const stats = {
    total: projects.length,
    running: projects.filter(p => p.status === "running").length,
    stopped: projects.filter(p => p.status === "stopped").length,
    failed: projects.filter(p => p.status === "failed").length,
    deploying: projects.filter(p => p.status === "deploying" || p.status === "pending").length,
  };

  const deployStats = {
    total: recentDeploys.length,
    success: recentDeploys.filter(d => d.status === "success").length,
    failed: recentDeploys.filter(d => d.status === "failed").length,
    building: recentDeploys.filter(d => d.status === "deploying" || d.status === "pending").length,
  };

  const successRate = deployStats.total > 0
    ? Math.round((deployStats.success / deployStats.total) * 100)
    : 0;

  const donutSegments = [
    { value: stats.running, color: "#22c55e" },
    { value: stats.stopped, color: "#6b7280" },
    { value: stats.failed, color: "#ef4444" },
    { value: stats.deploying, color: "#3b82f6" },
  ];

  /* ── build a deploy frequency map (last 14 days) from real data ── */
  const deployFreq: Record<string, { success: number; failed: number }> = {};
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    deployFreq[d.toISOString().slice(0, 10)] = { success: 0, failed: 0 };
  }
  recentDeploys.forEach(d => {
    const day = d.created_at?.slice(0, 10);
    if (day && deployFreq[day] !== undefined) {
      if (d.status === "success") deployFreq[day].success++;
      else if (d.status === "failed") deployFreq[day].failed++;
    }
  });
  const freqDays = Object.entries(deployFreq);
  const maxFreq = Math.max(...freqDays.map(([, v]) => v.success + v.failed), 1);

  /* ── project-name lookup for deploy table ── */
  const projectMap: Record<string, string> = {};
  projects.forEach(p => { projectMap[p.id] = p.name; });

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-7 h-7 text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4 bg-[#0B0B0F] min-h-full">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {lastRefresh
              ? `Last updated ${timeAgo(lastRefresh.toISOString())}`
              : new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadAll}
            className="p-2 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <Link
            href="/dashboard/projects/new"
            className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-3 py-2 rounded-lg text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New Project
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError("")}><XCircle className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* ── ROW 1: KPI CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Projects", value: stats.total,
            icon: Server, color: "#FF6B35",
            sub: stats.total === 0 ? "No projects yet" : `${stats.running} active`,
          },
          {
            label: "Running", value: stats.running,
            icon: CheckCircle2, color: "#22c55e",
            sub: stats.total > 0 ? `${Math.round((stats.running / stats.total) * 100)}% healthy` : "—",
          },
          {
            label: "Deployments", value: deployStats.total,
            icon: Zap, color: "#3b82f6",
            sub: `${successRate}% success rate`,
          },
          {
            label: "Failed", value: stats.failed + deployStats.failed,
            icon: AlertTriangle, color: "#ef4444",
            sub: stats.failed + deployStats.failed === 0 ? "All clear" : "Needs attention",
          },
        ].map((card) => (
          <div key={card.label} className="bg-[#111116] border border-white/6 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{card.label}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: card.color + "18" }}>
                <card.icon className="w-3.5 h-3.5" style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{card.value}</div>
            <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" style={{ color: card.color }} />
              {card.sub}
            </span>
          </div>
        ))}
      </div>

      {/* ── ROW 2: DONUT + DEPLOY STATS + PROJECTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* Project Status Donut */}
        <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-white">Project Status</span>
            <span className="text-[10px] text-gray-500">{stats.total} total</span>
          </div>
          {stats.total === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Package className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-xs text-gray-500">No projects yet</p>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <DonutRing segments={donutSegments} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{stats.total}</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {[
                  { label: "Running", value: stats.running, color: "#22c55e" },
                  { label: "Stopped", value: stats.stopped, color: "#6b7280" },
                  { label: "Deploying", value: stats.deploying, color: "#3b82f6" },
                  { label: "Failed", value: stats.failed, color: "#ef4444" },
                ].map(d => (
                  <div key={d.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-xs text-gray-400">{d.label}</span>
                    </div>
                    <span className="text-xs font-medium text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Deployment Stats */}
        <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-white">Deployment Health</span>
            <span className="text-[10px] text-gray-500">Last {deployStats.total} deploys</span>
          </div>
          {deployStats.total === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Zap className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-xs text-gray-500">No deployments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { label: "Successful", value: deployStats.success, total: deployStats.total, color: "#22c55e" },
                { label: "Failed", value: deployStats.failed, total: deployStats.total, color: "#ef4444" },
                { label: "Building", value: deployStats.building, total: deployStats.total, color: "#3b82f6" },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400">{r.label}</span>
                    <span className="text-xs font-medium text-white">
                      {r.value}
                      <span className="text-gray-500 ml-1">
                        ({r.total > 0 ? Math.round((r.value / r.total) * 100) : 0}%)
                      </span>
                    </span>
                  </div>
                  <ProgressBar pct={r.total > 0 ? (r.value / r.total) * 100 : 0} color={r.color} />
                </div>
              ))}
              <div className="pt-1 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-500">Success rate</span>
                <span className="text-sm font-bold" style={{ color: successRate >= 80 ? "#22c55e" : successRate >= 50 ? "#f59e0b" : "#ef4444" }}>
                  {successRate}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Live Projects */}
        <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <span className="text-xs font-semibold text-white">Projects</span>
            <Link href="/dashboard/projects" className="text-[10px] text-[#FF6B35] hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-white/3 max-h-[220px] overflow-y-auto">
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <Package className="w-7 h-7 text-gray-600 mb-2" />
                <p className="text-xs text-gray-500 mb-3">No projects yet</p>
                <Link href="/dashboard/projects/new" className="text-xs bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-3 py-1.5 rounded-lg transition">
                  Create project
                </Link>
              </div>
            ) : (
              projects.map(p => (
                <div key={p.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/2 transition">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(p.status)}`} />
                    <div className="min-w-0">
                      <Link href={`/dashboard/projects/${p.id}`} className="text-xs font-medium text-white hover:text-[#FF6B35] transition truncate block">
                        {p.name}
                      </Link>
                      <span className={`text-[10px] ${statusText(p.status)}`}>{p.status || "idle"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {p.status === "stopped" ? (
                      <button onClick={() => handleAction(p.id, "start")} className="p-1 rounded text-green-400 hover:bg-green-500/10 transition" title="Start">
                        <Play className="w-3 h-3" />
                      </button>
                    ) : (
                      <button onClick={() => handleAction(p.id, "stop")} className="p-1 rounded text-gray-400 hover:bg-white/5 transition" title="Stop">
                        <Square className="w-3 h-3" />
                      </button>
                    )}
                    <button onClick={() => handleAction(p.id, "restart")} className="p-1 rounded text-blue-400 hover:bg-blue-500/10 transition" title="Restart">
                      <RotateCw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── ROW 3: RECENT DEPLOYMENTS TABLE ── */}
      <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <span className="text-xs font-semibold text-white">Recent Deployments</span>
          <span className="text-[10px] text-gray-500">{recentDeploys.length} records</span>
        </div>
        {recentDeploys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Zap className="w-8 h-8 text-gray-600 mb-2" />
            <p className="text-sm text-gray-400 mb-1">No deployments yet</p>
            <p className="text-xs text-gray-600">Create a project and trigger your first deploy</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Project</th>
                  <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Commit</th>
                  <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Message</th>
                  <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Status</th>
                  <th className="text-left px-4 py-2.5 text-gray-500 font-medium">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {recentDeploys.map((d, i) => (
                  <tr key={d.id ?? i} className="hover:bg-white/2 transition">
                    <td className="px-4 py-2.5 text-white font-medium">
                      {projectMap[d.project_id] ?? d.project_id?.slice(0, 8) ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-gray-400">
                      {d.commit_sha ? d.commit_sha.slice(0, 7) : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 max-w-[200px] truncate">
                      {d.commit_message || "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`flex items-center gap-1 font-medium ${statusText(d.status)}`}>
                        {d.status === "success" && <CheckCircle2 className="w-3 h-3" />}
                        {d.status === "failed" && <XCircle className="w-3 h-3" />}
                        {(d.status === "deploying" || d.status === "pending") && <Loader2 className="w-3 h-3 animate-spin" />}
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500">{timeAgo(d.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── ROW 4: DEPLOY FREQUENCY (real data) ── */}
      <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-white">Deploy Frequency</span>
            <p className="text-[10px] text-gray-500 mt-0.5">Last 14 days</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#FF6B35] inline-block" />Success</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" />Failed</span>
          </div>
        </div>
        {recentDeploys.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-xs text-gray-600">
            No deployment data yet
          </div>
        ) : (
          <>
            <div className="flex items-end gap-1 h-16">
              {freqDays.map(([day, counts]) => {
                const total = counts.success + counts.failed;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-0.5 group relative" title={`${day}: ${counts.success} success, ${counts.failed} failed`}>
                    {counts.failed > 0 && (
                      <div className="w-full rounded-sm bg-red-500/70" style={{ height: `${(counts.failed / maxFreq) * 64}px` }} />
                    )}
                    <div
                      className="w-full rounded-sm bg-[#FF6B35]/60 group-hover:bg-[#FF6B35] transition"
                      style={{ height: `${Math.max((counts.success / maxFreq) * 64, total > 0 ? 2 : 0)}px` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-gray-600">
              <span>{freqDays[0]?.[0]}</span>
              <span>{freqDays[6]?.[0]}</span>
              <span>Today</span>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
