"use client";

import { KeyTopic } from "@/types";
import { Tag } from "lucide-react";

interface KeyTopicsCardProps {
  topics: KeyTopic[];
}

export default function KeyTopicsCard({ topics }: KeyTopicsCardProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <div className="h-7 w-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Tag className="h-4 w-4" />
        </div>
        <h3 className="font-bold text-sm text-white">Extracted Key Topics</h3>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {topics.map((t) => (
          <span
            key={t.id}
            className="text-xs font-semibold px-3 py-1 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-colors cursor-default"
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
