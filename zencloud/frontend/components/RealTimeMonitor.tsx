"use client";

import { useEffect, useState, useRef } from "react";
import { Activity, Cpu, HardDrive, Zap } from "lucide-react";

interface ContainerStats {
  status: string;
  cpu_percent: number;
  memory_usage_mb: string;
  memory_limit_mb: string;
  memory_percent: number;
  timestamp?: string;
  error?: string;
}

interface RealTimeMonitorProps {
  projectId: string;
  token: string;
  containerStatus?: string;
}

export default function RealTimeMonitor({ projectId, token, containerStatus }: RealTimeMonitorProps) {
  const [stats, setStats] = useState<ContainerStats | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only connect if container is running or active
    if (containerStatus !== "running" && containerStatus !== "active") {
      setError("Container is not running. Start the container to see monitoring.");
      return;
    }

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [projectId, containerStatus]);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(`ws://localhost:8000/monitoring/ws/${projectId}`);
      wsRef.current = ws;

      let connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.log("WebSocket connection timeout");
          ws.close();
          setError("Connection timeout - container may not be responding");
          setConnected(false);
        }
      }, 10000); // 10 second timeout

      ws.onopen = () => {
        console.log("WebSocket connected");
        clearTimeout(connectionTimeout);
        setConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            setError(data.error);
            setConnected(false);
          } else {
            setStats(data);
            setError(null);
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        clearTimeout(connectionTimeout);
        setError("Failed to connect to monitoring service");
        setConnected(false);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        clearTimeout(connectionTimeout);
        setConnected(false);
        
        // Try to reconnect after 5 seconds if container is still running
        if (containerStatus === "running" || containerStatus === "active") {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connectWebSocket();
          }, 5000);
        }
      };
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      setError("Failed to initialize monitoring");
    }
  };

  if (error) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-yellow-500 text-sm">⚠️ {error}</p>
          <button
            onClick={() => {
              setError(null);
              connectWebSocket();
            }}
            className="text-xs text-yellow-500 hover:text-yellow-400 underline"
          >
            Retry
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Tip: Check if the container is actually running with <code className="bg-black/30 px-1 rounded">docker ps</code>
        </p>
      </div>
    );
  }

  if (!connected || !stats) {
    return (
      <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-6">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <div className="w-4 h-4 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Connecting to monitoring...</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-green-500";
      case "exited":
        return "text-red-500";
      case "paused":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  const getCpuColor = (percent: number) => {
    if (percent > 80) return "text-red-500";
    if (percent > 50) return "text-yellow-500";
    return "text-green-500";
  };

  const getMemoryColor = (percent: number) => {
    if (percent > 80) return "text-red-500";
    if (percent > 50) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span>Live monitoring</span>
        {stats.timestamp && (
          <span className="ml-auto">
            Updated: {new Date(stats.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Container Status */}
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Status</span>
          </div>
          <div className={`text-2xl font-bold ${getStatusColor(stats.status)}`}>
            {stats.status}
          </div>
        </div>

        {/* CPU Usage */}
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">CPU Usage</span>
          </div>
          <div className={`text-2xl font-bold ${getCpuColor(stats.cpu_percent)}`}>
            {stats.cpu_percent.toFixed(1)}%
          </div>
          <div className="mt-2 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                stats.cpu_percent > 80
                  ? "bg-red-500"
                  : stats.cpu_percent > 50
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(stats.cpu_percent, 100)}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Memory</span>
          </div>
          <div className={`text-2xl font-bold ${getMemoryColor(stats.memory_percent)}`}>
            {stats.memory_percent.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {stats.memory_usage_mb} / {stats.memory_limit_mb}
          </div>
          <div className="mt-2 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                stats.memory_percent > 80
                  ? "bg-red-500"
                  : stats.memory_percent > 50
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(stats.memory_percent, 100)}%` }}
            />
          </div>
        </div>

        {/* Health Score */}
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Health</span>
          </div>
          <div
            className={`text-2xl font-bold ${
              stats.status === "running" &&
              stats.cpu_percent < 80 &&
              stats.memory_percent < 80
                ? "text-green-500"
                : stats.status === "running"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {stats.status === "running" &&
            stats.cpu_percent < 80 &&
            stats.memory_percent < 80
              ? "Healthy"
              : stats.status === "running"
              ? "Warning"
              : "Down"}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">Resource Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">CPU:</span>
            <span className="ml-2 text-white">{stats.cpu_percent.toFixed(2)}%</span>
          </div>
          <div>
            <span className="text-gray-400">Memory:</span>
            <span className="ml-2 text-white">
              {stats.memory_usage_mb} / {stats.memory_limit_mb}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <span className={`ml-2 ${getStatusColor(stats.status)}`}>
              {stats.status}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Memory %:</span>
            <span className="ml-2 text-white">{stats.memory_percent.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
