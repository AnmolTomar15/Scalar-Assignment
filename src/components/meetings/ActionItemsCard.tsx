"use client";

import { useState } from "react";
import { ActionItem } from "@/types";
import { addActionItem, updateActionItem, deleteActionItem } from "@/lib/api";
import { CheckSquare, Plus, Trash2, Calendar, User, X, Check } from "lucide-react";

interface ActionItemsCardProps {
  meetingId: string;
  items: ActionItem[];
  onItemsChanged: () => void;
}

export default function ActionItemsCard({ meetingId, items, onItemsChanged }: ActionItemsCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("Alex Rivera");
  const [newDueDate, setNewDueDate] = useState("Oct 30");

  const handleToggleComplete = async (item: ActionItem) => {
    try {
      await updateActionItem(item.id, { is_completed: !item.is_completed });
      onItemsChanged();
    } catch (err) {
      console.error("Error toggling action item:", err);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteActionItem(itemId);
      onItemsChanged();
    } catch (err) {
      console.error("Error deleting action item:", err);
    }
  };

  const handleCreateActionItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await addActionItem(meetingId, {
        title: newTitle.trim(),
        assignee_name: newAssignee.trim(),
        due_date: newDueDate.trim() ? `Due ${newDueDate.trim()}` : undefined
      });
      setNewTitle("");
      setIsAdding(false);
      onItemsChanged();
    } catch (err) {
      console.error("Error creating action item:", err);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header & Add Trigger */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckSquare className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-sm text-white">Action Items ({items.length})</h3>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 transition-colors"
        >
          {isAdding ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {isAdding ? "Cancel" : "Add Task"}
        </button>
      </div>

      {/* Form to Add New Action Item */}
      {isAdding && (
        <form onSubmit={handleCreateActionItem} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 animate-fade-in">
          <input
            type="text"
            required
            placeholder="Action item task description..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Assignee Name"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Due Date (e.g. Nov 05)"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-1.5 rounded-lg shadow transition-colors"
          >
            Save Action Item
          </button>
        </form>
      )}

      {/* Action Items List */}
      <div className="space-y-2.5">
        {items.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-500">
            No action items assigned for this meeting yet.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`group flex items-start justify-between gap-3 p-3 rounded-xl border transition-all ${
                item.is_completed
                  ? "bg-slate-950/40 border-slate-800/60 opacity-70"
                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Checkbox & Task Title */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggleComplete(item)}
                  className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    item.is_completed
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-slate-700 bg-slate-900 hover:border-emerald-500"
                  }`}
                >
                  {item.is_completed && <Check className="h-3 w-3" />}
                </button>

                <div className="space-y-1 min-w-0">
                  <p
                    className={`text-xs font-medium leading-relaxed ${
                      item.is_completed ? "line-through text-slate-500" : "text-slate-200"
                    }`}
                  >
                    {item.title}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    {/* Assignee Avatar / Badge */}
                    <span className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      <span className="h-4 w-4 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[9px] flex items-center justify-center">
                        {item.assignee_initials}
                      </span>
                      {item.assignee_name}
                    </span>

                    {/* Due Date */}
                    {item.due_date && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        {item.due_date}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-900 transition-all shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
