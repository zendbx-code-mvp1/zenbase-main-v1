import Link from "next/link";
import { 
  Rocket, 
  LayoutDashboard, 
  FolderGit2, 
  Database, 
  Settings, 
  LogOut,
  Bell,
  User
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-dark-700 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-dark-700">
          <Link href="/" className="flex items-center space-x-2">
            <Rocket className="w-8 h-8 text-primary-500" />
            <span className="text-2xl font-bold text-white">ZenCloud</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-500/10 text-primary-500 font-medium"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/projects"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-800 hover:text-white transition"
              >
                <FolderGit2 className="w-5 h-5" />
                <span>Projects</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/databases"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-800 hover:text-white transition"
              >
                <Database className="w-5 h-5" />
                <span>Databases</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-800 hover:text-white transition"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-dark-700">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-dark-800 transition cursor-pointer">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-400">john@example.com</p>
            </div>
            <LogOut className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 glass border-b border-dark-700 flex items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-white transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
