# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GoldenGuide is an agentic AI assistant that helps elderly Kingston, Ontario residents navigate municipal services. It pairs a **Python FastAPI backend** (with Google Gemini function-calling) and a **Next.js React frontend** designed for accessibility.

## Development Commands

### Backend
```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev          # Development server on port 3000
npm run build        # Production build
npm run start        # Serve production build
```

### Environment Setup
Copy `backend/.env.example` to `backend/.env` and fill in API keys (Gemini, Twilio, SendGrid, ElevenLabs). Frontend uses `frontend/.env.local` with `NEXT_PUBLIC_API_URL`.

## Architecture

### Backend: Agentic Loop Pattern (`backend/app/agent.py`)

The core abstraction is an agentic loop that runs up to 8 iterations:
1. User message + system prompt (with full Kingston services KB injected) sent to Gemini
2. Gemini decides which tool(s) to call via function-calling
3. Tools execute, results fed back to Gemini
4. Loop continues until Gemini produces a final text response (no more tool calls)
5. Structured data (action plans, drafts, previews) accumulated separately for rich frontend rendering

**Tool Registry**: `TOOL_FUNCTIONS` dict in `agent.py` maps Gemini tool names to Python callables. Each tool in `backend/tools/` is a standalone module exporting a single function.

**Confirmation Pattern**: Three action tools (`place_call`, `send_email`, `send_sms`) return preview objects only. Actual execution requires explicit frontend confirmation via separate API endpoints (`/api/call`, `/api/email`, `/api/sms`).

### Backend API Endpoints (`backend/app/main.py`)

- `POST /api/chat` — Main chat (JSON body with message + history)
- `POST /api/chat/image` — Chat with document upload (multipart FormData)
- `POST /api/email`, `/api/sms`, `/api/call` — Execute confirmed actions
- `POST /api/reminder` — Download .ics calendar file
- `POST /api/tts` — Text-to-speech via ElevenLabs
- `GET /health` — Health check

## 🟢 FRONTEND (Next.js + Tailwind)
- **Design:** Mobile-first, "Soft UI" for seniors.
- **Components:** Functional React components. Use `lucide-react`.
- **Styling:** Tailwind ONLY. No CSS modules unless strictly necessary.
- **Accessibility:** ARIA labels on ALL interactive elements.
- **State:** Use `zustand` or React Context for global state.

## 🔴 CRITICAL: SENIOR UX
- **Touch Targets:** Minimum 60px height.
- **Font Size:** Minimum 18px.
- **Contrast:** High contrast (AAA) always.

## 🎨 DESIGN TOKENS (STRICT)
- **Primary Color:** Lilac `#E6E6FA` (Background), Deep Purple `#4A3B75` (Text).
- **Secondary Color:** Mint `#F0FFF0` (Accents), Warm White `#FDFBF7` (Cards).
- **Shadows:** Soft claymorphism: `box-shadow: 8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff;`
- **Border Radius:** Always `rounded-2xl` (16px) or `rounded-3xl` (24px).
- **Icons:** Use `lucide-react` with `strokeWidth={2}`.
- **Spacing:** Use Tailwind multiples of 4 (p-4, p-8, m-6).

## 🚫 FORBIDDEN PATTERNS (LESSONS LEARNED)
- `Skill/subagent request was not followed exactly`
- `Plan-only request was not strictly respected before implementation`
- `Tailwind-only frontend styling rule was not followed (too much in globals.css)`
- `Icon system rule was not followed (custom SVGs used instead of lucide-react)`
- `Strict design tokens/radius guidance in CLAUDE.md was not consistently followed`
- Before editing any code, check it against CLAUDE.md and see if it aligns with the project goals, act as a QA tester
- One-page constraint: keep the main dashboard fully within a single viewport with no page-level scrolling.

### Frontend: Component Architecture

`page.js` is the client-rendered root that manages all chat state (messages, history, loading, fontSize). Components communicate upward via callback props (onExecuteCall, onExecuteEmail, etc.).

**Rich Message Rendering**: `MessageBubble` parses assistant text for embedded JSON blocks and renders them as typed cards (`ActionPlanCard`, `EmailPreview`, `CallPreview`, `SmsCard`, `ServiceCard`).

**API Layer**: `frontend/src/lib/api.js` wraps all fetch calls to the backend.

### Knowledge Base (`backend/knowledge/`)

- `kingston_services.json` — Array of service objects (name, category, eligibility, contact info, keywords)
- `system_prompt.py` — Dynamic prompt builder that injects the full KB and specifies JSON output formats for structured responses

### Design System

Tailwind with custom theme: golden (#B8860B), floral (#FFFAF0) backgrounds, Atkinson Hyperlegible font for accessibility. Large-text mode toggles base font from 18px to 22px.
## Key Patterns to Preserve

- Tools are self-contained modules in `backend/tools/` — each exports one function matching the Gemini tool schema
- Structured data flows through `structured_data` dict in the agent response, not embedded in message text
- Frontend detects JSON blocks in message text using regex parsing in `MessageBubble`
- CORS is configured in `main.py` to allow the frontend origin
- GTFS transit data lives in `backend/gtfs/` and is parsed by `tools/get_transit.py`

## No Test Suite or Linting

This project currently has no test framework, linting configuration, or CI/CD pipeline.
