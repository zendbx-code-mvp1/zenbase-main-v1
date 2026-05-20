import Link from "next/link";
import { 
  Plus, 
  Rocket, 
  Activity, 
  HardDrive, 
  Zap,
  ExternalLink,
  GitBranch,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";

export default function DashboardPage() {
  // Mock data
  const stats = [
    {
      label: "Total Projects",
      value: "12",
      icon: Rocket,
      change: "+2 this month",
      color: "text-primary-500"
    },
    {
      label: "Active Deployments",
      value: "8",
      icon: Activity,
      change: "All running",
      color: "text-green-500"
    },
    {
      label: "Storage Used",
      value: "4.2 GB",
      icon: HardDrive,
      change: "of 10 GB",
      color: "text-blue-500"
    },
    {
      label: "API Requests",
      value: "2.4k",
      icon: Zap,
      change: "Today",
      color: "text-yellow-500"
    }
  ];

  const projects = [
    {
      id: 1,
      name: "my-portfolio",
      url: "my-portfolio.zencloud.dev",
      framework: "Next.js",
      status: "running",
      lastDeploy: "2 hours ago",
      branch: "main"
    },
    {
      id: 2,
      name: "api-backend",
      url: "api-backend.zencloud.dev",
      framework: "Node.js",
      status: "running",
      lastDeploy: "1 day ago",
      branch: "main"
    },
    {
      id: 3,
      name: "landing-page",
      url: "landing-page.zencloud.dev",
      framework: "React",
      status: "building",
      lastDeploy: "Just now",
      branch: "develop"
    },
    {
      id: 4,
      name: "blog-site",
      url: "blog-site.zencloud.dev",
      framework: "Next.js",
      status: "failed",
      lastDeploy: "5 hours ago",
      branch: "main"
    }
  ];

  const recentActivity = [
    {
      project: "my-portfolio",
      action: "Deployed successfully",
      time: "2 hours ago",
      status: "success"
    },
    {
      project: "api-backend",
      action: "Environment variables updated",
      time: "5 hours ago",
      status: "info"
    },
    {
      project: "blog-site",
      action: "Build failed",
      time: "5 hours ago",
      status: "error"
    },
    {
      project: "landing-page",
      action: "Custom domain added",
      time: "1 day ago",
      status: "success"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "building":
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "building":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John!</h1>
          <p className="text-gray-400">Here's what's happening with your projects</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition glow-orange flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-gray-500 text-xs">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Projects List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-primary-500 hover:text-primary-400 text-sm font-medium transition">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="glass rounded-xl p-6 hover:border-primary-500/50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <a 
                      href={`https://${project.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-500 text-sm flex items-center space-x-1 transition"
                    >
                      <span>{project.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {getStatusIcon(project.status)}
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Rocket className="w-4 h-4" />
                    <span>{project.framework}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GitBranch className="w-4 h-4" />
                    <span>{project.branch}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{project.lastDeploy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="glass rounded-xl p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b border-dark-700 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">{activity.project}</p>
                    <p className="text-gray-400 text-xs mb-1">{activity.action}</p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 glass rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/projects/new"
                className="block w-full text-left px-4 py-3 rounded-lg bg-dark-800 hover:bg-dark-700 text-white transition"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-medium">New Project</span>
                </div>
              </Link>
              <Link
                href="/dashboard/databases"
                className="block w-full text-left px-4 py-3 rounded-lg bg-dark-800 hover:bg-dark-700 text-white transition"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-medium">New Database</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
