"use client";

import { useState } from "react";
import { WmSettingsProfile } from "@/components/wm/wm-settings-profile";
import { WmSettingsPreferences } from "@/components/wm/wm-settings-preferences";
import { WmSettingsNotifications } from "@/components/wm/wm-settings-notifications";
import { WmSettingsConnectedAccounts } from "@/components/wm/wm-settings-connected-accounts";
import { WmSettingsDataPrivacy } from "@/components/wm/wm-settings-data-privacy";
import { WmSettingsSubscription } from "@/components/wm/wm-settings-subscription";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "preferences", label: "Preferences" },
  { id: "notifications", label: "Notifications" },
  { id: "accounts", label: "Connected Accounts" },
  { id: "subscription", label: "Subscription" },
  { id: "privacy", label: "Data & Privacy" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl text-white"
          style={{ fontFamily: "DynaPuff, cursive" }}
        >
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#968a84]">
          Manage your account, preferences, and connected services.
        </p>
      </div>

      {/* Tab navigation */}
      <div
        className="flex gap-1 overflow-x-auto rounded-xl p-1"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all"
            style={{
              background:
                activeTab === tab.id
                  ? "rgba(255,179,71,0.15)"
                  : "transparent",
              color: activeTab === tab.id ? "#ffb347" : "#968a84",
              border:
                activeTab === tab.id
                  ? "1px solid rgba(255,179,71,0.3)"
                  : "1px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "profile" && <WmSettingsProfile />}
        {activeTab === "preferences" && <WmSettingsPreferences />}
        {activeTab === "notifications" && <WmSettingsNotifications />}
        {activeTab === "accounts" && <WmSettingsConnectedAccounts />}
        {activeTab === "subscription" && <WmSettingsSubscription />}
        {activeTab === "privacy" && <WmSettingsDataPrivacy />}
      </div>
    </div>
  );
}
