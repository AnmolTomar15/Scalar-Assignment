"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import ProfileSettings from "@/components/settings/ProfileSettings";
import IntegrationsSettings from "@/components/settings/IntegrationsSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import DangerZoneSettings from "@/components/settings/DangerZoneSettings";
import LLMSettings from "@/components/settings/LLMSettings";
import { User, Share2, Bell, AlertTriangle, Bot } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "integrations" | "ai" | "notifications" | "danger">("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "integrations", label: "Integrations", icon: Share2 },
    { id: "ai", label: "AI Provider", icon: Bot },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle, isDanger: true },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header
        title="Settings Workspace"
        subtitle="Manage account preferences, integrations, notifications, and danger zone."
      />

      <div className="p-6 max-w-5xl mx-auto w-full space-y-6 flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? tab.isDanger
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? (tab.isDanger ? "text-rose-400" : "text-indigo-400") : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        <div className="pt-2">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "integrations" && <IntegrationsSettings />}
          {activeTab === "ai" && <LLMSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "danger" && <DangerZoneSettings />}
        </div>
      </div>
    </div>
  );
}
