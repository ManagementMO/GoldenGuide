# GoldenGuide

![golden](golden.png)

**An agentic AI assistant that doesn't just answer questions — it takes action for Kingston's seniors.**

> _"I'm 78, I live alone, and I just got a letter from the city I don't understand."_
> One sentence. GoldenGuide searches services, checks eligibility, explains the document, drafts an email to the right office, and offers to call them — all in a single conversation turn.

---

## The Problem

Over 20% of Kingston, Ontario's population is 65 or older. These residents face a maze of municipal services scattered across websites, PDFs, and phone trees — each with its own eligibility rules, application processes, and office hours. For seniors with limited digital literacy, vision impairment, or mobility challenges, navigating this system isn't just frustrating. It's a barrier to the help they need.

## The Solution

GoldenGuide is not a chatbot. It's an **agentic AI** that acts on behalf of the user. Powered by Google Gemini 3 Flash with 11 tool declarations in an 8-iteration agentic loop, GoldenGuide chains multiple tools together autonomously — searching services, checking eligibility, generating action plans, and executing real-world actions like phone calls, emails, and SMS — all from a single natural-language request.

## Live Demo Flow

```
User types: "I'm a 72-year-old living alone on a fixed income.
             I need help with dental care and getting to my appointments."

GoldenGuide autonomously:
  1. search_services("dental care seniors")         -> finds CDCP, dental clinics
  2. search_services("transit seniors")              -> finds Kingston Transit discounts
  3. check_eligibility(age=72, income_level="low")   -> qualifies for CDCP, MFAP, transit discount
  4. get_transit_info(destination="dental clinic")    -> Route 12, next departure 10:15 AM
  5. generate_action_plan(...)                        -> 5-step prioritized plan
  6. draft_communication(type="email", ...)           -> ready-to-send email to CDCP intake
  7. Offers: "Shall I call them for you?"             -> one-click real phone call

All rendered as interactive cards with Print / Download / SMS options.
```

---

## What Makes This Different

| Regular Chatbot | GoldenGuide |
|---|---|
| Answers questions | **Takes action** — calls, emails, texts |
| Single-turn responses | **Multi-tool agentic loop** — chains 3-7 tools per request |
| Generic knowledge | **Real Kingston data** — 19 services, 31 bus routes, 809 stops |
| Text only | **Voice in + voice out**, document upload, calendar reminders |
| English only | **Bilingual** — full English/French with localized system prompts |
| Black box | **Real-time tool visualization** — watch tools fire via SSE streaming |

---

## Features

| Feature | Description |
|---------|-------------|
| **11 Agentic Tools** | search_services, check_eligibility, get_transit_info, generate_action_plan, draft_communication, create_reminder, explain_document, web_search, place_call, send_email, send_sms |
| **Real-Time Tool Visualization** | SSE streaming endpoint shows each tool firing live as the agent thinks |
| **Bilingual (EN/FR)** | One-click toggle switches entire UI and system prompt to French (fr-CA) |
| **Voice Input** | Browser SpeechRecognition API — speak naturally in English or French |
| **Voice Output** | Every response can be read aloud via ElevenLabs TTS |
| **Document Upload** | Upload a photo of any government letter/form — Gemini Vision explains it in plain language |
| **Real Phone Calls** | AI-voiced calls to city offices via ElevenLabs + Twilio |
| **Real Emails** | Sends formatted emails to service providers via SendGrid |
| **Real SMS** | Texts action plan summaries to user's phone (+ optional caregiver number) via Twilio |
| **Calendar Reminders** | Downloadable .ics files for appointment deadlines |
| **Print / Download / SMS Plans** | Export action plans in multiple formats |
| **Accessibility** | Atkinson Hyperlegible font, font size toggle (18px/22px), high-contrast golden theme |
| **Offline Demo Mode** | Ctrl+Shift+D triggers cached demo response — hackathon safety net |
| **Real GTFS Transit Data** | 31 Kingston Transit routes, 809 stops (feed valid 2026-01-14 to 2027-01-15) |
| **19 Enriched Services** | Curated Kingston services KB with eligibility rules, contacts, and categories |
| **Web Search** | Tavily API for real-time information beyond the knowledge base |

