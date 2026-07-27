"use client";

import { Share2, Video, MessageSquare, ExternalLink } from "lucide-react";

export default function IntegrationsSettings() {
  const integrations = [
    {
      name: "Zoom",
      description: "Auto-join scheduled Zoom calls and import meeting recordings automatically.",
      category: "Video Conferencing",
      icon: Video,
    },
    {
      name: "Google Meet",
      description: "Seamless Google Calendar sync with automated transcription bot in-call.",
      category: "Video Conferencing",
      icon: Video,
    },
    {
      name: "Microsoft Teams",
      description: "Capture Teams meeting audio stream and publish AI executive summaries.",
      category: "Video Conferencing",
      icon: Video,
    },
    {
      name: "Slack",
      description: "Post generated action items and summary digests to dedicated Slack channels.",
      category: "Team Messaging",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="h-9 w-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Share2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-base text-white">Integrations & Connected Apps</h3>
          <p className="text-xs text-slate-400">Connect video tools and communication channels for automated ingest.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((app) => {
          const Icon = app.icon;
          return (
            <div
              key={app.name}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm text-white">{app.name}</span>
                  </div>

                  {/* Coming Soon Badge */}
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{app.description}</p>
              </div>

              {/* Disabled Connect Button */}
              <button
                disabled
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed"
              >
                Connect App
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
