# GoldenGuide

**AI-powered municipal services assistant for Kingston, Ontario seniors.**

Built for QHacks 2026 -- helping elderly residents navigate city services with dignity and ease.

## The Problem

Seniors in Kingston often struggle to navigate complex municipal services. Phone trees are confusing, websites are hard to read, and eligibility requirements are buried in bureaucratic language. Many seniors miss out on programs they qualify for simply because they don't know where to start.

## The Solution

GoldenGuide is a conversational AI assistant that:
- Searches Kingston's municipal services database in real time
- Checks eligibility for programs like CDCP, MFAP, and SPARK
- Generates personalized action plans with step-by-step instructions
- Drafts emails and places phone calls to service providers on the user's behalf
- Explains confusing government documents in plain English
- Provides Kingston Transit bus routes and schedules
- Creates calendar reminders for important follow-up actions
- Texts action plans to the user's phone or a caregiver

## Features

| Feature | Description |
|---------|-------------|
| Service Search | Search 20+ Kingston services by keyword or category |
| Eligibility Check | Instant eligibility screening for 7 municipal programs |
| Action Plans | Personalized, prioritized step-by-step plans |
| Email Drafting | AI-drafted emails sent via SendGrid |
| Phone Calls | AI voice calls via ElevenLabs + Twilio |
| SMS Notifications | Text plans to user or caregiver via Twilio |
| Document Explainer | Upload a photo of a letter/form for plain English explanation |
| Transit Info | Kingston Transit routes and schedules via GTFS data |
| Calendar Reminders | Downloadable .ics reminders for follow-up actions |
| Text-to-Speech | Listen to responses with ElevenLabs TTS |

## Architecture

```
+--------------------------------------------------+
|                  Next.js Frontend                |
|  +----------+ +----------+ +------------------+ |
|  |MessageBub| |ActionPlan| |  QuickTopics     | |
|  |  ble     | |  Card    | |  EmailPreview    | |
|  |VoicePlay | |ServiceCar| |  CallStatus      | |
|  |  back    | |  d       | |  DocumentExpl.   | |
|  +----------+ +----------+ +------------------+ |
|                    | API calls                    |
+--------------------+-----------------------------+
                     |
+--------------------+-----------------------------+
|              FastAPI Backend                      |
|  +------------------------------------------+    |
|  |         Gemini Agentic Loop              |    |
|  |   (up to 8 iterations per request)       |    |
|  +--+--+--+--+--+--+--+--+--+--+-----------+    |
|     |  |  |  |  |  |  |  |  |  |                 |
|  +--+--+--+--+--+--+--+--+--+--+--+             |
|  |         10 Tool Modules          |             |
|  | search_services  check_eligib.   |             |
|  | get_transit      action_plan     |             |
|  | draft_comms      create_reminder |             |
|  | explain_document place_call      |             |
|  | send_email       send_sms        |             |
|  +----------------------------------+             |
|                                                   |
|  +--------------+  +----------------+            |
|  | Kingston KB  |  |   GTFS Data    |            |
|  | (JSON)       |  |   (CSV)        |            |
|  +--------------+  +----------------+            |
+---------------------------------------------------+
         |              |              |
    +----+----+   +-----+-----+  +----+----+
    | Twilio  |   | SendGrid  |  |ElevenLab|
    |Voice+SMS|   |  Email    |  |TTS+Voice|
    +---------+   +-----------+  +---------+
```

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Atkinson Hyperlegible font
- **Backend:** Python, FastAPI, Google Gemini 2.0 Flash
- **APIs:** Twilio (voice + SMS), SendGrid (email), ElevenLabs (TTS + voice agent)
- **Data:** Kingston municipal services KB (JSON), Kingston Transit GTFS (CSV)
- **Deployment:** Docker, Docker Compose

## Setup

### Prerequisites
- Python 3.12+
- Node.js 20+
- API keys for: Google Gemini, Twilio, SendGrid, ElevenLabs

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your API keys in .env
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

```bash
# Copy and fill in environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Build and run
docker-compose up --build
```

The app will be available at `http://localhost:3000`.

## Design Philosophy

GoldenGuide is designed for **accessibility first**:
- **Atkinson Hyperlegible** font for maximum readability
- **Large text mode** (18px to 22px) toggle
- **High-contrast golden theme** on floral white background
- **Minimum 48px touch targets** for all buttons
- **Text-to-speech** for every response
- **Simple, warm language** -- no technical jargon

## License

Built with love at QHacks 2026.
