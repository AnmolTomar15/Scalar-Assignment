"use client";

import { useState } from "react";
import { TranscriptSegment } from "@/types";
import { Search, Bookmark, Clock, User, X } from "lucide-react";

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  onTimestampClick: (seconds: number) => void;
  activeTime?: number;
}

export default function TranscriptViewer({
  segments,
  onTimestampClick,
  activeTime = 0,
}: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const formatTimestamp = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Filter segments based on search query
  const filteredSegments = segments.filter((seg) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      seg.text.toLowerCase().includes(q) ||
      seg.speaker_name.toLowerCase().includes(q) ||
      (seg.speaker_role && seg.speaker_role.toLowerCase().includes(q))
    );
  });

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-amber-400/30 text-amber-200 px-0.5 rounded border-b border-amber-400 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full space-y-4">
      {/* Transcript Header & Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            Meeting Transcript
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {segments.length} segments
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Diarized dialogue with timestamps and key moment callouts.
          </p>
        </div>

        {/* Local Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Search results banner */}
      {searchQuery && (
        <div className="text-xs text-slate-400 px-1 flex items-center justify-between">
          <span>Found {filteredSegments.length} match{filteredSegments.length === 1 ? "" : "es"}</span>
        </div>
      )}

      {/* Transcript Stream */}
      <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
        {filteredSegments.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No dialogue matches your search query.
          </div>
        ) : (
          filteredSegments.map((seg) => {
            const isActive = activeTime >= seg.start_time && activeTime <= seg.end_time;

            return (
              <div key={seg.id} className="space-y-2">
                {/* Key Moment Marker */}
                {seg.is_key_moment && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl my-2">
                    <Bookmark className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span>{seg.key_moment_title || "Key Moment Marker"}</span>
                  </div>
                )}

                {/* Speaker Dialogue Card */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-500/10"
                      : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold text-xs">
                        {seg.speaker_name[0]}
                      </div>
                      <span className="font-semibold text-xs text-white">
                        {highlightMatch(seg.speaker_name, searchQuery)}
                      </span>
                      {seg.speaker_role && (
                        <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {highlightMatch(seg.speaker_role, searchQuery)}
                        </span>
                      )}
                    </div>

                    {/* Timestamp Trigger */}
                    <button
                      onClick={() => onTimestampClick(seg.start_time)}
                      className="flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20 transition-colors"
                    >
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(seg.start_time)}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal pl-8">
                    {highlightMatch(seg.text, searchQuery)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
