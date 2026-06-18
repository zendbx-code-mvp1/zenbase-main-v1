"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Rocket, LayoutDashboard, FolderGit2, Database,
  Settings, LogOut, Bell, Activity, ChevronRight,
  Cpu, Globe, GitBranch, HelpCircle, Search, Shield,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/projects", icon: FolderGit2, label: "Projects" },
  { href: "/dashboard/domains", icon: Globe, label: "Domains" },
  { href: "/dashboard/databases", icon: Database, label: "Databases" },
  { href: "/dashboard/security", icon: Shield, label: "Security" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex text-white">
      {/* ── SIDEBAR ── */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-white/5 bg-[#0d0d12]">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FF6B35] rounded-lg flex items-center justify-center">
              <Rocket className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">ZenCloud</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2">Main</p>
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? "bg-[#FF6B35]/10 text-[#FF6B35] font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            );
          })}

          <div className="pt-4">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2">Monitor</p>
            {[
              { href: "/dashboard/activity", icon: Activity, label: "Activity" },
              { href: "/dashboard/resources", icon: Cpu, label: "Resources" },
            ].map(({ href, icon: Icon, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    active
                      ? "bg-[#FF6B35]/10 text-[#FF6B35] font-medium"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                  {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-white/5 space-y-0.5">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
            <HelpCircle className="w-4 h-4" />
            Help & Docs
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
          {/* User */}
          <div className="flex items-center gap-2.5 px-3 py-2 mt-1 rounded-lg bg-white/3">
            <div className="w-7 h-7 rounded-full bg-[#FF6B35]/20 flex items-center justify-center text-xs font-bold text-[#FF6B35] shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.username ?? "User"}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email ?? ""}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-[#0d0d12]">
          <div className="flex items-center gap-3">
            {/* Breadcrumb */}
            <span className="text-xs text-gray-500">ZenCloud</span>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-white font-medium capitalize">
              {pathname.split("/").filter(Boolean).slice(-1)[0] ?? "Overview"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-white/5 border border-white/8 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50 w-44"
              />
            </div>
            {/* Bell */}
            <Link href="/dashboard/notifications" className="relative p-1.5 text-gray-400 hover:text-white transition rounded-lg hover:bg-white/5">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#FF6B35] rounded-full" />
            </Link>
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-[#FF6B35]/20 flex items-center justify-center text-xs font-bold text-[#FF6B35]">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
