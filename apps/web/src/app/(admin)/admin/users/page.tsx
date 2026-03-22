"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ── Types & Mock Data ───────────────────────────────────────────────────

interface AdminUser {
  initials: string;
  name: string;
  email: string;
  plan: "Premium" | "Free";
  status: "Active" | "Suspended";
  joined: string;
  active: boolean;
  color: string;
  textColor: string;
}

const USERS: AdminUser[] = [
  { initials: "EO", name: "Emmanuel O.", email: "emma@example.com", plan: "Premium", status: "Active", joined: "Oct 12, 2023", active: true, color: "from-[#ffb347] to-[#e67e22]", textColor: "text-[#0d0b0a]" },
  { initials: "AJ", name: "Aisha J.", email: "aisha.j@mail.com", plan: "Free", status: "Active", joined: "Nov 04, 2023", active: true, color: "bg-blue-500/20", textColor: "text-blue-400" },
  { initials: "TK", name: "Tunde K.", email: "t.king@yahoo.com", plan: "Free", status: "Suspended", joined: "Jan 18, 2024", active: false, color: "bg-gray-500/20", textColor: "text-gray-400" },
  { initials: "CF", name: "Chika F.", email: "chika.f@gmail.com", plan: "Premium", status: "Active", joined: "Feb 02, 2024", active: true, color: "bg-pink-500/20", textColor: "text-pink-400" },
  { initials: "SM", name: "Samuel M.", email: "sam.m@work.net", plan: "Free", status: "Active", joined: "Mar 15, 2024", active: true, color: "bg-green-500/20", textColor: "text-green-400" },
];

// ── Page ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const selected = USERS[selectedIdx] ?? USERS[0]!;

  return (
    <div className="flex flex-col gap-6 h-full" style={{ animation: "wm-fade-in 0.3s ease-out" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-2 gap-4 shrink-0">
        <div>
          <h1 className="wm-heading text-3xl text-white">User Management</h1>
          <p className="wm-mono text-sm text-[#968a84] mt-1 tracking-wide">142,854 total users</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 wm-mono text-xs text-white focus:outline-none focus:border-[#ffb347]/50 appearance-none pr-8">
            <option>All Plans</option>
            <option>Premium</option>
            <option>Free</option>
          </select>
          <select className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 wm-mono text-xs text-white focus:outline-none focus:border-[#ffb347]/50 appearance-none pr-8">
            <option>All Status</option>
            <option>Active</option>
            <option>Suspended</option>
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
                {USERS.map((user, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "hover:bg-white/5 transition-colors group cursor-pointer",
                      selectedIdx === i && "bg-[#ffb347]/5",
                      !user.active && "opacity-60"
                    )}
                    style={{ borderLeft: selectedIdx === i ? "2px solid #ffb347" : "2px solid transparent" }}
                    onClick={() => setSelectedIdx(i)}
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center wm-heading font-bold",
                        selectedIdx === i ? `bg-gradient-to-br ${user.color}` : user.color,
                        user.textColor
                      )}>
                        {user.initials}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="wm-mono text-xs text-[#968a84]">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.plan === "Premium" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] wm-mono font-medium bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] wm-mono font-medium bg-white/10 text-white/70 border border-white/20">Free</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] wm-mono text-[#34d399] bg-[#34d399]/10 border border-[#34d399]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] wm-mono text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 wm-mono text-xs text-[#968a84]">{user.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#968a84] hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail Panel */}
        <div className="wm-glass w-[380px] shrink-0 rounded-[24px] overflow-y-auto hidden lg:flex flex-col wm-scrollbar">
          <div className="p-8 pb-6 border-b border-white/5 flex flex-col items-center text-center relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ffb347] to-[#e67e22] flex items-center justify-center text-[#0d0b0a] wm-heading text-3xl font-bold shadow-[0_0_20px_rgba(255,179,71,0.15)] mb-4 relative">
              {selected.initials}
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#34d399] border-2 border-[#0d0b0a]" />
            </div>
            <h2 className="wm-heading text-xl text-white">{selected.name}</h2>
            <p className="wm-mono text-xs text-[#968a84] mt-1">{selected.email} &bull; +234 801 234 5678</p>
            <div className="mt-4 flex gap-2">
              {selected.plan === "Premium" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] wm-mono font-medium bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  Premium User
                </span>
              )}
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4 border-b border-white/5 bg-black/20">
            <div>
              <p className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest mb-1">Wallet Balance</p>
              <p className="wm-mono text-lg font-bold text-white">N42,500</p>
            </div>
            <div>
              <p className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest mb-1">Japa Fund</p>
              <p className="wm-mono text-lg font-bold text-[#3b82f6]">N850,000</p>
            </div>
          </div>

          <div className="p-6 flex-1">
            <h3 className="wm-heading text-sm text-white mb-4">Recent Sholz Chats</h3>
            <div className="space-y-3">
              {[
                { q: '"Should I buy that new iPhone 15 Pro?"', tag: "Roast Mode Active", time: "10:45 AM" },
                { q: '"How much do I need to save for UK visa?"', tag: "Japa Inquiry", time: "Yesterday" },
                { q: '"Analyze my Chowdeck spending"', tag: "Expense Review", time: "Oct 24" },
              ].map((chat, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#ffb347]/30 transition-colors cursor-pointer group">
                  <p className="text-sm text-white/90 line-clamp-1 group-hover:text-[#ffb347] transition-colors">{chat.q}</p>
                  <p className="wm-mono text-[10px] text-[#968a84] mt-2 flex justify-between"><span>{chat.tag}</span> <span>{chat.time}</span></p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 mt-auto">
            <button className="w-full py-3 rounded-xl bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444] hover:text-white transition-all duration-300 wm-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              Suspend Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
