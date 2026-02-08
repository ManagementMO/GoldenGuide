# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GoldenGuide is an agentic AI assistant that helps elderly Kingston, Ontario residents navigate municipal services. It pairs a **Python FastAPI backend** (Google Gemini 2.0 Flash with function-calling) and a **Next.js 16 React frontend** designed for accessibility. Built for QHacks 2026.

## Development Commands

### Backend
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
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

### Docker (full stack)
```bash
cp backend/.env.example backend/.env   # Fill in API keys first
docker-compose up --build
# Frontend: localhost:3000 | Backend: localhost:8000
```

### Environment Setup
- Backend: Copy `backend/.env.example` to `backend/.env` — required keys: `GEMINI_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`, `ELEVENLABS_PHONE_ID`, `TAVILY_API_KEY`
- Frontend: `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000`

## Architecture

### Backend: Agentic Loop (`backend/app/agent.py`)

The core abstraction is an agentic loop that runs up to 8 iterations:
1. User message + system prompt (with full Kingston services KB injected) sent to Gemini
2. Gemini decides which tool(s) to call via function-calling
3. Tools execute, results fed back to Gemini
4. Loop continues until Gemini produces a final text response (no more tool calls)
5. Structured data (action plans, drafts, previews) accumulated in a separate `structured_data` dict

Two entry points:
- `agent_chat()` — returns complete response dict
- `agent_chat_stream()` — yields SSE events (`thinking`, `tool_start`, `tool_done`, `complete`)

**Tool Registry**: `TOOL_FUNCTIONS` dict maps Gemini tool names to Python callables. 8 tools auto-execute; 3 action tools (`place_call`, `send_email`, `send_sms`) use inline lambdas that return preview objects only — actual execution requires frontend confirmation via separate endpoints.

**Tool Declarations**: `tool_declarations` array defines 11 Gemini function-calling schemas (names, descriptions, parameter definitions).

### Backend Tool Module Pattern (`backend/tools/`)

Each tool is a standalone Python module exporting a single function with the `_impl` suffix:
- `search_services.py` → `search_services_impl(query, category="all")`
- `check_eligibility.py` → `check_eligibility_impl(programs_to_check, age=None, ...)`
- `get_transit.py` → `get_transit_info_impl(...)` — parses real GTFS data, uses `encoding="utf-8-sig"` for BOM handling
- `web_search.py` → `web_search_impl(query, max_results=5)` — Tavily API

All tools are pure functions (no classes), load static data at module level, and return JSON-serializable dicts.

### Backend API Endpoints (`backend/app/main.py`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Main chat (JSON: `{message, history, language}`) |
| `POST` | `/api/chat/stream` | SSE streaming chat with real-time tool visualization |
| `POST` | `/api/chat/image` | Chat with document upload (multipart FormData) |
| `POST` | `/api/email` | Execute confirmed email (SendGrid) |
| `POST` | `/api/sms` | Execute confirmed SMS (Twilio) |
| `POST` | `/api/call` | Execute confirmed phone call (ElevenLabs + Twilio) |
| `POST` | `/api/reminder` | Generate .ics calendar file download |
| `POST` | `/api/tts` | Text-to-speech audio (ElevenLabs) |
| `GET`  | `/health` | Health check |

**CORS**: Env-aware — wildcard `*` only when `FRONTEND_URL` contains "localhost"; production uses specific origin.

**Stateless**: No database, no auth. Conversation history travels with each request.

### Frontend: State & Components

`page.js` is the client-rendered root managing all chat state: messages, history, loading, fontSize, language, activeTools, completedTools. Components communicate upward via callback props.

**SSE streaming**: `page.js` reads from `/api/chat/stream`, parsing `event: {name}\ndata: {json}\n\n` format to update tool activity UI in real time.

**Rich Message Rendering**: `MessageBubble` parses assistant text for embedded JSON blocks and renders them as typed cards (`ActionPlanCard`, `EmailPreview`, `CallPreview`, `SmsCard`, `ServiceCard`, `EligibilityCard`, `ReminderCard`, `DocumentExplainerCard`).

**API Layer**: `frontend/src/lib/api.js` wraps all fetch calls — `sendChat`, `streamChat`, `sendChatWithImage`, `executeEmail`, `executeSms`, `executeCall`, `getTts`, `downloadReminder`.

**Demo safety net**: `Ctrl+Shift+D` loads cached demo response from `/demo_cache.json`.

### Knowledge Base (`backend/knowledge/`)

- `kingston_services.json` — 19 enriched Kingston service objects (name, category, description, eligibility, contact, hours, cost, keywords)
- `system_prompt.py` — `build_system_prompt(language="en")` injects full KB into prompt; appends French instruction when `language=="fr"`

### Data Sources

- **GTFS**: Real Kingston Transit data in `backend/gtfs/` (31 routes, 809 stops, feed valid 2026-01-14 to 2027-01-15)
- **Knowledge base**: 19 curated Kingston services, enriched via `scrape_kingston.py`

## Key Patterns to Preserve

- **Relative imports only in frontend** — no `@/` path aliases (no jsconfig.json or tsconfig path mapping). Use `../lib/api`, `./MessageBubble`, etc.
- **Frontend components are `.jsx`** files using functional components with hooks
- Tools are self-contained modules in `backend/tools/` — each exports one `_impl` function matching the Gemini tool schema
- Structured data flows through `structured_data` dict in the agent response, not embedded in message text. Keys: `action_plan`, `draft`, `reminder`, `eligibility`, `document_explanation`, `pending_actions`
- Action tools return preview objects only — execution happens via separate `/api/call`, `/api/email`, `/api/sms` endpoints after frontend confirmation
- Frontend detects JSON blocks in message text using regex parsing in `MessageBubble`
- GTFS CSV files require `encoding="utf-8-sig"` to handle BOM
- French support is runtime-dynamic: system prompt is rewritten when `language="fr"`

### Design System

Tailwind with custom theme in `tailwind.config.js`:
- Colors: golden `#B8860B`, floral `#FFFAF0` (bg), cornsilk `#FFF8DC` (cards), textbrown `#2C1810`
- Font: Atkinson Hyperlegible (body), Georgia/Merriweather (headings)
- Large-text mode: toggles base font 18px → 22px via `html.large-text` class
- `animate-fade-in` keyframe defined in `globals.css`
- Print styles target `#printable-action-plan` only

## No Test Suite or Linting

This project has no test framework, linting configuration, or CI/CD pipeline.
