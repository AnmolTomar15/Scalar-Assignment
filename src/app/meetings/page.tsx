"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import MeetingCard from "@/components/meetings/MeetingCard";
import CreateMeetingModal from "@/components/meetings/CreateMeetingModal";
import { MeetingCard as MeetingCardType } from "@/types";
import { fetchMeetings, deleteMeeting } from "@/lib/api";
import { Filter, ArrowUpDown, Upload, Sparkles, RefreshCw } from "lucide-react";

export default function MeetingsDashboard() {
  const [meetings, setMeetings] = useState<MeetingCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const data = await fetchMeetings({
        query: searchQuery,
        category: selectedCategory === "All" ? undefined : selectedCategory,
        status: selectedStatus === "All" ? undefined : selectedStatus,
        sort_by: sortBy,
      });
      setMeetings(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load meetings. Ensure backend service is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

  const handleDeleteMeeting = async (id: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await deleteMeeting(id);
      loadMeetings();
    } catch (err) {
      console.error("Error deleting meeting:", err);
      alert("Failed to delete meeting");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header
        title="Your Meetings"
        subtitle="Searchable repository for past transcripts, AI summaries, and action items."
        onOpenCreateModal={() => setIsModalOpen(true)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="p-6 space-y-6 flex-1 max-w-7xl mx-auto w-full">
        {/* Controls & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
              <Filter className="h-3.5 w-3.5" />
              Category:
            </span>
            {["All", "Product", "Technical", "Internal", "Client"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm"
                    : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filter & Sort Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Transcribed">Transcribed</option>
              <option value="Processing">Processing</option>
            </select>

            {/* Sort order */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-200 cursor-pointer"
              >
                <option value="newest" className="bg-slate-900">Newest First</option>
                <option value="oldest" className="bg-slate-900">Oldest First</option>
                <option value="title" className="bg-slate-900">Sort by Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Fetching meeting workspace data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs text-center space-y-2">
            <p>{error}</p>
            <button
              onClick={loadMeetings}
              className="px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Meetings Grid */}
        {!loading && !error && (
          <>
            {meetings.length === 0 ? (
              /* Empty Upload State */
              <div className="text-center py-16 px-4 bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-3xl max-w-xl mx-auto space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">No meetings found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Upload a transcript to get started with MinuteAI's automated diarization and summary pipeline.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-400 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  Upload Transcript Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {meetings.map((m) => (
                  <MeetingCard key={m.id} meeting={m} onDelete={handleDeleteMeeting} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <CreateMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadMeetings}
      />
    </div>
  );
}
