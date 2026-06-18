"use client";

import { useState } from "react";
import {
  Bell, CheckCircle2, XCircle, AlertTriangle, Info, Clock,
  Zap, GitBranch, Database, Globe, Shield, CreditCard,
  Trash2, Check, Filter, Search, ArrowUpRight, Package,
  Server, Settings
} from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";
type NotificationCategory = "deployment" | "security" | "billing" | "system" | "all";

interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    projectName?: string;
    deploymentId?: string;
    [key: string]: any;
  };
}

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      category: "deployment",
      title: "Deployment Successful",
      message: "Your project 'E-commerce App' has been deployed successfully to production.",
      timestamp: "2 minutes ago",
      read: false,
      actionUrl: "/dashboard/projects/1",
      actionLabel: "View Project",
      metadata: { projectName: "E-commerce App", deploymentId: "dep_123" }
    },
    {
      id: "2",
      type: "error",
      category: "deployment",
      title: "Deployment Failed",
      message: "Build failed for 'Portfolio Website'. Check logs for details.",
      timestamp: "15 minutes ago",
      read: false,
      actionUrl: "/dashboard/projects/2/logs",
      actionLabel: "View Logs",
      metadata: { projectName: "Portfolio Website" }
    },
    {
      id: "3",
      type: "warning",
      category: "security",
      title: "Security Alert",
      message: "Unusual login activity detected from a new location. If this wasn't you, please secure your account.",
      timestamp: "1 hour ago",
      read: false,
      actionUrl: "/dashboard/settings",
      actionLabel: "Review Activity"
    },
    {
      id: "4",
      type: "info",
      category: "system",
      title: "Scheduled Maintenance",
      message: "System maintenance scheduled for tonight at 2:00 AM UTC. Expected downtime: 30 minutes.",
      timestamp: "2 hours ago",
      read: true
    },
    {
      id: "5",
      type: "success",
      category: "deployment",
      title: "Auto-scaling Activated",
      message: "Your project 'API Gateway' has automatically scaled up due to increased traffic.",
      timestamp: "3 hours ago",
      read: true,
      metadata: { projectName: "API Gateway" }
    },
    {
      id: "6",
      type: "warning",
      category: "billing",
      title: "Usage Limit Warning",
      message: "You've reached 80% of your monthly bandwidth limit. Consider upgrading your plan.",
      timestamp: "5 hours ago",
      read: true,
      actionUrl: "/dashboard/billing",
      actionLabel: "Upgrade Plan"
    },
    {
      id: "7",
      type: "info",
      category: "system",
      title: "New Feature Available",
      message: "Custom domains are now available! Configure your custom domain in project settings.",
      timestamp: "1 day ago",
      read: true,
      actionUrl: "/dashboard/domains",
      actionLabel: "Learn More"
    },
    {
      id: "8",
      type: "success",
      category: "security",
      title: "SSL Certificate Renewed",
      message: "SSL certificate for 'myapp.zencloud.dev' has been automatically renewed.",
      timestamp: "2 days ago",
      read: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const deleteAll = () => {
    if (confirm("Are you sure you want to delete all notifications?")) {
      setNotifications([]);
    }
  };

  const filteredNotifications = notifications
    .filter(n => activeFilter === "all" || n.category === activeFilter)
    .filter(n => 
      searchQuery === "" || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success": return CheckCircle2;
      case "error": return XCircle;
      case "warning": return AlertTriangle;
      case "info": return Info;
    }
  };

  const getColor = (type: NotificationType) => {
    switch (type) {
      case "success": return { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", icon: "text-green-400" };
      case "error": return { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", icon: "text-red-400" };
      case "warning": return { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400", icon: "text-yellow-400" };
      case "info": return { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", icon: "text-blue-400" };
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case "deployment": return Zap;
      case "security": return Shield;
      case "billing": return CreditCard;
      case "system": return Settings;
      default: return Bell;
    }
  };

  const filters: { id: NotificationCategory; label: string; icon: any }[] = [
    { id: "all", label: "All", icon: Bell },
    { id: "deployment", label: "Deployments", icon: Zap },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "system", label: "System", icon: Settings }
  ];

  return (
    <div className="p-5 space-y-4 bg-[#0B0B0F] min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#FF6B35]" />
            Notifications
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          <button
            onClick={deleteAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full bg-[#111116] border border-white/8 rounded-lg pl-10 pr-4 py-2.5 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                activeFilter === filter.id
                  ? "bg-[#FF6B35] text-white"
                  : "bg-[#111116] border border-white/8 text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <filter.icon className="w-3.5 h-3.5" />
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-[#111116] border border-white/6 rounded-xl p-12 text-center">
          <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-white mb-2">No notifications</h3>
          <p className="text-xs text-gray-500">
            {searchQuery ? "No notifications match your search" : "You're all caught up!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const Icon = getIcon(notification.type);
            const colors = getColor(notification.type);
            const CategoryIcon = getCategoryIcon(notification.category);

            return (
              <div
                key={notification.id}
                className={`bg-[#111116] border rounded-xl p-4 transition hover:border-white/10 ${
                  notification.read ? "border-white/6" : "border-[#FF6B35]/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-[#FF6B35] shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 rounded hover:bg-white/5 transition"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notification.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <CategoryIcon className="w-3 h-3" />
                          {notification.category}
                        </span>
                      </div>

                      {notification.actionUrl && (
                        <a
                          href={notification.actionUrl}
                          className="flex items-center gap-1 text-xs text-[#FF6B35] hover:text-[#e85d2a] transition"
                        >
                          {notification.actionLabel || "View"}
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
