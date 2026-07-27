"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw } from "lucide-react";

interface AudioPlayerProps {
  mediaUrl?: string;
  durationSeconds: number;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

export default function AudioPlayer({
  durationSeconds,
  currentTime,
  onSeek,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center gap-4">
      {/* Play / Skip Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onSeek(Math.max(0, currentTime - 10))}
          title="Rewind 10s"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          onClick={handleTogglePlay}
          className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
        </button>

        <button
          onClick={() => onSeek(Math.min(durationSeconds, currentTime + 10))}
          title="Forward 10s"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar & Seek */}
      <div className="flex-1 w-full space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(durationSeconds)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={durationSeconds || 1800}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Volume Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