---

## Architecture

```
                        +--------------------------------------------------+
                        |          Frontend  (Next.js 16 + React)          |
                        |                                                  |
                        |   19 Components:                                 |
                        |   ChatWindow, MessageBubble, ChatInput,          |
                        |   ActionPlanCard, EligibilityCard, ServiceCard,  |
                        |   EmailPreview, CallPreview, CallStatus,         |
                        |   SmsCard, ReminderCard, DocumentExplainerCard,  |
                        |   DocumentUpload, VoiceInput, VoicePlayback,     |
                        |   Header, LoadingIndicator, QuickTopics,         |
                        |   ToolActivity                                   |
                        |                                                  |
                        +-------+------------------+-----------------------+
                                |                  |
                          REST API            SSE Stream
                          /api/chat         /api/chat/stream
                                |                  |
                        +-------+------------------+-----------------------+
                        |            Backend  (Python FastAPI)             |
                        |                                                  |
                        |   +------------------------------------------+   |
                        |   |        Agentic Loop (max 8 iterations)   |   |
                        |   |     Google Gemini 3 Flash + Tools         |   |
                        |   |                                          |   |
                        |   |   User Msg -> Gemini -> Tool Calls -+    |   |
                        |   |       ^                             |    |   |
                        |   |       +--- Results fed back --------+    |   |
                        |   |                                          |   |
                        |   |   Loop until final text response         |   |
                        |   +------------------------------------------+   |
                        |                       |                          |
                        |           +-----------+-----------+              |
                        |           |                       |              |
                        |   +-------+-------+   +-----------+---------+   |
                        |   | Knowledge      |   | 11 Tools            |  |
                        |   | Tools          |   | (Action)            |  |
                        |   |                |   |                     |  |
                        |   | search_services|   | place_call          |  |
                        |   | check_elig.    |   | send_email          |  |
                        |   | get_transit    |   | send_sms            |  |
                        |   | action_plan    |   | web_search          |  |
                        |   | draft_comms    |   |                     |  |
                        |   | create_reminder|   | (Preview only -     |  |
                        |   | explain_doc    |   |  user confirms      |  |
                        |   +-------+-------+   |  before execution)  |  |
                        |           |           +-----------+---------+  |
                        +-----------+------------------+----+------------+
                                    |                  |    |
                          +---------+------+     +-----+----+------+
                          |  Data Sources  |     |  External APIs   |
                          |                |     |                  |
                          | Kingston KB    |     | Google Gemini    |
                          | (19 services)  |     | Twilio           |
                          |                |     | SendGrid         |
                          | GTFS Transit   |     | ElevenLabs       |
                          | (31 routes,    |     | Tavily           |
                          |  809 stops)    |     |                  |
                          +----------------+     +------------------+
```

---

## How It Works — The Agentic Loop

GoldenGuide's core is an **8-iteration agentic loop** that lets Gemini autonomously decide which tools to call and in what order:

```
1. User sends a message (text, voice, or document upload)
2. System prompt + full Kingston KB injected into context
3. Gemini analyzes the request and decides which tools to call
4. Tools execute; results are fed back to Gemini
5. SSE events stream to frontend (tool_start -> tool_done) for live visualization
6. Gemini decides: call more tools or produce final response?
7. Loop repeats (up to 8 iterations) until Gemini is satisfied
8. Final response + structured data (action plans, previews, cards) rendered in UI
```

