"use client";

import { useState } from "react";
import { Summary } from "@/types";
import { regenerateSummary } from "@/lib/api";
import { Sparkles, RefreshCw, Check } from "lucide-react";

interface AISummaryCardProps {
  meetingId: string;
  summary?: Summary;
  onSummaryUpdated: (updated: Summary) => void;
}

export default function AISummaryCard({ meetingId, summary, onSummaryUpdated }: AISummaryCardProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [justRegenerated, setJustRegenerated] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const updated = await regenerateSummary(meetingId);
      onSummaryUpdated(updated);
      setJustRegenerated(true);
      setTimeout(() => setJustRegenerated(false), 3000);
    } catch (err) {
      console.error("Error regenerating summary:", err);
      alert("Failed to regenerate summary");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 relative overflow-hidden">
      {/* Accent Background Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-sm text-white">AI Executive Summary</h3>
        </div>

        {/* Regenerate Action Button */}
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {isRegenerating ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Generating Pass...
            </>
          ) : justRegenerated ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Summary Updated
            </>
          ) : (
            <>
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        {summary?.overview_text || "Generating AI executive summary from meeting transcript..."}
      </p>

      {summary?.generated_by && (
        <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
          <span>Engine: {summary.generated_by}</span>
          <span>Last pass: {new Date(summary.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}
    </div>
  );
}
