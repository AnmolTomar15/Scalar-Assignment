import { MeetingCard, MeetingDetail, Summary, ActionItem, UserProfile, UserSettings, TranscriptSegment } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function fetchMeetings(params?: {
  query?: string;
  category?: string;
  participant?: string;
  status?: string;
  sort_by?: string;
}): Promise<MeetingCard[]> {
  const searchParams = new URLSearchParams();
  if (params?.query) searchParams.set("query", params.query);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.participant) searchParams.set("participant", params.participant);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.sort_by) searchParams.set("sort_by", params.sort_by);

  const res = await fetch(`${API_BASE}/meetings?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch meetings");
  return res.json();
}

export async function createMeeting(data: {
  title: string;
  category?: string;
  participants: { name: string; email?: string; role?: string }[];
  raw_transcript: string;
}): Promise<MeetingDetail> {
  const res = await fetch(`${API_BASE}/meetings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create meeting");
  return res.json();
}

export async function fetchMeetingDetail(id: string): Promise<MeetingDetail> {
  const res = await fetch(`${API_BASE}/meetings/${id}`);
  if (!res.ok) throw new Error("Failed to fetch meeting details");
  return res.json();
}

export async function updateMeeting(id: string, data: { title?: string; category?: string }): Promise<MeetingDetail> {
  const res = await fetch(`${API_BASE}/meetings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update meeting");
  return res.json();
}

export async function deleteMeeting(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/meetings/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete meeting");
}

export async function regenerateSummary(meetingId: string): Promise<Summary> {
  const res = await fetch(`${API_BASE}/meetings/${meetingId}/summary/regenerate`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to regenerate summary");
  return res.json();
}

export async function advanceProcessingStage(meetingId: string): Promise<MeetingDetail> {
  const res = await fetch(`${API_BASE}/meetings/${meetingId}/advance-stage`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to advance processing stage");
  return res.json();
}

export async function addActionItem(meetingId: string, data: {
  title: string;
  assignee_name?: string;
  due_date?: string;
}): Promise<ActionItem> {
  const res = await fetch(`${API_BASE}/meetings/${meetingId}/action-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add action item");
  return res.json();
}

export async function updateActionItem(itemId: string, data: {
  title?: string;
  assignee_name?: string;
  due_date?: string;
  is_completed?: boolean;
}): Promise<ActionItem> {
  const res = await fetch(`${API_BASE}/action-items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update action item");
  return res.json();
}

export async function deleteActionItem(itemId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/action-items/${itemId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete action item");
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/settings/profile`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/settings/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export async function fetchNotificationSettings(): Promise<UserSettings> {
  const res = await fetch(`${API_BASE}/settings/notifications`);
  if (!res.ok) throw new Error("Failed to fetch notification settings");
  return res.json();
}

export async function updateNotificationSettings(data: Partial<UserSettings>): Promise<UserSettings> {
  const res = await fetch(`${API_BASE}/settings/notifications`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update notification settings");
  return res.json();
}

export async function deleteAccount(): Promise<void> {
  const res = await fetch(`${API_BASE}/settings/account`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete account");
}

// ── LLM Config ────────────────────────────────────────────────────────────────

export interface LLMConfig {
  provider: string;
  openai_api_key_masked: string;
  openai_model: string;
  openai_base_url: string;
  gemini_api_key_masked: string;
  gemini_model: string;
  has_openai_key: boolean;
  has_gemini_key: boolean;
  updated_at: string | null;
}

export interface LLMTestResult {
  success: boolean;
  provider: string;
  message: string;
}

export async function fetchLLMConfig(): Promise<LLMConfig> {
  const res = await fetch(`${API_BASE}/settings/llm`);
  if (!res.ok) throw new Error("Failed to fetch LLM config");
  return res.json();
}

export async function saveLLMConfig(data: {
  provider?: string;
  openai_api_key?: string;
  openai_model?: string;
  openai_base_url?: string;
  gemini_api_key?: string;
  gemini_model?: string;
}): Promise<LLMConfig> {
  const res = await fetch(`${API_BASE}/settings/llm`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save LLM config");
  return res.json();
}

export async function testLLMConnection(): Promise<LLMTestResult> {
  const res = await fetch(`${API_BASE}/settings/llm/test`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to test LLM connection");
  return res.json();
}
