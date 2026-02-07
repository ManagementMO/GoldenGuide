# GoldenGuide

> AI-powered assistant helping elderly Kingston, Ontario residents navigate municipal services with dignity and ease.

**QHacks 2026** — Best Use of AI for Social Good

## The Problem

Seniors in Kingston face a fragmented landscape of municipal services. Information is scattered across websites, PDFs, and phone trees. Many elderly residents struggle with digital literacy, making it harder to access the help they need — from transit schedules to financial assistance programs.

## The Solution

GoldenGuide is an agentic AI assistant that acts as a knowledgeable, patient guide. Users describe their needs in plain English, and GoldenGuide:

- Searches a curated knowledge base of Kingston services
- Checks eligibility requirements automatically
- Creates step-by-step action plans
- Explains complex government documents in plain language
- Looks up real-time bus routes and schedules
- Drafts emails and makes phone calls on the user's behalf
- Sends SMS summaries of action plans

## Features

| Feature | Description |
|---------|-------------|
| Service Search | Searches 40+ Kingston services by keyword, category, or need |
| Eligibility Checker | Matches user profile against program requirements |
| Action Plans | Step-by-step plans with contacts, deadlines, and documents needed |
| Document Explainer | Uploads and explains government letters, bills, and forms in plain English |
| Transit Lookup | Real Kingston Transit GTFS data — routes, stops, and schedules |
| Email Drafting | Composes and sends emails to service providers on behalf of users |
| Phone Calls | AI-powered phone calls to agencies using ElevenLabs voice synthesis |
| SMS Plans | Texts action plan summaries to the user's phone |
| Calendar Reminders | Downloads .ics files for important deadlines |
| Accessibility | Large text mode, high contrast, Atkinson Hyperlegible font |

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend (Next.js)              │
│  ┌───────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Chat UI   │ │ Rich Cards│ │ Accessibility  │  │
│  │ Messages  │ │ Actions   │ │ Font/Contrast  │  │
│  └─────┬─────┘ └─────┬────┘ └───────┬────────┘  │
│        └──────────────┴──────────────┘           │
│                       │ REST API                 │
├───────────────────────┼─────────────────────────-┤
│                  Backend (FastAPI)                │
│  ┌────────────────────┴───────────────────────┐  │
│  │           Agentic Loop (8 iterations)      │  │
│  │    Google Gemini 2.0 Flash + Tool Calling  │  │
│  └────────────────────┬───────────────────────┘  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐  │
│  │Search  │ │Transit │ │Email   │ │Document  │  │
│  │Services│ │GTFS    │ │Send    │ │Explain   │  │
│  └────────┘ └────────┘ └────────┘ └──────────┘  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐  │
│  │Check   │ │Action  │ │Phone   │ │SMS       │  │
│  │Eligible│ │Plan    │ │Call    │ │Send      │  │
│  └────────┘ └────────┘ └────────┘ └──────────┘  │
└─────────────────────────────────────────────────┘
```

## Tech Stack

- **Frontend:** Next.js 16, React, Tailwind CSS
- **Backend:** Python FastAPI, Google Gemini 2.0 Flash
- **Voice:** ElevenLabs Text-to-Speech
- **Email:** SendGrid (with Gmail SMTP fallback)
- **SMS:** Twilio
- **Transit Data:** Kingston Transit GTFS
- **Deployment:** Docker + Docker Compose

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- API keys: Google Gemini, Twilio, SendGrid, ElevenLabs

### Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your API keys in .env
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
```

Visit `http://localhost:3000` to start using GoldenGuide.

### Docker Deployment

```bash
# Copy and configure environment
cp backend/.env.example backend/.env
# Fill in your API keys in backend/.env

# Build and run
docker-compose up --build
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:8000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Main chat (JSON body with message + history) |
| POST | `/api/chat/image` | Chat with document upload (multipart FormData) |
| POST | `/api/email` | Execute confirmed email send |
| POST | `/api/sms` | Execute confirmed SMS send |
| POST | `/api/call` | Execute confirmed phone call |
| POST | `/api/reminder` | Download .ics calendar file |
| POST | `/api/tts` | Text-to-speech via ElevenLabs |
| GET | `/health` | Health check |

## License

Built with care for Kingston's senior community.
