"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

// ── Types ──────────────────────────────────────────────────────────────

interface UserRow {
  _id: Id<"users">;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  createdAt: number;
  lastActiveAt: number;
  onboardingCompleted: boolean;
  imageUrl?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────

function getInitials(firstName: string, lastName: string): string {
  return ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase() || "??";
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(ts: number): string {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const AVATAR_COLORS = [
  "from-[#ffb347] to-[#e67e22]",
  "from-blue-400 to-blue-600",
  "from-pink-400 to-pink-600",
  "from-green-400 to-green-600",
  "from-purple-400 to-purple-600",
  "from-cyan-400 to-cyan-600",
];

function avatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]!;
}

// ── Skeleton ───────────────────────────────────────────────────────────

function UsersSkeleton() {
  return (
    <div className="flex flex-col gap-6 h-full" style={{ animation: "wm-fade-in 0.3s ease-out" }}>
      <div className="flex items-end justify-between mb-2 shrink-0">
        <div>
          <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-32 bg-white/5 rounded animate-pulse mt-2" />
        </div>
      </div>
      <div className="flex-1 flex gap-6 min-h-0">
        <div className="wm-glass flex-1 rounded-[24px] overflow-hidden flex flex-col min-w-0">
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <div className="wm-glass w-[380px] shrink-0 rounded-[24px] hidden lg:flex flex-col">
          <div className="p-8 space-y-4">
            <div className="h-24 w-24 mx-auto bg-white/5 rounded-full animate-pulse" />
            <div className="h-6 w-32 mx-auto bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const recentUsers = useQuery(api.admin.getRecentUsers);
  const [selectedId, setSelectedId] = React.useState<Id<"users"> | null>(null);
  const [planFilter, setPlanFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // When users load and nothing is selected, select the first one
  React.useEffect(() => {
    if (recentUsers && recentUsers.length > 0 && !selectedId) {
      setSelectedId(recentUsers[0]!._id);
    }
  }, [recentUsers, selectedId]);

  const userDetail = useQuery(
    api.admin.getUserDetail,
    selectedId ? { userId: selectedId } : "skip"
  );

  if (recentUsers === undefined) {
    return <UsersSkeleton />;
  }

  // Apply filters
  const filteredUsers = recentUsers.filter((u: UserRow) => {
    if (planFilter !== "all" && u.subscriptionTier !== planFilter) return false;
    if (statusFilter === "active" && !u.onboardingCompleted) return false;
    if (statusFilter === "suspended" && u.onboardingCompleted) return false;
    return true;
  });

  const selected = filteredUsers.find((u: UserRow) => u._id === selectedId) ?? filteredUsers[0];
  const selectedIndex = filteredUsers.findIndex((u: UserRow) => u._id === (selected?._id ?? null));

  return (
    <div className="flex flex-col gap-6 h-full" style={{ animation: "wm-fade-in 0.3s ease-out" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-2 gap-4 shrink-0">
        <div>
          <h1 className="wm-heading text-3xl text-white">User Management</h1>
          <p className="wm-mono text-sm text-[#968a84] mt-1 tracking-wide">
            {recentUsers.length} users loaded (latest 20)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 wm-mono text-xs text-white focus:outline-none focus:border-[#ffb347]/50 appearance-none pr-8"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="all">All Plans</option>
            <option value="premium">Premium</option>
            <option value="pro">Pro</option>
            <option value="free">Free</option>
          </select>
          <select
            className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 wm-mono text-xs text-white focus:outline-none focus:border-[#ffb347]/50 appearance-none pr-8"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="px-4 py-2 wm-mono text-xs uppercase tracking-widest bg-[#ffb347]/10 text-[#ffb347] border border-[#ffb347]/20 rounded-lg hover:bg-[#ffb347] hover:text-[#0d0b0a] transition-colors flex items-center gap-2 font-bold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Table */}
        <div className="wm-glass flex-1 rounded-[24px] overflow-hidden flex flex-col min-w-0">
          <div className="overflow-x-auto flex-1 wm-scrollbar">
            <table className="w-full text-left whitespace-nowrap" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
              <thead className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-medium border-b border-white/10">User</th>
                  <th className="px-6 py-4 font-medium border-b border-white/10">Plan</th>
                  <th className="px-6 py-4 font-medium border-b border-white/10">Status</th>
                  <th className="px-6 py-4 font-medium border-b border-white/10">Joined Date</th>
                  <th className="px-6 py-4 font-medium border-b border-white/10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#968a84] wm-mono text-xs">
                      No users match the current filters.
                    </td>
                  </tr>
                )}
                {filteredUsers.map((user: UserRow, i: number) => {
                  const initials = getInitials(user.firstName, user.lastName);
                  const isSelected = user._id === selected?._id;
                  const isPremium = user.subscriptionTier === "premium" || user.subscriptionTier === "pro";
                  const isActive = user.subscriptionStatus === "active";

                  return (
                    <tr
                      key={user._id}
                      className={cn(
                        "hover:bg-white/5 transition-colors group cursor-pointer",
                        isSelected && "bg-[#ffb347]/5",
                        !isActive && "opacity-60"
                      )}
                      style={{ borderLeft: isSelected ? "2px solid #ffb347" : "2px solid transparent" }}
                      onClick={() => setSelectedId(user._id)}
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center wm-heading font-bold text-sm bg-gradient-to-br",
                          avatarColor(i),
                          "text-white"
                        )}>
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.firstName} {user.lastName}</p>
                          <p className="wm-mono text-xs text-[#968a84]">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isPremium ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] wm-mono font-medium bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            {user.subscriptionTier === "pro" ? "Pro" : "Premium"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] wm-mono font-medium bg-white/10 text-white/70 border border-white/20">Free</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] wm-mono text-[#34d399] bg-[#34d399]/10 border border-[#34d399]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] wm-mono text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                            {user.subscriptionStatus}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 wm-mono text-xs text-[#968a84]">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#968a84] hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail Panel */}
        <div className="wm-glass w-[380px] shrink-0 rounded-[24px] overflow-y-auto hidden lg:flex flex-col wm-scrollbar">
          {!selected && (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="wm-mono text-xs text-[#968a84]">Select a user to see details.</p>
            </div>
          )}
          {selected && (
            <>
              <div className="p-8 pb-6 border-b border-white/5 flex flex-col items-center text-center relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ffb347] to-[#e67e22] flex items-center justify-center text-[#0d0b0a] wm-heading text-3xl font-bold shadow-[0_0_20px_rgba(255,179,71,0.15)] mb-4 relative">
                  {getInitials(selected.firstName, selected.lastName)}
                  {selected.subscriptionStatus === "active" && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#34d399] border-2 border-[#0d0b0a]" />
                  )}
                </div>
                <h2 className="wm-heading text-xl text-white">{selected.firstName} {selected.lastName}</h2>
                <p className="wm-mono text-xs text-[#968a84] mt-1">{selected.email}</p>
                <p className="wm-mono text-[10px] text-[#968a84] mt-0.5">Country: {selected.country} &bull; Last active: {timeAgo(selected.lastActiveAt)}</p>
                <div className="mt-4 flex gap-2">
                  {(selected.subscriptionTier === "premium" || selected.subscriptionTier === "pro") && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] wm-mono font-medium bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                      {selected.subscriptionTier === "pro" ? "Pro User" : "Premium User"}
                    </span>
                  )}
                  {selected.onboardingCompleted && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] wm-mono font-medium bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/30">
                      Onboarded
                    </span>
                  )}
                </div>
              </div>

              {/* Detail stats — from getUserDetail */}
              <div className="p-6 grid grid-cols-2 gap-4 border-b border-white/5 bg-black/20">
                {userDetail === undefined ? (
                  <>
                    <div className="h-12 bg-white/5 rounded animate-pulse" />
                    <div className="h-12 bg-white/5 rounded animate-pulse" />
                    <div className="h-12 bg-white/5 rounded animate-pulse" />
                    <div className="h-12 bg-white/5 rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <div>
                      <p className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest mb-1">Budgets</p>
                      <p className="wm-mono text-lg font-bold text-white">{userDetail?.budgetCount ?? 0}</p>
                    </div>
                    <div>
                      <p className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest mb-1">Savings Goals</p>
                      <p className="wm-mono text-lg font-bold text-[#3b82f6]">{userDetail?.savingsGoalsCount ?? 0}</p>
                    </div>
                    <div>
                      <p className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest mb-1">AI Chats</p>
                      <p className="wm-mono text-lg font-bold text-[#a855f7]">{userDetail?.conversationCount ?? 0}</p>
                    </div>
                    <div>
                      <p className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest mb-1">Notifications</p>
                      <p className="wm-mono text-lg font-bold text-[#ffb347]">{userDetail?.notificationCount ?? 0}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 flex-1">
                <h3 className="wm-heading text-sm text-white mb-4">Account Info</h3>
                <div className="space-y-3 wm-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#968a84]">Joined</span>
                    <span className="text-white">{formatDate(selected.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#968a84]">Last Active</span>
                    <span className="text-white">{formatDate(selected.lastActiveAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#968a84]">Tier</span>
                    <span className="text-white capitalize">{selected.subscriptionTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#968a84]">Status</span>
                    <span className="text-white capitalize">{selected.subscriptionStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#968a84]">Onboarding</span>
                    <span className={selected.onboardingCompleted ? "text-[#34d399]" : "text-[#ffb347]"}>
                      {selected.onboardingCompleted ? "Completed" : "Incomplete"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 mt-auto">
                <button className="w-full py-3 rounded-xl bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444] hover:text-white transition-all duration-300 wm-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                  Suspend Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
