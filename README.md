# 🎙️ MinuteAI – AI Meeting Notes & Transcription Platform

MinuteAI is a modern meeting management and transcription platform inspired by **Fireflies.ai**. It enables users to create meetings, browse meeting history, read AI-generated summaries, review transcripts with speaker labels and timestamps, manage action items, and configure application settings through an intuitive interface.

---

# ✨ Features

- 📋 Meeting Dashboard
- 🎤 Meeting Transcript Viewer
- 🤖 AI Generated Meeting Summary
- ✅ Action Item Management
- 🏷️ Key Topics Extraction
- 🔍 Search & Filter Meetings
- 📅 Meeting Details Page
- ⚙️ User Settings
- 👤 Profile Management
- 📱 Responsive UI
- ⚡ Built with Next.js 14 App Router

---

# 🛠️ Tech Stack

### Frontend

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons

### Backend (Expected API)

- REST API
- FastAPI / Node.js (Backend Independent)

### Database

- PostgreSQL / MySQL (Recommended)

---

# 📁 Project Structure

```
src/
│
├── app/
│   ├── meetings/
│   ├── settings/
│   └── layout.tsx
│
├── components/
│   ├── layout/
│   ├── meetings/
│   └── settings/
│
├── lib/
│   └── api.ts
│
└── types/
    └── index.ts
```

---

# ⚙️ Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/AnmolTomar15/Scalar-Assignment.git
```

---

## 2. Navigate to Project

```bash
cd Scalar-Assignment
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Create Environment File

Create a file named

```
.env.local
```

Add

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Replace the URL with your backend server if different.

---

## 5. Start Development Server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## 6. Build Production

```bash
npm run build
```

Run

```bash
npm start
```

---

# 🏗️ Architecture Overview

The project follows a layered architecture.

```
               User
                 │
                 ▼
          Next.js Frontend
                 │
        React Components
                 │
        API Service Layer
          (src/lib/api.ts)
                 │
        REST API Endpoints
                 │
          Backend Server
                 │
            Database
```

### Layers

### Presentation Layer

- Next.js App Router
- React Components
- Tailwind CSS

Responsible for rendering UI and user interactions.

---

### Service Layer

Located in

```
src/lib/api.ts
```

Handles

- API Calls
- Request Formatting
- Response Parsing
- Error Handling

---

### Backend Layer

Provides REST endpoints for

- Meetings
- Summaries
- Action Items
- User Settings
- User Profile

---

### Database Layer

Stores

- Meetings
- Participants
- Transcript Segments
- AI Summaries
- Key Topics
- Action Items
- User Settings

---

# 🗄️ Database Schema

## Meetings

| Field | Type |
|-------|------|
| id | UUID |
| title | String |
| category | String |
| date | DateTime |
| duration_seconds | Integer |
| status | String |
| processing_stage | Integer |
| created_at | DateTime |
| updated_at | DateTime |

---

## Participants

| Field | Type |
|-------|------|
| id | UUID |
| meeting_id | UUID |
| name | String |
| email | String |
| role | String |

---

## Transcript Segments

| Field | Type |
|-------|------|
| id | UUID |
| meeting_id | UUID |
| speaker_name | String |
| start_time | Integer |
| end_time | Integer |
| text | Text |

---

## AI Summary

| Field | Type |
|-------|------|
| id | UUID |
| meeting_id | UUID |
| overview_text | Text |
| generated_by | String |
| updated_at | DateTime |

---

## Key Topics

| Field | Type |
|-------|------|
| id | UUID |
| meeting_id | UUID |
| label | String |
| order_index | Integer |

---

## Action Items

| Field | Type |
|-------|------|
| id | UUID |
| meeting_id | UUID |
| title | String |
| assignee_name | String |
| due_date | Date |
| is_completed | Boolean |

---

## User Profile

| Field | Type |
|-------|------|
| id | UUID |
| name | String |
| email | String |
| avatar_url | String |

---

## User Settings

| Field | Type |
|-------|------|
| id | UUID |
| user_id | UUID |
| notify_summaries | Boolean |
| notify_assignments | Boolean |
| notify_mentions | Boolean |
| notify_weekly_digest | Boolean |

---

# 🔌 API Overview

## Meetings

### Get All Meetings

```
GET /api/meetings
```

---

### Get Meeting Details

```
GET /api/meetings/:id
```

---

### Create Meeting

```
POST /api/meetings
```

---

### Update Meeting

```
PATCH /api/meetings/:id
```

---

### Delete Meeting

```
DELETE /api/meetings/:id
```

---

### Advance Processing Stage

```
POST /api/meetings/:id/advance-stage
```

---

### Regenerate Summary

```
POST /api/meetings/:id/summary/regenerate
```

---

## Action Items

### Add Action Item

```
POST /api/meetings/:id/action-items
```

---

### Update Action Item

```
PATCH /api/action-items/:id
```

---

### Delete Action Item

```
DELETE /api/action-items/:id
```

---

## User Profile

```
GET /api/settings/profile
PATCH /api/settings/profile
```

---

## User Settings

```
GET /api/settings
PATCH /api/settings
```

---

# 🚀 Future Improvements

- Audio Upload
- Live Meeting Recording
- Real-time Speech-to-Text
- Authentication & Authorization
- Calendar Integration
- Meeting Sharing
- Export Transcript as PDF
- AI Chat with Meeting
- Speaker Recognition
- Dark Mode

---

# 📌 Assignment Highlights

- Modern Next.js 14 Architecture
- Reusable Component Design
- TypeScript Interfaces
- REST API Integration
- Responsive User Interface
- Modular Folder Structure
- AI Meeting Workflow

---

# 👨‍💻 Author

**Anmol Tomar**

GitHub: https://github.com/AnmolTomar15

---

## License

This project is developed as part of a Full Stack Development Assignment for educational purposes.
