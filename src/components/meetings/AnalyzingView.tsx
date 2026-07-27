"use client";

import { useEffect, useState } from "react";
import { MeetingDetail } from "@/types";
import { advanceProcessingStage } from "@/lib/api";
import { CheckCircle2, Loader2, Sparkles, Cpu, Layers, ArrowRight } from "lucide-react";

interface AnalyzingViewProps {
  meeting: MeetingDetail;
  onProcessingComplete: () => void;
}

export default function AnalyzingView({ meeting, onProcessingComplete }: AnalyzingViewProps) {
  const [currentStage, setCurrentStage] = useState(meeting.processing_stage || 1);
  const [subStatusIndex, setSubStatusIndex] = useState(0);

  const subStatusMessages = [
    "Detecting speaker sentiment and dialogue pacing...",
    "Mapping assignable action items and target owners...",
    "Finalizing structured executive summary and key topic chips..."
  ];

  // Auto-advance stages every 3.5 seconds to demonstrate real-time pipeline progress
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const updated = await advanceProcessingStage(meeting.id);
        setCurrentStage(updated.processing_stage);
        if (updated.status === "Transcribed") {
          clearInterval(timer);
          onProcessingComplete();
        }
      } catch (err) {
        console.error("Error advancing processing stage:", err);
      }
    }, 4000);

    const subTimer = setInterval(() => {
      setSubStatusIndex((prev) => (prev + 1) % subStatusMessages.length);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(subTimer);
    };
  }, [meeting.id, onProcessingComplete]);

  const stages = [
    {
      id: 1,
      title: "Audio Transcribed",
      subtitle: "Raw transcript text ingested & normalized",
      icon: Cpu,
    },
    {
      id: 2,
      title: "Speaker Labeling & Diarization",
      subtitle: "Identified voice signatures and matched team roles",
      icon: Layers,
    },
    {
      id: 3,
      title: "Insight & Action Extraction",
      subtitle: "AI models parsing key moments, summaries & action items",
      icon: Sparkles,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="h-4 w-4 animate-spin text-indigo-400" />
          AI Processing Pipeline Active
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Analyzing "{meeting.title}"
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Please wait while MinuteAI runs voice diarization, parses transcript timestamps, and extracts key executive insights.
        </p>
      </div>

      {/* Multi-stage Progress Pipeline Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {stages.map((stage, idx) => {
            const isDone = currentStage > stage.id;
            const isCurrent = currentStage === stage.id;
            const isPending = currentStage < stage.id;
            const StageIcon = stage.icon;

            return (
              <div key={stage.id} className="relative flex items-start gap-5">
                {/* Connecting vertical line */}
                {idx < stages.length - 1 && (
                  <div
                    className={`absolute left-6 top-12 bottom-0 w-0.5 -mb-8 transition-colors duration-500 ${
                      isDone ? "bg-indigo-500" : "bg-slate-800"
                    }`}
                  />
                )}

                {/* Stage Status Icon Badge */}
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isDone
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : isCurrent
                      ? "bg-indigo-500/20 border-2 border-indigo-500 text-indigo-300 ring-4 ring-indigo-500/10"
                      : "bg-slate-950 border border-slate-800 text-slate-400"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : isCurrent ? (
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                  ) : (
                    <StageIcon className="h-5 w-5" />
                  )}
                </div>

                {/* Stage Info */}
                <div className="flex-1 pt-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-base ${isPending ? "text-slate-400" : "text-white"}`}>
                      {stage.title}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isDone
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : isCurrent
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isDone ? "Completed" : isCurrent ? "Processing..." : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{stage.subtitle}</p>

                  {/* Sub-status live detail during Stage 3 / current stage */}
                  {isCurrent && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-indigo-300 font-mono flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                      <span>{subStatusMessages[subStatusIndex]}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Immediate Skip / Manual Complete Action */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Automatic transition when ready...</span>
          <button
            onClick={onProcessingComplete}
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
          >
            Open Workspace Now
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
