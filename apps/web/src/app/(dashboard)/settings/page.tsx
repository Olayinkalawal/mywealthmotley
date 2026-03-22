"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ── Toggle Component ────────────────────────────────────────────────────

function Toggle({
  isOn,
  onChange,
  disabled = false,
}: {
  isOn: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      onClick={disabled ? undefined : onChange}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors border shrink-0",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        isOn
          ? disabled
            ? "bg-[#ffb347]/50 border-[#ffb347]/50"
            : "bg-[#ffb347] border-[#e67e22] shadow-[0_0_20px_rgba(255,179,71,0.15)]"
          : "bg-white/10 border-white/20"
      )}
    >
      <div
        className={cn(
          "absolute top-1 w-4 h-4 rounded-full transition-transform",
          isOn
            ? disabled
              ? "right-1 bg-[#0d0b0a]/50"
              : "right-1 bg-[#0d0b0a]"
            : "left-1 bg-[#968a84]"
        )}
      />
    </div>
  );
}

// ── Profile Tab ─────────────────────────────────────────────────────────

function ProfileTab() {
  const [formData, setFormData] = React.useState({
    fullName: "Uche Okoro",
    email: "uche.o@example.com",
    phone: "+234 801 234 5678",
    dob: "1995-05-14",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-10 relative z-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative group overflow-hidden cursor-pointer">
            <span className="text-2xl text-white wm-mono">U</span>
            <div className="absolute inset-0 bg-[#0d0b0a]/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white mb-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              <span className="wm-mono text-[9px] uppercase tracking-wider text-white">Upload</span>
            </div>
          </div>
          <button className="text-xs text-[#968a84] hover:text-[#ffb347] wm-mono transition-colors">Remove Photo</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {[
            { label: "Full Name", field: "fullName", type: "text" },
            { label: "Email Address", field: "email", type: "email" },
            { label: "Phone Number", field: "phone", type: "tel" },
            { label: "Date of Birth", field: "dob", type: "date" },
          ].map(({ label, field, type }) => (
            <div key={field} className="flex flex-col gap-2">
              <label className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest pl-1">{label}</label>
              <input
                type={type}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange(field)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ffb347]/50 focus:outline-none focus:bg-black/40 transition-all text-sm shadow-inner"
                style={type === "date" ? { colorScheme: "dark" } : {}}
              />
            </div>
          ))}
          <div className="md:col-span-2 flex justify-end mt-2">
            <button className="px-6 py-2.5 bg-[#ffb347] hover:bg-[#e67e22] text-[#0d0b0a] wm-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,179,71,0.15)]">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-white/5" />

      <div>
        <h3 className="wm-heading text-lg text-white mb-6 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Change Password
        </h3>
        <div className="bg-black/20 border border-white/5 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2 max-w-md">
            <label className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest pl-1">Current Password</label>
            <input type="password" placeholder="••••••••" value={formData.currentPassword} onChange={handleChange("currentPassword")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ffb347]/50 focus:outline-none focus:bg-white/10 transition-all wm-mono text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest pl-1">New Password</label>
            <input type="password" placeholder="••••••••" value={formData.newPassword} onChange={handleChange("newPassword")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ffb347]/50 focus:outline-none focus:bg-white/10 transition-all wm-mono text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest pl-1">Confirm New Password</label>
            <input type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange("confirmPassword")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ffb347]/50 focus:outline-none focus:bg-white/10 transition-all wm-mono text-sm" />
          </div>
          <div className="md:col-span-2">
            <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white wm-mono text-xs uppercase tracking-wider rounded-xl transition-all border border-white/10">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Preferences Tab ─────────────────────────────────────────────────────

function PreferencesTab() {
  const [currency, setCurrency] = React.useState("NGN");
  const [appearance, setAppearance] = React.useState("dark");
  const [sholzMode, setSholzMode] = React.useState("warm");

  return (
    <div className="space-y-10 relative z-10">
      <div className="max-w-md">
        <h3 className="wm-heading text-lg text-white mb-4">Display Currency</h3>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-[#ffb347]/50 focus:outline-none focus:bg-black/40 transition-all wm-mono text-sm cursor-pointer shadow-inner appearance-none"
        >
          <option value="NGN" className="bg-[#0d0b0a]">Naira (N)</option>
          <option value="USD" className="bg-[#0d0b0a]">USD ($)</option>
          <option value="GBP" className="bg-[#0d0b0a]">GBP (P)</option>
          <option value="EUR" className="bg-[#0d0b0a]">EUR (E)</option>
          <option value="CAD" className="bg-[#0d0b0a]">CAD (C$)</option>
        </select>
        <p className="wm-mono text-[10px] text-[#968a84] mt-2 pl-1">This affects how balances and goals are displayed.</p>
      </div>

      <div className="h-px w-full bg-white/5" />

      <div>
        <h3 className="wm-heading text-lg text-white mb-4">Appearance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: "dark", label: "Dark" },
            { id: "light", label: "Light" },
            { id: "system", label: "System Auto" },
          ].map((opt) => (
            <div
              key={opt.id}
              onClick={() => setAppearance(opt.id)}
              className={cn(
                "border-2 rounded-2xl p-4 cursor-pointer relative overflow-hidden group transition-colors",
                appearance === opt.id ? "bg-black/40 border-[#ffb347]" : "bg-white/5 border-transparent hover:border-white/20"
              )}
            >
              {appearance === opt.id && <div className="absolute inset-0 bg-[#ffb347]/5 pointer-events-none" />}
              <div className={cn(
                "w-full h-16 rounded-lg border mb-3 flex items-center justify-center relative",
                opt.id === "dark" ? "bg-[#0d0b0a] border-white/10" : opt.id === "light" ? "bg-[#f8f9fa] border-gray-200" : "border-white/10 overflow-hidden flex"
              )}>
                {opt.id === "system" ? (
                  <>
                    <div className="w-1/2 h-full bg-[#f8f9fa]" />
                    <div className="w-1/2 h-full bg-[#0d0b0a]" />
                  </>
                ) : (
                  <>
                    <div className={cn("absolute top-2 left-2 w-8 h-2 rounded-full", opt.id === "dark" ? "bg-white/10" : "bg-gray-300")} />
                    <div className="absolute bottom-2 right-2 w-12 h-6 bg-[#ffb347]/20 rounded border border-[#ffb347]/30" />
                  </>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm font-medium", appearance === opt.id ? "text-white" : "text-[#968a84]")}>{opt.label}</span>
                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", appearance === opt.id ? "border-[#ffb347] bg-[#ffb347]/20" : "border-white/20")}>
                  {appearance === opt.id && <div className="w-1.5 h-1.5 bg-[#ffb347] rounded-full" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-white/5" />

      <div>
        <h3 className="wm-heading text-lg text-white mb-4">Sholz Personality</h3>
        <div className="flex p-1 bg-black/40 border border-white/10 rounded-full w-fit mb-6 shadow-inner">
          <button
            onClick={() => setSholzMode("warm")}
            className={cn(
              "px-6 py-2 rounded-full wm-mono text-xs tracking-wide uppercase transition-all duration-300",
              sholzMode === "warm" ? "text-[#0d0b0a] bg-[#ffb347] shadow-[0_0_10px_rgba(255,179,71,0.3)] font-bold" : "text-[#968a84] hover:text-white font-medium"
            )}
          >Warm</button>
          <button
            onClick={() => setSholzMode("formal")}
            className={cn(
              "px-6 py-2 rounded-full wm-mono text-xs tracking-wide uppercase transition-all duration-300",
              sholzMode === "formal" ? "text-[#0d0b0a] bg-[#ffb347] shadow-[0_0_10px_rgba(255,179,71,0.3)] font-bold" : "text-[#968a84] hover:text-white font-medium"
            )}
          >Formal</button>
        </div>
        <div className="rounded-2xl p-5 max-w-lg relative" style={{ background: "linear-gradient(135deg, #1e1916, #0d0b0a)", border: "1px solid rgba(255,179,71,0.2)", boxShadow: "0 4px 20px rgba(255,179,71,0.05)" }}>
          <div className="absolute -top-3 -left-3 w-8 h-8 rounded-lg bg-[#ffb347] flex items-center justify-center border border-[#e67e22] shadow-[0_0_20px_rgba(255,179,71,0.15)]">
            <svg viewBox="0 0 40 40" fill="none" className="w-5 h-5 mt-1">
              <path d="M10 18 h20 v8 h-20 z" fill="#0d0b0a" />
              <path d="M15 32 Q 20 36, 25 32" stroke="#0d0b0a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-sm text-white/90 leading-relaxed pl-4 pt-1">
            {sholzMode === "warm"
              ? "\"Yo! I'm Sholz, your money conscience with better jokes. Ask me anything about your finances, or let me roast your spending habits.\""
              : "\"Good day. I am Sholz, your personal financial advisor. I am here to provide structured, data-driven insights to help you achieve your financial objectives.\""}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Notifications Tab ───────────────────────────────────────────────────

function NotificationsTab() {
  const [pushToggles, setPushToggles] = React.useState({
    transactions: true,
    weekly: true,
    goals: true,
    blackTax: true,
    japaScore: true,
    sholzTips: false,
  });
  const [emailToggles, setEmailToggles] = React.useState({
    monthlyReport: true,
    marketing: false,
  });
  const [quietFrom, setQuietFrom] = React.useState("22:00");
  const [quietTo, setQuietTo] = React.useState("07:00");

  const togglePush = (key: string) => setPushToggles((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  const toggleEmail = (key: string) => setEmailToggles((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  const pushItems = [
    { key: "transactions", label: "Transaction alerts" },
    { key: "weekly", label: "Weekly spending summary" },
    { key: "goals", label: "Goal milestones" },
    { key: "blackTax", label: "Black Tax reminders" },
    { key: "japaScore", label: "Japa Score updates" },
    { key: "sholzTips", label: "Sholz tips & insights" },
  ];

  return (
    <div className="space-y-10 relative z-10">
      <div>
        <h3 className="wm-heading text-lg text-white mb-6 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          Push Notifications
        </h3>
        <div className="bg-black/20 border border-white/5 rounded-2xl p-2 flex flex-col">
          {pushItems.map((item, i) => (
            <React.Fragment key={item.key}>
              <label className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl cursor-pointer transition-colors group" onClick={() => togglePush(item.key)}>
                <span className="text-sm text-white/90 group-hover:text-white">{item.label}</span>
                <Toggle isOn={pushToggles[item.key as keyof typeof pushToggles]} onChange={() => togglePush(item.key)} />
              </label>
              {i < pushItems.length - 1 && <div className="h-px w-full bg-white/5" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div>
        <h3 className="wm-heading text-lg text-white mb-6 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          Email Notifications
        </h3>
        <div className="bg-black/20 border border-white/5 rounded-2xl p-2 flex flex-col">
          <label className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl cursor-pointer transition-colors group" onClick={() => toggleEmail("monthlyReport")}>
            <span className="text-sm text-white/90 group-hover:text-white">Monthly financial report</span>
            <Toggle isOn={emailToggles.monthlyReport} onChange={() => toggleEmail("monthlyReport")} />
          </label>
          <div className="h-px w-full bg-white/5" />
          <label className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl cursor-pointer transition-colors group" onClick={() => toggleEmail("marketing")}>
            <span className="text-sm text-white/90 group-hover:text-white">Marketing & updates</span>
            <Toggle isOn={emailToggles.marketing} onChange={() => toggleEmail("marketing")} />
          </label>
          <div className="h-px w-full bg-white/5" />
          <label className="flex items-center justify-between p-4 rounded-xl cursor-not-allowed transition-colors group">
            <span className="text-sm text-white/90">Security alerts <span className="text-[10px] text-[#968a84] wm-mono ml-2 uppercase">(Required)</span></span>
            <Toggle isOn={true} onChange={() => {}} disabled={true} />
          </label>
        </div>
      </div>

      <div>
        <h3 className="wm-heading text-lg text-white mb-4 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
          Quiet Hours
        </h3>
        <div className="flex items-center gap-4 bg-black/20 border border-white/5 rounded-2xl p-5 max-w-md">
          <div className="flex-1 flex flex-col gap-2">
            <label className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest pl-1">From</label>
            <input type="time" value={quietFrom} onChange={(e) => setQuietFrom(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-[#ffb347]/50 focus:outline-none focus:bg-white/10 transition-all wm-mono text-sm" style={{ colorScheme: "dark" }} />
          </div>
          <span className="text-[#968a84] mt-6">-</span>
          <div className="flex-1 flex flex-col gap-2">
            <label className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest pl-1">To</label>
            <input type="time" value={quietTo} onChange={(e) => setQuietTo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-[#ffb347]/50 focus:outline-none focus:bg-white/10 transition-all wm-mono text-sm" style={{ colorScheme: "dark" }} />
          </div>
        </div>
        <p className="wm-mono text-[10px] text-[#968a84] mt-2 pl-1">Sholz will not disturb you during these hours unless it&apos;s a security alert.</p>
      </div>
    </div>
  );
}

// ── Connected Accounts Tab ──────────────────────────────────────────────

function AccountsTab() {
  return (
    <div className="space-y-10 relative z-10">
      <div>
        <h3 className="wm-heading text-lg text-white mb-6 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          Linked Bank Accounts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { code: "AB", name: "Access Bank", acct: "****4532", color: "bg-orange-600/20 text-orange-500" },
            { code: "GT", name: "GTBank", acct: "****8891", color: "bg-orange-500/20 text-orange-400" },
          ].map((bank) => (
            <div key={bank.name} className="bg-black/20 border border-white/10 rounded-2xl p-5 flex items-center justify-between group hover:border-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold wm-mono", bank.color)}>{bank.code}</div>
                <div>
                  <p className="text-sm font-medium text-white">{bank.name}</p>
                  <p className="wm-mono text-xs text-[#968a84]">{bank.acct}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="flex items-center gap-1 wm-mono text-[10px] text-[#34d399] uppercase tracking-wider bg-[#34d399]/10 px-2 py-0.5 rounded border border-[#34d399]/20">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> Active
                </span>
                <button className="text-[10px] wm-mono text-[#968a84] hover:text-[#ef4444] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Disconnect</button>
              </div>
            </div>
          ))}
          <button className="bg-white/5 border border-dashed border-white/20 hover:border-[#ffb347]/50 hover:bg-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 transition-colors min-h-[88px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            <span className="wm-mono text-xs text-[#968a84] uppercase tracking-wider">Link New Account</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="wm-heading text-lg text-white mb-6">Other Integrations</h3>
        <div className="flex flex-col gap-3">
          {[
            { code: "PV", name: "PiggyVest", color: "bg-blue-600/20 text-blue-500", connected: true },
            { code: "CW", name: "CowryWise", color: "bg-indigo-600/20 text-indigo-400", connected: true },
            { code: "G", name: "Google Pay", color: "bg-white/10 text-white", connected: false },
          ].map((int) => (
            <div key={int.name} className={cn("bg-black/20 border border-white/5 rounded-2xl p-4 flex items-center justify-between", !int.connected && "opacity-70 hover:opacity-100 transition-opacity")}>
              <div className="flex items-center gap-4">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold wm-mono text-xs", int.color)}>{int.code}</div>
                <span className="text-sm font-medium text-white">{int.name}</span>
              </div>
              <button className={cn("px-4 py-1.5 rounded-lg text-xs wm-mono transition-colors", int.connected ? "border border-white/10 text-[#968a84] hover:text-white hover:bg-white/5" : "bg-white/10 text-white hover:bg-white/20")}>
                {int.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Privacy Tab ─────────────────────────────────────────────────────────

function PrivacyTab() {
  const [privacyToggles, setPrivacyToggles] = React.useState({
    shareAnonymized: true,
    thirdPartyAnalytics: false,
    personalizedAI: true,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const togglePrivacy = (key: string) => setPrivacyToggles((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  return (
    <div className="space-y-10 relative z-10">
      <div>
        <h3 className="wm-heading text-lg text-white mb-6 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Privacy Settings
        </h3>
        <div className="bg-black/20 border border-white/5 rounded-2xl p-2 flex flex-col">
          {[
            { key: "shareAnonymized", label: "Share anonymized data for app improvements", sub: "Help us make Sholz smarter." },
            { key: "thirdPartyAnalytics", label: "Allow third-party analytics", sub: "Used for crash reporting and tracking." },
            { key: "personalizedAI", label: "Personalized AI responses", sub: "Sholz will remember past context to give better advice." },
          ].map((item, i, arr) => (
            <React.Fragment key={item.key}>
              <label className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl cursor-pointer transition-colors group" onClick={() => togglePrivacy(item.key)}>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white/90 group-hover:text-white">{item.label}</span>
                  <span className="wm-mono text-[10px] text-[#968a84]">{item.sub}</span>
                </div>
                <Toggle isOn={privacyToggles[item.key as keyof typeof privacyToggles]} onChange={() => togglePrivacy(item.key)} />
              </label>
              {i < arr.length - 1 && <div className="h-px w-full bg-white/5" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-white/5" />

      <div className="pt-2">
        <h3 className="wm-heading text-lg mb-4 flex items-center gap-2 text-[#ef4444]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          Danger Zone
        </h3>
        <div className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", boxShadow: "0 0 20px rgba(239,68,68,0.05)" }}>
          <div>
            <p className="text-sm font-medium text-white mb-1">Delete Account</p>
            <p className="wm-mono text-[10px] text-[#968a84]/80 max-w-sm">Once you delete your account, there is no going back. Please be certain. All data and AI context will be permanently wiped.</p>
          </div>
          <button onClick={() => setShowDeleteConfirm(true)} className="px-5 py-2.5 bg-[#ef4444]/20 hover:bg-[#ef4444] text-[#ef4444] hover:text-white wm-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all border border-[#ef4444]/30 shrink-0">
            Delete Account
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-[#1a0f0f] border border-[#ef4444]/30 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h4 className="wm-heading text-xl text-white mb-2">Are you sure?</h4>
            <p className="wm-mono text-xs text-[#968a84] mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white wm-mono text-xs uppercase rounded-xl transition-all border border-white/10">Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-[#ef4444] hover:bg-red-700 text-white wm-mono text-xs uppercase rounded-xl transition-all font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Billing Tab ─────────────────────────────────────────────────────────

function BillingTab() {
  return (
    <div className="space-y-10 relative z-10">
      <div className="rounded-[24px] p-8 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a130c, #0d0b0a)", border: "1px solid rgba(255,179,71,0.3)", boxShadow: "0 0 20px rgba(255,179,71,0.15)" }}>
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full" style={{ background: "rgba(255,179,71,0.10)", filter: "blur(48px)" }} />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="wm-heading text-2xl text-white">Puff Premium</h3>
              <span className="wm-mono text-[10px] uppercase tracking-wider bg-[#ffb347]/20 text-[#ffb347] px-2 py-0.5 rounded border border-[#ffb347]/30">Active</span>
            </div>
            <p className="wm-mono text-xl text-white font-bold tracking-tight mb-1">N2,500<span className="text-sm text-[#968a84] font-normal"> / month</span></p>
            <p className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest">Renews Dec 31, 2025</p>
          </div>
          <button className="px-6 py-2.5 bg-[#ffb347] hover:bg-[#e67e22] text-[#0d0b0a] wm-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,179,71,0.15)] whitespace-nowrap">
            Manage Subscription
          </button>
        </div>
        <div className="h-px w-full my-6" style={{ background: "rgba(255,179,71,0.1)" }} />
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
          {["Unlimited AI Sholz chats", "Advanced Japa Score tracking", "Black Tax analytics", "Custom financial reports"].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-white/80">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="wm-heading text-lg text-white mb-4">Payment Method</h3>
        <div className="bg-black/20 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center relative overflow-hidden px-1">
              <div className="w-4 h-4 rounded-full bg-red-500 absolute left-2 opacity-80" style={{ mixBlendMode: "multiply" }} />
              <div className="w-4 h-4 rounded-full bg-yellow-500 absolute left-5 opacity-80" style={{ mixBlendMode: "multiply" }} />
            </div>
            <div>
              <p className="wm-mono text-sm font-bold text-white tracking-widest">**** **** **** 4242</p>
              <p className="wm-mono text-[10px] text-[#968a84] uppercase">Expires 12/26</p>
            </div>
          </div>
          <button className="wm-mono text-xs text-[#ffb347] hover:underline">Update Card</button>
        </div>
      </div>

      <div className="h-px w-full bg-white/5" />

      <div>
        <h3 className="wm-heading text-lg text-white mb-4">Billing History</h3>
        <div className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="py-3 px-5 wm-mono text-[10px] text-[#968a84] uppercase tracking-widest font-normal">Date</th>
                <th className="py-3 px-5 wm-mono text-[10px] text-[#968a84] uppercase tracking-widest font-normal">Amount</th>
                <th className="py-3 px-5 wm-mono text-[10px] text-[#968a84] uppercase tracking-widest font-normal hidden sm:table-cell">Status</th>
                <th className="py-3 px-5 wm-mono text-[10px] text-[#968a84] uppercase tracking-widest font-normal text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="wm-mono text-xs text-white">
              {[{ date: "Nov 1, 2025", amount: "N2,500" }, { date: "Oct 1, 2025", amount: "N2,500" }, { date: "Sep 1, 2025", amount: "N2,500" }].map((row, i, arr) => (
                <tr key={row.date} className={cn("hover:bg-white/[0.02] transition-colors", i < arr.length - 1 && "border-b border-white/5")}>
                  <td className="py-4 px-5">{row.date}</td>
                  <td className="py-4 px-5">{row.amount}</td>
                  <td className="py-4 px-5 hidden sm:table-cell"><span className="bg-[#34d399]/10 text-[#34d399] px-2 py-0.5 rounded uppercase text-[9px] border border-[#34d399]/20">Paid</span></td>
                  <td className="py-4 px-5 text-right">
                    <button className="text-[#ffb347] hover:text-white transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button className="wm-mono text-[10px] text-[#968a84] hover:text-[#ef4444] uppercase tracking-widest transition-colors">
          Cancel Subscription
        </button>
      </div>
    </div>
  );
}

// ── Main Settings Page ──────────────────────────────────────────────────

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "preferences", label: "Preferences" },
  { id: "notifications", label: "Notifications" },
  { id: "accounts", label: "Connected Accounts" },
  { id: "privacy", label: "Data & Privacy" },
  { id: "billing", label: "Subscription & Billing" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("profile");

  const renderTab = () => {
    switch (activeTab) {
      case "profile": return <ProfileTab />;
      case "preferences": return <PreferencesTab />;
      case "notifications": return <NotificationsTab />;
      case "accounts": return <AccountsTab />;
      case "privacy": return <PrivacyTab />;
      case "billing": return <BillingTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="wm-heading text-4xl text-white">Settings</h1>
        <p className="wm-mono text-sm uppercase tracking-widest text-[#968a84]">
          Customize Your Experience
        </p>
      </header>

      <div
        className="flex overflow-x-auto gap-2 pb-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", scrollbarWidth: "none" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-2.5 rounded-xl wm-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "border bg-[#ffb347]/10 text-[#ffb347] border-[#ffb347]/30 shadow-[0_0_20px_rgba(255,179,71,0.15)]"
                : "border border-transparent bg-white/5 text-[#968a84] hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden wm-glass !border-white/10"
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-128px",
            right: "-128px",
            width: "256px",
            height: "256px",
            background: "rgba(255,179,71,0.05)",
            filter: "blur(48px)",
            borderRadius: "50%",
          }}
        />
        {renderTab()}
      </div>
    </div>
  );
}