The model frequently chains 3-7 tools in a single conversation turn — searching services, cross-checking eligibility, pulling transit schedules, generating an action plan, drafting communications, and offering to execute them. **No hardcoded workflows.** The AI decides the optimal tool sequence for each unique request.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **AI Model** | Google Gemini 3 Flash (function calling) |
| **Backend** | Python 3.12, FastAPI, Uvicorn |
| **Frontend** | Next.js 16, React 18, Tailwind CSS 3.4 |
| **Voice Input** | Browser Web Speech API (SpeechRecognition) |
| **Voice Output** | ElevenLabs Multilingual v2 TTS |
| **Phone Calls** | ElevenLabs Conversational AI + Twilio |
| **Email** | SendGrid API |
| **SMS** | Twilio Programmable Messaging |
| **Web Search** | Tavily Search API |
| **Transit Data** | Kingston Transit GTFS (real data) |
| **Deployment** | Docker + Docker Compose |
| **Font** | Atkinson Hyperlegible (accessibility-first) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Main chat — JSON body with message, history, language |
| `POST` | `/api/chat/stream` | SSE streaming chat — real-time tool visualization events |
| `POST` | `/api/chat/image` | Chat with document upload — multipart FormData |
| `POST` | `/api/email` | Execute confirmed email send via SendGrid |
| `POST` | `/api/sms` | Execute confirmed SMS send via Twilio |
| `POST` | `/api/call` | Execute confirmed phone call via ElevenLabs + Twilio |
| `POST` | `/api/reminder` | Generate and download .ics calendar file |
| `POST` | `/api/tts` | Text-to-speech audio via ElevenLabs |
| `GET`  | `/health` | Health check |

**Stateless architecture** — no database, no auth. Conversation history travels with each request, keeping the system simple and privacy-respecting.

---

## Quick Start

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # Fill in: GEMINI_API_KEY, TWILIO_*, SENDGRID_API_KEY, ELEVENLABS_*, TAVILY_API_KEY
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
```

Open **http://localhost:3000** and start talking to GoldenGuide.

### Docker (One Command)

```bash
cp backend/.env.example backend/.env   # Fill in API keys
docker-compose up --build
```

Frontend at `localhost:3000` | Backend API at `localhost:8000`

---

## Project Structure

```
GoldenGuide/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, 9 endpoints, CORS
│   │   └── agent.py             # Agentic loop, 11 tool declarations, SSE streaming
│   ├── tools/
│   │   ├── search_services.py   # Fuzzy search over Kingston KB
│   │   ├── check_eligibility.py # Multi-program eligibility checker
│   │   ├── get_transit.py       # Real GTFS parser (809 stops, 31 routes)
│   │   ├── action_plan.py       # Structured action plan generator
│   │   ├── draft_comms.py       # Email/phone script drafter
│   │   ├── create_reminder.py   # .ics calendar file generator
│   │   ├── explain_document.py  # Document context builder for Gemini Vision
│   │   ├── web_search.py        # Tavily web search integration
│   │   ├── place_call.py        # Phone call preview + execution
│   │   ├── send_email.py        # Email preview + execution via SendGrid
│   │   └── send_sms.py          # SMS preview + execution via Twilio
│   ├── knowledge/
│   │   ├── kingston_services.json  # 19 enriched Kingston services
│   │   └── system_prompt.py        # Dynamic prompt builder (EN/FR)
│   ├── gtfs/                       # Real Kingston Transit GTFS data
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js          # Client root — all state management
│   │   │   ├── layout.js        # HTML shell, Atkinson Hyperlegible font
│   │   │   └── globals.css      # Tailwind + custom animations
│   │   ├── components/          # 19 React components
│   │   ├── hooks/               # Custom React hooks
│   │   └── lib/
│   │       └── api.js           # Backend API wrapper
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Built With

`Google Gemini 3` `FastAPI` `Next.js` `React` `Tailwind CSS` `Twilio` `SendGrid` `ElevenLabs` `Tavily` `Docker` `Kingston Transit GTFS`

---

*Built with care for Kingston's senior community.*
