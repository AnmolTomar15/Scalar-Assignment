"use client";

import Link from "next/link";
import { MeetingCard as MeetingCardType } from "@/types";
import { Clock, Users, ChevronRight, Sparkles, Trash2, ArrowRight } from "lucide-react";

interface MeetingCardProps {
  meeting: MeetingCardType;
  onDelete: (id: string) => void;
}

export default function MeetingCard({ meeting, onDelete }: MeetingCardProps) {
  const isProcessing = meeting.status === "Processing";

  const categoryColors: Record<string, string> = {
    Product: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    Technical: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Internal: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Client: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min${mins === 1 ? "" : "s"}`;
  };

  return (
    <div className="group relative rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 p-5 transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between">
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${categoryColors[meeting.category] || categoryColors.Internal}`}>
              {meeting.category}
            </span>

            {/* Status Badge */}
            {isProcessing ? (
              <span className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                Processing
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Transcribed
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(meeting.id);
            }}
            title="Delete Meeting"
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        <Link href={`/meetings/${meeting.id}`}>
          <h3 className="font-semibold text-base text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1.5">
            {meeting.title}
          </h3>
        </Link>

        {/* Date & Duration */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
          <span>{meeting.date}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {formatDuration(meeting.duration_seconds)}
          </span>
        </div>

        {/* Micro-status preview for processing OR summary preview */}
        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 mb-4 min-h-[58px]">
          {isProcessing ? (
            <div className="flex items-center gap-2.5 text-xs text-amber-300/90">
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0 animate-spin" />
              <span className="line-clamp-2 italic">{meeting.micro_status || "Analyzing AI Insights..."}</span>
            </div>
          ) : (
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              {meeting.summary_preview || "AI Summary available inside detail workspace."}
            </p>
          )}
        </div>
      </div>

      {/* Footer Card Row */}
      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-1">
        {/* Participant Avatars */}
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-2">
            {meeting.participants.slice(0, 3).map((p, idx) => (
              <img
                key={idx}
                src={p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`}
                alt={p.name}
                title={`${p.name} (${p.role || 'Participant'})`}
                className="h-6 w-6 rounded-full border border-slate-900 object-cover"
              />
            ))}
          </div>
          {meeting.participant_count > 3 && (
            <span className="text-[10px] font-medium text-slate-400 px-1.5 py-0.5 rounded-full bg-slate-800">
              +{meeting.participant_count - 3}
            </span>
          )}
        </div>

        {/* View Action Link */}
        <Link
          href={`/meetings/${meeting.id}`}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors"
        >
          {isProcessing ? "View Pipeline" : "View Notes"}
          <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
