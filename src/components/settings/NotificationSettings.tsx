"use client";

import { useState, useEffect } from "react";
import { UserSettings } from "@/types";
import { fetchNotificationSettings, updateNotificationSettings } from "@/lib/api";
import { Bell, Save, Check } from "lucide-react";

export default function NotificationSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [notifySummaries, setNotifySummaries] = useState(true);
  const [notifyAssignments, setNotifyAssignments] = useState(true);
  const [notifyMentions, setNotifyMentions] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchNotificationSettings().then((s) => {
      setSettings(s);
      setNotifySummaries(s.notify_summaries);
      setNotifyAssignments(s.notify_assignments);
      setNotifyMentions(s.notify_mentions);
      setNotifyWeeklyDigest(s.notify_weekly_digest);
    }).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateNotificationSettings({
        notify_summaries: notifySummaries,
        notify_assignments: notifyAssignments,
        notify_mentions: notifyMentions,
        notify_weekly_digest: notifyWeeklyDigest,
      });
      setSettings(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Error updating notification settings:", err);
    }
  };

  if (!settings) {
    return <div className="text-xs text-slate-500 py-8">Loading notification preferences...</div>;
  }

  const toggles = [
    {
      label: "Meeting Summary Ready",
      description: "Receive email notification as soon as a meeting transcript summary finishes processing.",
      value: notifySummaries,
      onChange: setNotifySummaries,
    },
    {
      label: "Action Item Assignments",
      description: "Get notified when an action item or task owner is assigned to you.",
      value: notifyAssignments,
      onChange: setNotifyAssignments,
    },
    {
      label: "Speaker Mentions",
      description: "Receive alerts when your name or role is highlighted in transcript key moments.",
      value: notifyMentions,
      onChange: setNotifyMentions,
    },
    {
      label: "Weekly Executive Digest",
      description: "Receive a compiled Monday email with key topics and pending action items across all meetings.",
      value: notifyWeeklyDigest,
      onChange: setNotifyWeeklyDigest,
    },
  ];

  return (
    <form onSubmit={handleSave} className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="h-9 w-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-base text-white">Notification Preferences</h3>
          <p className="text-xs text-slate-400">Customize how and when MinuteAI alerts you about meeting outcomes.</p>
        </div>
      </div>

      <div className="space-y-4">
        {toggles.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800"
          >
            <div className="space-y-0.5 max-w-md">
              <div className="text-xs font-semibold text-white">{item.label}</div>
              <div className="text-[11px] text-slate-400 leading-relaxed">{item.description}</div>
            </div>

            {/* Switch Toggle */}
            <button
              type="button"
              onClick={() => item.onChange(!item.value)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                item.value ? "bg-indigo-600 justify-end" : "bg-slate-800 justify-start"
              }`}
            >
              <span className="h-4 w-4 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end border-t border-slate-800 pt-4">
        <button
          type="submit"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
        >
          {isSaved ? (
            <>
              <Check className="h-4 w-4 text-emerald-400" />
              Preferences Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </form>
  );
}
