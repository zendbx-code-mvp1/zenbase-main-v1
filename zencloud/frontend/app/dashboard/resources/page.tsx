"use client";

import { Cpu, HardDrive, Network, Activity, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface ProjectStats {
  project_id: string;
  project_name: string;
  status: string;
  cpu_percent: number;
  memory_percent: number;
  memory_usage_mb: string;
  memory_limit_mb: string;
  error?: string;
}

export default function ResourcesPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [projectStats, setProjectStats] = useState<Map<string, ProjectStats>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
    // Poll stats every 3 seconds
    const interval = setInterval(loadAllStats, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      loadAllStats();
    }
  }, [projects]);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllStats = async () => {
    // Only fetch stats for projects with containers that are running or active
    const projectsWithContainers = projects.filter(
      p => p.container_id && (p.status === "running" || p.status === "active")
    );
    
    if (projectsWithContainers.length === 0) {
      return;
    }

    try {
      // Fetch stats for each project with a container
      const statsPromises = projectsWithContainers
        .map(async (project) => {
          try {
            const stats = await api.getProjectStats(project.id);
            return { id: project.id, stats };
          } catch (err) {
            return { id: project.id, stats: null };
          }
        });

      const results = await Promise.all(statsPromises);
      
      const newStatsMap = new Map<string, ProjectStats>();
      results.forEach(({ id, stats }) => {
        if (stats) {
          newStatsMap.set(id, {
            project_id: id,
            project_name: projects.find(p => p.id === id)?.name || "",
            ...stats
          });
        }
      });
      
      setProjectStats(newStatsMap);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "text-green-500";
      case "stopped": return "text-gray-500";
      case "deploying": return "text-yellow-500";
      case "failed": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  // Calculate aggregate stats
  const aggregateStats = {
    avgCpu: 0,
    avgMemory: 0,
    totalProjects: projects.length,
    runningProjects: projects.filter(p => p.status === "running").length
  };

  if (projectStats.size > 0) {
    const statsArray = Array.from(projectStats.values());
    aggregateStats.avgCpu = statsArray.reduce((sum, s) => sum + s.cpu_percent, 0) / statsArray.length;
    aggregateStats.avgMemory = statsArray.reduce((sum, s) => sum + s.memory_percent, 0) / statsArray.length;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Resources</h1>
        <p className="text-gray-400 text-sm">Monitor resource usage across your deployments</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0d0d12] border border-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-500" />
            </div>
            {projectStats.size > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">Live</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {projectStats.size > 0 ? `${aggregateStats.avgCpu.toFixed(1)}%` : "--"}
          </div>
          <div className="text-sm text-gray-400">Avg CPU Usage</div>
          {projectStats.size > 0 && (
            <div className="mt-2 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${Math.min(aggregateStats.avgCpu, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div className="bg-[#0d0d12] border border-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            {projectStats.size > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">Live</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {projectStats.size > 0 ? `${aggregateStats.avgMemory.toFixed(1)}%` : "--"}
          </div>
          <div className="text-sm text-gray-400">Avg Memory Usage</div>
          {projectStats.size > 0 && (
            <div className="mt-2 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${Math.min(aggregateStats.avgMemory, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div className="bg-[#0d0d12] border border-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{aggregateStats.totalProjects}</div>
          <div className="text-sm text-gray-400">Total Projects</div>
        </div>

        <div className="bg-[#0d0d12] border border-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Network className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{aggregateStats.runningProjects}</div>
          <div className="text-sm text-gray-400">Running Projects</div>
        </div>
      </div>

      {/* Projects Resource Usage */}
      <div className="bg-[#0d0d12] border border-white/5 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Project Resources</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center">
            <Cpu className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No projects deployed</p>
            <p className="text-gray-500 text-sm mt-1">Deploy a project to monitor resources</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {projects.map((project) => {
              const stats = projectStats.get(project.id);
              const hasStats = stats && !stats.error;
              
              return (
                <div key={project.id} className="p-4 hover:bg-white/[0.02] transition">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium">{project.name}</h3>
                      <p className="text-gray-400 text-sm">
                        Status: <span className={getStatusColor(project.status)}>{project.status}</span>
                      </p>
                    </div>
                    {hasStats && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-gray-400">Live</span>
                      </div>
                    )}
                  </div>
                  
                  {!project.container_id ? (
                    <div className="text-xs text-gray-500 italic">No container - deploy to see metrics</div>
                  ) : hasStats ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">CPU</div>
                        <div className="text-sm text-white font-medium">{stats.cpu_percent.toFixed(1)}%</div>
                        <div className="mt-1 h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              stats.cpu_percent > 80 ? "bg-red-500" : 
                              stats.cpu_percent > 50 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(stats.cpu_percent, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Memory</div>
                        <div className="text-sm text-white font-medium">{stats.memory_percent.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">{stats.memory_usage_mb} / {stats.memory_limit_mb}</div>
                        <div className="mt-1 h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              stats.memory_percent > 80 ? "bg-red-500" : 
                              stats.memory_percent > 50 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(stats.memory_percent, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Status</div>
                        <div className={`text-sm font-medium capitalize ${getStatusColor(stats.status)}`}>
                          {stats.status}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Health</div>
                        <div className={`text-sm font-medium ${
                          stats.status === "running" && stats.cpu_percent < 80 && stats.memory_percent < 80
                            ? "text-green-500"
                            : stats.status === "running"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}>
                          {stats.status === "running" && stats.cpu_percent < 80 && stats.memory_percent < 80
                            ? "Healthy"
                            : stats.status === "running"
                            ? "Warning"
                            : "Down"}
                        </div>
                      </div>
                    </div>
                  ) : stats && stats.error ? (
                    <div className="text-xs text-red-500 italic">Error: {stats.error}</div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                      <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                      Fetching metrics...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Note */}
      {projectStats.size === 0 && projects.length > 0 && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
          <p className="text-blue-400 text-sm">
            <strong>Note:</strong> Deploy your projects to see real-time resource monitoring. Stats update every 3 seconds.
          </p>
        </div>
      )}
      
      {projectStats.size > 0 && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
          <p className="text-green-400 text-sm">
            ✅ <strong>Live Monitoring Active:</strong> Resource stats are updating every 3 seconds. Color indicators: 🟢 Healthy (&lt;50%), 🟡 Warning (50-80%), 🔴 Critical (&gt;80%)
          </p>
        </div>
      )}
    </div>
  );
}
