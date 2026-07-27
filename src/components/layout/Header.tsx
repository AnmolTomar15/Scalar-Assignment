"use client";

import { Bell, Search, Plus, Sparkles } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenCreateModal?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export default function Header({
  title,
  subtitle,
  onOpenCreateModal,
  searchValue = "",
  onSearchChange
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Global / Local Search Bar */}
        {onSearchChange !== undefined && (
          <div className="relative w-64 md:w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search meetings, transcripts..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        )}

        {/* Notifications Icon */}
        <button 
          title="Notifications"
          className="h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors relative"
        >
          <Bell className="h-4 w-4" />
          <span className="h-2 w-2 rounded-full bg-indigo-500 absolute top-2 right-2 animate-ping" />
          <span className="h-2 w-2 rounded-full bg-indigo-500 absolute top-2 right-2" />
        </button>

        {/* Create Meeting Button */}
        {onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="h-4 w-4" />
            New Meeting
          </button>
        )}
      </div>
    </header>
  );
}
