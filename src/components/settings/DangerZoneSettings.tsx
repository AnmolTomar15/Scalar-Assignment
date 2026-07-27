"use client";

import { useState } from "react";
import { deleteAccount } from "@/lib/api";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DangerZoneSettings() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      alert("Account and associated data deleted.");
      router.push("/meetings");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("Failed to delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 bg-slate-900/60 border border-rose-950/80 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="h-9 w-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-base text-rose-400">Danger Zone</h3>
          <p className="text-xs text-slate-400">Irreversible account actions and workspace data purging.</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-semibold text-xs text-white">Delete Workspace Account</h4>
          <p className="text-[11px] text-slate-400 max-w-md">
            Permanently delete your profile, meeting transcripts, AI summaries, key topic indexes, and assigned action items.
          </p>
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="font-bold text-base text-white">Confirm Account Purge</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you absolutely sure? This action cannot be undone. All meeting notes, audio transcripts, and AI summaries will be erased permanently from the SQLite database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-rose-600/30"
              >
                {isDeleting ? "Deleting..." : "Yes, Purge Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
