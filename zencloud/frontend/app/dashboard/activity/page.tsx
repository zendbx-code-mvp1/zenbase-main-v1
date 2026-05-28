"use client";

import { Activity, GitBranch, Rocket, Database, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface ActivityItem {
  id: string;
  type: "deployment" | "database" | "project";
  action: string;
  status: "success" | "failed" | "pending";
  timestamp: string;
  details: string;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const deployments = await api.getRecentDeployments(20);
      
      const activityItems: ActivityItem[] = deployments.map((dep: any) => ({
        id: dep.id,
        type: "deployment",
        action: `Deployed ${dep.project?.name || "project"}`,
        status: dep.status === "completed" ? "success" : dep.status === "failed" ? "failed" : "pending",
        timestamp: dep.created_at,
        details: `Branch: ${dep.branch || "main"} • Commit: ${dep.commit_sha?.substring(0, 7) || "N/A"}`
      }));

      setActivities(activityItems);
    } catch (error) {
      console.error("Failed to load activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "deployment": return Rocket;
      case "database": return Database;
      case "project": return GitBranch;
      default: return Activity;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "failed": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Activity</h1>
        <p className="text-gray-400 text-sm">Recent activity across your projects and deployments</p>
      </div>

      {/* Activity Feed */}
      <div className="bg-[#0d0d12] border border-white/5 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No recent activity</p>
            <p className="text-gray-500 text-sm mt-1">Deploy a project to see activity here</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {activities.map((activity) => {
              const Icon = getIcon(activity.type);
              return (
                <div key={activity.id} className="p-4 hover:bg-white/[0.02] transition">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#FF6B35]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium">{activity.action}</p>
                        {getStatusIcon(activity.status)}
                      </div>
                      <p className="text-gray-400 text-sm">{activity.details}</p>
                      <p className="text-gray-500 text-xs mt-1">{formatTimestamp(activity.timestamp)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
