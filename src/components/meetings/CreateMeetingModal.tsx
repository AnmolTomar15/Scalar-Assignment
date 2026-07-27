"use client";

import { useState } from "react";
import { X, Upload, CheckCircle2, Sparkles, Plus, UserPlus } from "lucide-react";
import { createMeeting } from "@/lib/api";
import { useRouter } from "next/navigation";

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ParticipantChip {
  name: string;
  role: string;
}

export default function CreateMeetingModal({ isOpen, onClose, onSuccess }: CreateMeetingModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Product");
  const [participantName, setParticipantName] = useState("");
  const [participantRole, setParticipantRole] = useState("Product Lead");
  const [participants, setParticipants] = useState<ParticipantChip[]>([
    { name: "Alex Rivera", role: "Product Lead" },
    { name: "Sarah Chen", role: "Engineering Manager" }
  ]);
  
  const [rawTranscript, setRawTranscript] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddParticipant = () => {
    if (!participantName.trim()) return;
    setParticipants([...participants, { name: participantName.trim(), role: participantRole.trim() || "Participant" }]);
    setParticipantName("");
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setRawTranscript(text);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const newMeeting = await createMeeting({
        title: title.trim(),
        category,
        participants,
        raw_transcript: rawTranscript
      });
      
      onClose();
      if (onSuccess) onSuccess();
      router.push(`/meetings/${newMeeting.id}`);
    } catch (err) {
      console.error("Error creating meeting:", err);
      alert("Failed to create meeting. Please verify backend service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAIReady = rawTranscript.trim().length > 0 || fileName !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Create New Meeting
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
                AI Powered
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure your meeting details and AI transcript analysis.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Title & Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Meeting Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Q4 Platform Architecture & API Sync"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Product">Product</option>
                <option value="Technical">Technical</option>
                <option value="Internal">Internal</option>
                <option value="Client">Client</option>
              </select>
            </div>
          </div>

          {/* Participants section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Participants & Roles</label>
            
            {/* Participant Chips */}
            <div className="flex flex-wrap gap-2 mb-2">
              {participants.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl text-xs text-slate-200"
                >
                  <span className="font-semibold text-indigo-300">{p.name}</span>
                  <span className="text-[10px] text-slate-400">({p.role})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(idx)}
                    className="text-slate-400 hover:text-rose-400 ml-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Participant Row */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Participant Name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Role (e.g. Design Lead)"
                value={participantRole}
                onChange={(e) => setParticipantRole(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddParticipant}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Transcript Source */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Transcript Source</label>
              {isAIReady && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  AI Ready
                </span>
              )}
            </div>

            {/* Drag drop or file select */}
            <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 bg-slate-950/40 text-center transition-colors">
              <input
                type="file"
                accept=".txt,.vtt,.json"
                onChange={handleFileUpload}
                id="transcript-file"
                className="hidden"
              />
              <label htmlFor="transcript-file" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="h-6 w-6 text-indigo-400" />
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop transcript file (.txt, .vtt, .json)
                </div>
                {fileName && (
                  <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                    Attached: {fileName}
                  </span>
                )}
              </label>
            </div>

            {/* Direct Paste Fallback */}
            <div className="pt-2">
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Or paste raw transcript dialogue below:
              </label>
              <textarea
                rows={4}
                placeholder="Alex Rivera: Welcome team. Today we are reviewing API stability and database schemas..."
                value={rawTranscript}
                onChange={(e) => setRawTranscript(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Autosave messaging */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Draft saved automatically
            </span>
            <span>Est. Processing time ~15 seconds</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Creating Job...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Create & Start Analysis
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
