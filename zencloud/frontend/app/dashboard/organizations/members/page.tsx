"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, UserPlus, Search, Mail, Shield, Crown, Settings,
  MoreVertical, Edit, Trash2, Key, Calendar, CheckCircle2,
  XCircle, Clock, Activity, Filter, Download, UserCheck,
  AlertCircle, Send, Copy, Eye, EyeOff
} from "lucide-react";

type MemberRole = "owner" | "admin" | "member" | "viewer";
type MemberStatus = "active" | "pending" | "suspended";

interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  avatar?: string;
  joinedAt: string;
  lastActive: string;
  projectsAccess: number;
  permissions: string[];
}

export default function OrganizationMembersPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | MemberRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | MemberStatus>("all");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("member");

  useEffect(() => {
    setMounted(true);
  }, []);
  const members: Member[] = [
    {
      id: "member_1",
      name: "John Doe",
      email: "john.doe@zencloud.app",
      role: "owner",
      status: "active",
      joinedAt: "2024-01-15T10:00:00Z",
      lastActive: "2024-06-24T12:45:00Z",
      projectsAccess: 12,
      permissions: ["all"]
    },
    {
      id: "member_2",
      name: "Jane Smith",
      email: "jane.smith@zencloud.app",
      role: "admin",
      status: "active",
      joinedAt: "2024-02-20T14:30:00Z",
      lastActive: "2024-06-24T11:20:00Z",
      projectsAccess: 10,
      permissions: ["deploy", "manage_users", "manage_settings"]
    },
    {
      id: "member_3",
      name: "Mike Johnson",
      email: "mike.johnson@zencloud.app",
      role: "member",
      status: "active",
      joinedAt: "2024-03-10T09:15:00Z",
      lastActive: "2024-06-24T10:30:00Z",
      projectsAccess: 5,
      permissions: ["deploy", "view_logs"]
    },
    {
      id: "member_4",
      name: "Sarah Williams",
      email: "sarah.williams@zencloud.app",
      role: "member",
      status: "active",
      joinedAt: "2024-03-25T16:45:00Z",
      lastActive: "2024-06-24T09:00:00Z",
      projectsAccess: 8,
      permissions: ["deploy", "view_logs", "manage_databases"]
    },
    {
      id: "member_5",
      name: "Alex Brown",
      email: "alex.brown@zencloud.app",
      role: "viewer",
      status: "active",
      joinedAt: "2024-04-05T11:00:00Z",
      lastActive: "2024-06-23T15:30:00Z",
      projectsAccess: 3,
      permissions: ["view_logs", "view_metrics"]
    },
    {
      id: "member_6",
      name: "Emily Davis",
      email: "emily.davis@zencloud.app",
      role: "admin",
      status: "active",
      joinedAt: "2024-04-20T13:20:00Z",
      lastActive: "2024-06-24T08:15:00Z",
      projectsAccess: 9,
      permissions: ["deploy", "manage_users", "manage_settings", "view_billing"]
    },
    {
      id: "member_7",
      name: "Tom Wilson",
      email: "tom.wilson@company.com",
      role: "member",
      status: "pending",
      joinedAt: "2024-06-20T10:00:00Z",
      lastActive: "-",
      projectsAccess: 0,
      permissions: []
    },
    {
      id: "member_8",
      name: "Lisa Anderson",
      email: "lisa.anderson@zencloud.app",
      role: "viewer",
      status: "suspended",
      joinedAt: "2024-03-01T14:00:00Z",
      lastActive: "2024-05-15T16:30:00Z",
      projectsAccess: 2,
      permissions: []
    }
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = searchQuery === "" || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: MemberRole) => {
    switch (role) {
      case "owner": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "admin": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "member": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "viewer": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getRoleIcon = (role: MemberRole) => {
    switch (role) {
      case "owner": return <Crown className="w-4 h-4" />;
      case "admin": return <Shield className="w-4 h-4" />;
      case "member": return <UserCheck className="w-4 h-4" />;
      case "viewer": return <Eye className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: MemberStatus) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "suspended": return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!mounted) return "";
    if (dateString === "-") return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const activeMembers = members.filter(m => m.status === "active").length;
  const pendingInvites = members.filter(m => m.status === "pending").length;
  const adminCount = members.filter(m => m.role === "admin" || m.role === "owner").length;

  const handleInvite = () => {
    alert(`Invitation sent to ${inviteEmail} as ${inviteRole}`);
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteRole("member");
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleRemove = (member: Member) => {
    setSelectedMember(member);
    setShowRemoveModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Organization Members</h1>
            <p className="text-sm text-gray-400">Manage team members and their permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              <UserPlus className="w-4 h-4" />
              Invite Member
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Members</p>
                <p className="text-xl font-bold text-white">{members.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Active</p>
                <p className="text-xl font-bold text-white">{activeMembers}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Pending</p>
                <p className="text-xl font-bold text-white">{pendingInvites}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Admins</p>
                <p className="text-xl font-bold text-white">{adminCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                {(["all", "owner", "admin", "member", "viewer"] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                      roleFilter === role
                        ? "bg-[#FF6B35] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                {(["all", "active", "pending", "suspended"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                      statusFilter === status
                        ? "bg-[#FF6B35] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Team Members</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {filteredMembers.length} members found
            </p>
          </div>
          <div className="divide-y divide-white/5">
            {filteredMembers.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No members found</p>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="px-6 py-5 hover:bg-white/2 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-orange-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {getInitials(member.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 ${getRoleColor(member.role)}`}>
                          {getRoleIcon(member.role)}
                          {member.role.toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(member.status)}`}>
                          {member.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{member.email}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          <span>Joined {formatDate(member.joinedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Activity className="w-3 h-3" />
                          <span>Last active: {formatDate(member.lastActive)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Key className="w-3 h-3" />
                          <span>{member.projectsAccess} projects</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {member.role !== "owner" && (
                        <>
                          <button
                            onClick={() => handleEdit(member)}
                            className="p-2 hover:bg-white/5 rounded-lg transition text-gray-400 hover:text-white"
                            title="Edit member"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemove(member)}
                            className="p-2 hover:bg-white/5 rounded-lg transition text-gray-400 hover:text-red-400"
                            title="Remove member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-white/5">
                <h2 className="text-lg font-semibold text-white">Invite Team Member</h2>
                <p className="text-xs text-gray-400 mt-0.5">Send an invitation to join your organization</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as MemberRole)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B35]/50"
                  >
                    <option value="viewer">Viewer - Read-only access</option>
                    <option value="member">Member - Deploy and manage projects</option>
                    <option value="admin">Admin - Full access except billing</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleInvite}
                    disabled={!inviteEmail}
                    className="flex-1 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 disabled:bg-white/5 disabled:text-gray-500 text-white text-sm font-semibold rounded-lg transition"
                  >
                    Send Invitation
                  </button>
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteEmail("");
                      setInviteRole("member");
                    }}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedMember && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-white/5">
                <h2 className="text-lg font-semibold text-white">Edit Member</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selectedMember.name}</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Role
                  </label>
                  <select
                    defaultValue={selectedMember.role}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B35]/50"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      alert(`Updated ${selectedMember.name}`);
                      setShowEditModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remove Modal */}
        {showRemoveModal && selectedMember && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-white/10 rounded-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-white/5">
                <h2 className="text-lg font-semibold text-white">Remove Member</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-300 font-medium mb-1">Confirm Removal</p>
                      <p className="text-xs text-red-200/80">
                        Are you sure you want to remove <strong>{selectedMember.name}</strong> from the organization? 
                        They will lose access to all projects immediately.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      alert(`Removed ${selectedMember.name}`);
                      setShowRemoveModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition"
                  >
                    Remove Member
                  </button>
                  <button
                    onClick={() => setShowRemoveModal(false)}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
