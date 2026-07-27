export interface Participant {
  id?: string;
  meeting_id?: string;
  name: string;
  email?: string;
  role?: string;
  avatar_url?: string;
}

export interface TranscriptSegment {
  id: string;
  meeting_id: string;
  speaker_name: string;
  speaker_role?: string;
  start_time: number;
  end_time: number;
  text: string;
  is_key_moment?: boolean;
  key_moment_title?: string;
}

export interface Summary {
  id: string;
  meeting_id: string;
  overview_text: string;
  generated_by: string;
  updated_at: string;
}

export interface KeyTopic {
  id: string;
  meeting_id: string;
  label: string;
  order_index: number;
}

export interface ActionItem {
  id: string;
  meeting_id: string;
  title: string;
  assignee_name: string;
  assignee_initials: string;
  due_date?: string;
  is_completed: boolean;
  created_at: string;
}

export interface MeetingCard {
  id: string;
  title: string;
  category: string;
  date: string;
  duration_seconds: number;
  status: "Processing" | "Transcribed";
  processing_stage: number; // 1, 2, 3
  micro_status?: string;
  summary_preview?: string;
  participant_count: number;
  participants: Participant[];
  created_at: string;
}

export interface MeetingDetail extends MeetingCard {
  media_url?: string;
  transcript_segments: TranscriptSegment[];
  summary?: Summary;
  key_topics: KeyTopic[];
  action_items: ActionItem[];
  updated_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  job_title?: string;
  timezone?: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  notify_summaries: boolean;
  notify_assignments: boolean;
  notify_mentions: boolean;
  notify_weekly_digest: boolean;
}
