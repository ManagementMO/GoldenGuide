# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GoldenGuide is an agentic AI assistant that helps elderly Kingston, Ontario residents navigate municipal services. It pairs a **Python FastAPI backend** (Google Gemini 3 Flash with function-calling) and a **Next.js 16 React frontend** designed for accessibility. Built for QHacks 2026.

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

## FRONTEND (Next.js + Tailwind)
- **Design:** Mobile-first, "Soft UI" for seniors.
- **Components:** Functional React components. Use `lucide-react`.
- **Styling:** Tailwind ONLY. No CSS modules unless strictly necessary.
- **Accessibility:** ARIA labels on ALL interactive elements.
- **State:** Use `zustand` or React Context for global state.

## CRITICAL: SENIOR UX
- **Touch Targets:** Minimum 60px height.
- **Font Size:** Minimum 18px.
- **Contrast:** High contrast (AAA) always.

## DESIGN TOKENS (STRICT)
- **Primary Color:** Lilac `#E6E6FA` (Background), Deep Purple `#4A3B75` (Text).
- **Secondary Color:** Mint `#F0FFF0` (Accents), Warm White `#FDFBF7` (Cards).
- **Shadows:** Soft claymorphism: `box-shadow: 8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff;`
- **Border Radius:** Always `rounded-2xl` (16px) or `rounded-3xl` (24px).
- **Icons:** Use `lucide-react` with `strokeWidth={2}`.
- **Spacing:** Use Tailwind multiples of 4 (p-4, p-8, m-6).

## FORBIDDEN PATTERNS (LESSONS LEARNED)
- `Skill/subagent request was not followed exactly`
- `Plan-only request was not strictly respected before implementation`
- `Tailwind-only frontend styling rule was not followed (too much in globals.css)`
- `Icon system rule was not followed (custom SVGs used instead of lucide-react)`
- `Strict design tokens/radius guidance in CLAUDE.md was not consistently followed`
- Before editing any code, check it against CLAUDE.md and see if it aligns with the project goals, act as a QA tester
- One-page constraint: keep the main dashboard fully within a single viewport with no page-level scrolling.

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
- **Frontend components are `.jsx`** files using functional components with hooks. All use Framer Motion for animations (`motion.div`, `whileHover`, `whileTap`)
- Tools are self-contained modules in `backend/tools/` — each exports one `_impl` function matching the Gemini tool schema
- Structured data flows through `structured_data` dict in the agent response, not embedded in message text. Keys: `action_plan`, `draft`, `reminder`, `eligibility`, `document_explanation`, `pending_actions`
- Action tools return preview objects only — execution happens via separate `/api/call`, `/api/email`, `/api/sms` endpoints after frontend confirmation
- Frontend detects JSON blocks in message text using regex parsing in `MessageBubble`
- GTFS CSV files require `encoding="utf-8-sig"` to handle BOM
- French support is runtime-dynamic: system prompt is rewritten when `language="fr"`

### Design System — Glassmorphic Dark Theme

**Aesthetic**: Warm-dark glassmorphic UI with frosted glass panels over ambient golden light orbs.

- **Background**: Dark warm gradient (`#0f0a04` → `#1a1008` → `#2c1810`) with 3 slow-drifting golden radial gradient orbs
- **Glass cards**: `backdrop-blur(16px)`, `bg-white/7%`, `border-white/10%`, inset top-edge highlight (glossy reflection)
- **Colors**: golden `#D4A532` (primary), warm-50 `#FFF8E7` (text), success `#4ADE80`, danger `#F87171`
- **Fonts**: Atkinson Hyperlegible (body/accessibility), Playfair Display (headings/elegance)
- **Mascot**: "Goldie" the golden retriever (`GoldieMascot.jsx`) — SVG with expression variants (`happy`, `excited`, `thinking`, `concerned`)
- **Animations**: Framer Motion (`framer-motion`) for spring physics on messages, cards, buttons. CSS keyframes for orb float, mic pulse, golden burst
- **CSS utility classes**: `.glass`, `.glass-strong`, `.glass-input`, `.btn-golden`, `.btn-glass`, `.btn-success`, `.btn-danger`, `.golden-stripe` — all in `globals.css`
- Large-text mode: toggles base font 18px → 22px via `html.large-text` class
- Print styles target `#printable-action-plan` only, override dark theme to white for printing

## No Test Suite or Linting

This project has no test framework, linting configuration, or CI/CD pipeline.

## 🚫 FORBIDDEN PATTERNS (LESSONS LEARNED)
- Senior-first constraint: keep all UX, tone, and visual decisions explicitly optimized for citizens aged 60-70+, and do not drift to youth or generic styles.
