"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal, Download, Trash2 } from "lucide-react";

interface LogEntry {
  log: string;
  timestamp: string;
}

interface RealTimeLogsProps {
  projectId: string;
  token: string;
}

export default function RealTimeLogs({ projectId, token }: RealTimeLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket for logs
    const ws = new WebSocket(`ws://localhost:8000/monitoring/ws/logs/${projectId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Log WebSocket connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLogs((prev) => [...prev, data]);
      } catch (err) {
        console.error("Failed to parse log message:", err);
      }
    };

    ws.onerror = (event) => {
      console.error("Log WebSocket error:", event);
      setConnected(false);
    };

    ws.onclose = () => {
      console.log("Log WebSocket disconnected");
      setConnected(false);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [projectId]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const handleScroll = () => {
    if (!logsContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const downloadLogs = () => {
    const logText = logs.map((entry) => `[${entry.timestamp}] ${entry.log}`).join("\n");
    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${projectId}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#FF6B35]" />
          <span className="text-sm font-medium text-white">Real-time Logs</span>
          {connected && (
            <div className="flex items-center gap-1.5 ml-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">Live</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadLogs}
            disabled={logs.length === 0}
            className="p-1.5 hover:bg-[#1A1A1A] rounded text-gray-400 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download logs"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={clearLogs}
            disabled={logs.length === 0}
            className="p-1.5 hover:bg-[#1A1A1A] rounded text-gray-400 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded"
            />
            Auto-scroll
          </label>
        </div>
      </div>

      {/* Logs Container */}
      <div
        ref={logsContainerRef}
        onScroll={handleScroll}
        className="h-96 overflow-y-auto bg-black p-4 font-mono text-xs"
      >
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            {connected ? "Waiting for logs..." : "Connecting..."}
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((entry, index) => (
              <div key={index} className="text-gray-300 hover:bg-[#1A1A1A] px-2 py-0.5 rounded">
                <span className="text-gray-500 mr-2">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
                <span>{entry.log}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[#1A1A1A] bg-[#0A0A0A] text-xs text-gray-500">
        {logs.length} log {logs.length !== 1 ? "entries" : "entry"}
      </div>
    </div>
  );
}
