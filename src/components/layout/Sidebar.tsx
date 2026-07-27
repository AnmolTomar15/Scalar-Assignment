"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Video, 
  FolderKanban, 
  Settings, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  ShieldCheck,
  Zap
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Your Meetings", href: "/meetings", icon: Video },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0 z-40 shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/60">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              Minute<span className="text-indigo-400">AI</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">v1.1</span>
            </h1>
            <p className="text-xs text-slate-400">Meeting Notes & Intelligence</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Integration Status Box */}
        <div className="mx-3 mt-4 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-1">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            AI Processing Engine
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Multi-stage diarization and summary extraction online.
          </p>
        </div>
      </div>

      {/* Footer Utility Links */}
      <div className="p-4 border-t border-slate-800/60 space-y-3">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          Utilities
        </div>
        <div className="space-y-1 text-xs text-slate-400">
          <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800/40 transition-colors">
            <FileText className="h-3.5 w-3.5" />
            Documentation
          </a>
          <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800/40 transition-colors">
            <HelpCircle className="h-3.5 w-3.5" />
            Help Center
          </a>
          <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800/40 transition-colors">
            <ShieldCheck className="h-3.5 w-3.5" />
            Privacy & Trust
          </a>
        </div>

        {/* User Card */}
        <div className="pt-2 flex items-center gap-2.5 border-t border-slate-800/50">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Alex Rivera"
            className="h-8 w-8 rounded-full border border-indigo-500/40 object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-200 truncate">Alex Rivera</div>
            <div className="text-[10px] text-slate-400 truncate">Product Lead</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
