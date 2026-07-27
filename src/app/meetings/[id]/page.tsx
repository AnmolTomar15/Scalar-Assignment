"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MeetingDetail, Summary } from "@/types";
import { fetchMeetingDetail, deleteMeeting } from "@/lib/api";
import Header from "@/components/layout/Header";
import AnalyzingView from "@/components/meetings/AnalyzingView";
import AudioPlayer from "@/components/meetings/AudioPlayer";
import TranscriptViewer from "@/components/meetings/TranscriptViewer";
import AISummaryCard from "@/components/meetings/AISummaryCard";
import KeyTopicsCard from "@/components/meetings/KeyTopicsCard";
import ActionItemsCard from "@/components/meetings/ActionItemsCard";
import { 
  ArrowLeft, 
  Trash2, 
  Download, 
  Sparkles, 
  Clock, 
  Tag, 
  CheckCircle2, 
  FileText,
  Share2
} from "lucide-react";
import Link from "next/link";

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Audio seek state
  const [currentTime, setCurrentTime] = useState(0);

  const loadDetail = async () => {
    try {
      const data = await fetchMeetingDetail(meetingId);
      setMeeting(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load meeting workspace.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (meetingId) loadDetail();
  }, [meetingId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await deleteMeeting(meetingId);
      router.push("/meetings");
    } catch (err) {
      console.error("Error deleting meeting:", err);
    }
  };

  // Download Transcript / Export text
  const handleExport = (format: "txt" | "md" | "json") => {
    if (!meeting) return;
    let content = "";
    let filename = `${meeting.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
    let type = "text/plain";

    if (format === "json") {
      content = JSON.stringify(meeting, null, 2);
      type = "application/json";
    } else if (format === "md") {
      content = `# ${meeting.title}\nDate: ${meeting.date}\nCategory: ${meeting.category}\n\n## AI Executive Summary\n${meeting.summary?.overview_text || ""}\n\n## Action Items\n${meeting.action_items.map(a => `- [${a.is_completed ? 'x' : ' '}] ${a.title} (${a.assignee_name} - ${a.due_date || 'No due date'})`).join("\n")}\n\n## Transcript\n${meeting.transcript_segments.map(s => `**[${s.speaker_name} (${s.speaker_role || 'Participant'})]**: ${s.text}`).join("\n\n")}`;
    } else {
      content = `${meeting.title}\nDate: ${meeting.date}\nCategory: ${meeting.category}\n\nSUMMARY:\n${meeting.summary?.overview_text || ""}\n\nTRANSCRIPT:\n${meeting.transcript_segments.map(s => `${s.speaker_name}: ${s.text}`).join("\n")}`;
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
        <Sparkles className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400 font-medium mt-3">Loading meeting workspace...</p>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex-1 p-8 text-center space-y-4">
        <p className="text-sm text-rose-400">{error || "Meeting not found"}</p>
        <Link href="/meetings" className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Render Analyzing View if status is still Processing
  if (meeting.status === "Processing") {
    return (
      <div className="flex-1 flex flex-col min-h-screen">
        <Header title={meeting.title} subtitle="In-progress AI Analysis" />
        <AnalyzingView meeting={meeting} onProcessingComplete={loadDetail} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-12">
      <Header title={meeting.title} subtitle={`${meeting.category} • ${meeting.date}`} />

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* Workspace Toolbar Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/meetings"
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {meeting.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Transcribed & Analyzed
                </span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight mt-1">{meeting.title}</h1>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Export Dropdown / Buttons */}
            <button
              onClick={() => handleExport("md")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              Export .MD
            </button>
            <button
              onClick={() => handleExport("txt")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-cyan-400" />
              Export .TXT
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              title="Delete Meeting"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Media Player Sync Bar */}
        <AudioPlayer
          durationSeconds={meeting.duration_seconds}
          currentTime={currentTime}
          onSeek={(t) => setCurrentTime(t)}
        />

        {/* Workspace Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Dialogue Transcript Stream (7 Cols) */}
          <div className="lg:col-span-7 h-full">
            <TranscriptViewer
              segments={meeting.transcript_segments}
              onTimestampClick={(t) => setCurrentTime(t)}
              activeTime={currentTime}
            />
          </div>

          {/* Right Panel: AI Intelligence Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* AI Executive Summary */}
            <AISummaryCard
              meetingId={meeting.id}
              summary={meeting.summary}
              onSummaryUpdated={(updatedSummary) => {
                setMeeting({ ...meeting, summary: updatedSummary });
              }}
            />

            {/* Key Topics */}
            <KeyTopicsCard topics={meeting.key_topics} />

            {/* Action Items Manager */}
            <ActionItemsCard
              meetingId={meeting.id}
              items={meeting.action_items}
              onItemsChanged={loadDetail}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
