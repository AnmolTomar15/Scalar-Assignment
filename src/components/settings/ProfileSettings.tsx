"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { fetchProfile, updateProfile } from "@/lib/api";
import { User, Save, Check } from "lucide-react";

export default function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [timezone, setTimezone] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile().then((p) => {
      setProfile(p);
      setName(p.name);
      setEmail(p.email);
      setJobTitle(p.job_title || "");
      setTimezone(p.timezone || "");
    }).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateProfile({
        name,
        email,
        job_title: jobTitle,
        timezone
      });
      setProfile(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return <div className="text-xs text-slate-500 py-8">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="h-9 w-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-base text-white">Profile Information</h3>
          <p className="text-xs text-slate-400">Manage your persona, job title, and timezone.</p>
        </div>
      </div>

      {/* Avatar Preview */}
      <div className="flex items-center gap-4">
        <img
          src={profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
          alt={name}
          className="h-16 w-16 rounded-2xl border-2 border-indigo-500/40 object-cover"
        />
        <div>
          <h4 className="font-semibold text-sm text-white">{name}</h4>
          <p className="text-xs text-slate-400">{jobTitle || "Product Lead"}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Job Title / Role</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Timezone</label>
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end border-t border-slate-800 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
        >
          {isSaved ? (
            <>
              <Check className="h-4 w-4 text-emerald-400" />
              Changes Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
