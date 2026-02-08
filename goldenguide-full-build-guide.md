# 🛠️ GoldenGuide — Full Implementation Guide

> Print this. Follow it top to bottom. When a section says "done", move on.

---

## THE BIG PICTURE

You're building a chat app where a senior types (or speaks) something like *"I'm 73 and can't afford the dentist"* — and instead of just answering, the AI autonomously searches Kingston services, checks eligibility across multiple programs, builds a step-by-step action plan, drafts an email to the right office, and offers to make a real phone call and text the plan to their phone. All from one sentence.

**Stack**: React/Next.js frontend → FastAPI backend → Google Gemini with 10 function-calling tools → Twilio (calls + SMS) + SendGrid (email) + ElevenLabs (voice)

**Architecture rule**: No database, no auth, no vector DB. Gemini's 1M token context window holds all Kingston data directly in the system prompt. Everything is stateless — conversation history travels with each request.

---

## PHASE 0: PRE-HACKATHON SETUP

Everything here is account creation and data gathering. None of it is "building."

### 0A. Accounts + API Keys

Create these accounts and save every key in a single `.env` file:

**Twilio** (twilio.com) — Buy a +1 613 phone number with Voice + SMS ($1 from free trial credits). Go to Verified Caller IDs → verify your phone, your teammate's phone, and one backup phone. Copy Account SID + Auth Token.

**SendGrid** (sendgrid.com) — Enable 2FA (mandatory). Create an API Key with Full Access. Do Single Sender Verification: add your from-email (e.g. `goldenguide.kingston@gmail.com`), click the verification link that arrives. You now get 100 emails/day free.

**ElevenLabs** (elevenlabs.io) — Go to Conversational AI → create an agent named "GoldenGuide Caller." Pick a warm mature voice (Rachel or Domi). Set system prompt:

```
You are GoldenGuide, an AI assistant calling on behalf of a Kingston senior resident.
When answered: (1) Identify as AI, (2) State purpose clearly, (3) Ask for needed info,
(4) Thank them. Keep under 2 minutes. Never pretend to be human.
```

Go to Phone Numbers → Import Twilio Number → enter your Twilio SID + Auth Token → assign your agent. Test by clicking "Outbound call" to your verified number. Your phone should ring with the AI voice.

**Google AI Studio** (aistudio.google.com) — Get a Gemini API key. That's it.

**Vultr** (vultr.com) — Create account, have credits ready. You'll deploy later.

### 0B. Scrape Kingston Data

Write a quick Python script (`scraper.py`) using `requests` + `BeautifulSoup`:

```python
import requests, json
from bs4 import BeautifulSoup

def scrape_page(url):
    resp = requests.get(url)
    soup = BeautifulSoup(resp.text, 'html.parser')
    # Remove nav, footer, scripts
    for tag in soup(['nav', 'footer', 'script', 'style']):
        tag.decompose()
    return soup.get_text(separator='\n', strip=True)
```

Scrape these pages and manually organize the output into structured JSON records:

- cityofkingston.ca older adults page → MFAP, homemaking, community centres
- cityofkingston.ca housing page → affordable housing, Ontario Renovates
- canada.ca/dental → CDCP details
- kingstonseniors.ca → Seniors Association programs
- kingstontransit.ca → fares, schedules, accessibility

For each service, create a JSON record:
```json
{
  "name": "Municipal Fee Assistance Program (MFAP)",
  "category": "financial",
  "description": "Discounted city services for low-income Kingston residents...",
  "eligibility": "Kingston residents with household income below LIM+15%",
  "phone": "613-546-2695 ext 4906",
  "address": "362 Montreal Street, Kingston",
  "how_to_apply": "Visit Housing & Social Services with proof of income...",
  "website": "https://www.cityofkingston.ca/...",
  "keywords": ["fee assistance", "low income", "discount", "dental", "transit"]
}
```

Aim for **12+ services** covering: MFAP, CDCP, homemaking, Kingston Transit, SPARK, Seniors Association, affordable housing, community centres, 211 Ontario, low-income health benefits, Lionhearts food market, Kingston Access Services. Save as `kingston_services.json`.

Also download transit data:
```bash
wget https://api.cityofkingston.ca/gtfs/gtfs.zip && unzip gtfs.zip -d gtfs/
```

### 0C. Project Boilerplates

Have both projects pre-created on your laptop:

**Backend**:
```bash
mkdir -p backend/tools backend/knowledge backend/gtfs
cd backend
python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn python-dotenv google-generativeai twilio sendgrid elevenlabs python-multipart httpx
pip freeze > requirements.txt
```

Place your `.env`, `kingston_services.json`, and `gtfs/*.txt` files.

**Frontend**:
```bash
npx create-next-app@latest frontend --js --tailwind --app --src-dir --no-import-alias
cd frontend && npm install
```

**Done when**: Both projects start without errors. You have all API keys in `.env` and all Kingston data in JSON.

---

## PHASE 1: CHAT WORKS END-TO-END (Hours 0–4)

The goal is simple: type a message → get a Kingston-specific AI response → see it in the UI.

### 1A. Backend — FastAPI Server + Gemini

Create `backend/main.py`:

```python
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional
import os, json

load_dotenv()
app = FastAPI(title="GoldenGuide API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/chat")
async def chat(req: ChatRequest):
    from agent import agent_chat
    result = await agent_chat(req.message, req.history)
    return result
```

Create `backend/knowledge/system_prompt.py` — this loads your JSON knowledge base and builds a massive system prompt:

```python
import json, os

def build_system_prompt() -> str:
    kb_path = os.path.join(os.path.dirname(__file__), "kingston_services.json")
    with open(kb_path) as f:
        services = json.load(f)
    
    services_text = ""
    for s in services:
        services_text += f"\n---\nService: {s['name']}\nCategory: {s['category']}\n"
        services_text += f"Description: {s['description']}\n"
        for field in ['eligibility','phone','address','how_to_apply','website','cost','notes']:
            if s.get(field):
                services_text += f"{field.replace('_',' ').title()}: {s[field]}\n"
    
    return f"""You are GoldenGuide, a proactive AI agent helping elderly Kingston, Ontario residents access municipal services.

CORE BEHAVIORS:
1. PROACTIVE: When user mentions age/income/situation, use check_eligibility on ALL relevant programs.
2. ACTION-ORIENTED: Use generate_action_plan for clear steps. Use draft_communication for emails/scripts.
3. MULTI-STEP: Chain tools. One user message may need search → eligibility → plan → draft.
4. WARM & SIMPLE: Plain language. No jargon. Like a friendly neighbor who knows everything about city services.
5. DOCUMENT HELPER: If user uploads a document photo, explain it in plain English.
6. REAL ACTIONS: You can place_call, send_email, send_sms. ALWAYS preview and get confirmation first.

AVAILABLE KINGSTON SERVICES:
- MFAP, CDCP, Subsidized Homemaking, Kingston Transit, SPARK, Affordable Housing,
  Community Centres, Seniors Association, 211 Ontario, Low-Income Health Benefits,
  Lionhearts Fresh Food Market, Kingston Access Services

Always end with a clear next step the user can take RIGHT NOW.

=== KINGSTON SERVICES KNOWLEDGE BASE ===
{services_text}
=== END KNOWLEDGE BASE ==="""
```

Create `backend/agent.py` — start with a **simple non-agentic version first** (just to get chat working):

```python
import os
from google import genai
from google.genai import types
from knowledge.system_prompt import build_system_prompt

async def agent_chat(user_message: str, history: list, image_data=None, image_mime=None):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    system_prompt = build_system_prompt()
    
    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=1.0,
    )
    
    history.append({"role": "user", "parts": [{"text": user_message}]})
    
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=config,
        contents=history,
    )
    
    text = response.candidates[0].content.parts[0].text
    history.append({"role": "model", "parts": [{"text": text}]})
    
    return {"text": text, "history": history, "structured_data": {}, "tool_calls_made": []}
```

**Test**: `cd backend && uvicorn main:app --reload` then:
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I am 73 and need help with dental care"}'
```
You should get a real response about CDCP and MFAP. **If this works, Phase 1 backend is done.**

### 1B. Frontend — Chat UI Shell

Set up the design system in `frontend/tailwind.config.js`:
```js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        golden: { DEFAULT: '#B8860B', light: '#F5DEB3' },
        accent: '#8B4513',
        floral: '#FFFAF0',
        cornsilk: '#FFF8DC',
        textbrown: '#2C1810',
        success: '#228B22',
        danger: '#C0392B',
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
        body: ['"Atkinson Hyperlegible"', 'Verdana', 'sans-serif'],
      },
    },
  },
};
```

In `globals.css`, import the accessibility font:
```css
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap');
@tailwind base; @tailwind components; @tailwind utilities;
html { font-size: 18px; }
html.large-text { font-size: 22px; }
body { font-family: 'Atkinson Hyperlegible', Verdana, sans-serif; background: #FFFAF0; color: #2C1810; line-height: 1.6; }
```

Build `page.js` — a single-page chat app:
- State: `messages` array, `history` array, `isLoading` boolean
- Layout: `flex flex-col h-screen max-w-3xl mx-auto`
- Header at top (golden bar with "🌟 GoldenGuide" + font size toggle)
- Scrollable message area in the middle
- Fixed input bar at the bottom (text input + send button)
- When messages is empty, show welcome card + quick-topic buttons
- Send function: POST to `/api/chat` → add response to messages → update history

Build these **4 components** to get chat working:
- **Header** — golden background, white text, title + [A-] [A+] buttons
- **MessageBubble** — user messages right-aligned brown, agent messages left-aligned cornsilk with 🌟 avatar
- **ChatInput** — text field + send button, fixed at bottom
- **QuickTopics** — 2-column grid of tappable buttons: 🦷 Dental, 🚌 Transit, 💰 Fees, 🏠 Home Help, 🎭 Activities, ❓ Help

Create `.env.local` in frontend: `NEXT_PUBLIC_API_URL=http://localhost:8000`

**Test**: Run both servers. Type "What dental programs exist for seniors?" — you should see a real AI response in a nice chat bubble. **If this works, Phase 1 is complete.**

---

## PHASE 2: AGENTIC TOOLS — CHATBOT → AGENT (Hours 4–12)

This is where the magic happens. You'll register tool functions that Gemini can call autonomously.

### 2A. Build the 7 Information Tools

Each tool is a Python file in `backend/tools/` with one function. Here's what each does and how to build it:

**`search_services.py`** — Keyword search over your JSON knowledge base. Load `kingston_services.json` at module level. For each service, build a searchable string from all fields. Score by how many query words appear. Return top 5 matches with full details.

**`check_eligibility.py`** — Rule-based if/else for each program. Define rules: CDCP requires age 65+, low income. MFAP requires Kingston residency, low income. Homemaking requires age 60+. SPARK requires MFAP card. Transit discount requires age 65+. For each program, classify as eligible/maybe/not-eligible based on the user's info. Return all three categories.

**`get_transit.py`** — Load GTFS CSV files at module level with `csv.DictReader`. When called, search `stops.txt` for matching stop names, find which trips/routes serve those stops via `stop_times.txt` and `trips.txt`, return stop names + route names + sample departure times. If GTFS files aren't available, return a helpful fallback with the transit phone number.

**`action_plan.py`** — Takes `user_situation` + `eligible_services` list. For each service, looks it up in the knowledge base. Returns a structured dict: `{title, steps: [{priority, icon, service_name, description, phone, address, how_to_apply}]}`. This JSON is what the frontend renders as the hero Action Plan Card.

**`draft_comms.py`** — Takes type (email/phone_script/both), recipient, purpose, user_details. Returns a structured draft: `{email: {to, subject, body}, phone_script: {number, script, tips}}`. The text is template-based — Gemini fills in the details via its tool call arguments.

**`create_reminder.py`** — Takes title, date, time, description. Returns metadata. A separate `/api/reminder` endpoint generates the actual `.ics` file using the iCalendar text format and returns it as a file download.

**`explain_document.py`** — Minimal: returns `{status: "analyzing", context: ...}`. The actual explanation is done by Gemini's vision model reading the uploaded image from the conversation. This tool just signals the intent.

### 2B. Register Tools + Build the Agentic Loop

This is the **hardest and most important** step. Upgrade `agent.py` from the simple version to the full agentic loop.

**Step 1: Define tool declarations.** Each tool needs a JSON schema telling Gemini its name, description, and parameter types. The descriptions are critical — they're how Gemini decides when to use each tool. Be explicit:
- `check_eligibility`: "ALWAYS check multiple programs proactively"
- `generate_action_plan`: "Use AFTER finding services and checking eligibility"
- `place_call` / `send_email` / `send_sms`: "ALWAYS show preview and get confirmation"

**Step 2: Create the tool dispatch map:**
```python
TOOL_FUNCTIONS = {
    "search_services": search_services_impl,
    "check_eligibility": check_eligibility_impl,
    # ... all 7 info tools execute normally
    # Action tools return previews instead of executing:
    "place_call": lambda **kw: {"action": "place_call", "preview": kw, "requires_confirmation": True},
    "send_email": lambda **kw: {"action": "send_email", "preview": kw, "requires_confirmation": True},
    "send_sms": lambda **kw: {"action": "send_sms", "preview": kw, "requires_confirmation": True},
}
```

**Step 3: Build the loop.** The core pattern:
```python
for _ in range(8):  # Safety limit
    response = client.models.generate_content(model, config, contents=history)
    
    tool_calls = [p.function_call for p in response.parts if hasattr(p, 'function_call') and p.function_call]
    text = "".join(p.text for p in response.parts if hasattr(p, 'text') and p.text)
    
    if not tool_calls:  # Final response
        history.append({"role": "model", "parts": [{"text": text}]})
        return {"text": text, "history": history, "structured_data": structured_data, ...}
    
    # Execute tools and feed results back
    results = []
    for call in tool_calls:
        result = TOOL_FUNCTIONS[call.name](**dict(call.args))
        results.append({"function_response": {"name": call.name, "response": result}})
        # Track structured outputs for frontend cards
        if call.name == "generate_action_plan": structured_data["action_plan"] = result
        if call.name in ("place_call","send_email","send_sms"): structured_data.setdefault("pending_actions",[]).append(result)
    
    history.append({"role": "model", "parts": [{"function_call": ...} for each call]})
    history.append({"role": "user", "parts": results})
    # Loop continues — Gemini may call MORE tools
```

**The key insight**: After executing tools, you add the results to the conversation and loop back to Gemini. Gemini sees the results and may decide to call *more* tools (e.g., search → eligibility → action plan → draft email) before giving its final text response. This multi-step autonomous behavior is what makes it an agent.

**Test the magic**: Send "I'm 73, I live alone, I can't afford the dentist." Check your server logs. You should see Gemini calling `search_services`, then `check_eligibility`, then `generate_action_plan` — all autonomously. The response should mention CDCP, MFAP, and potentially homemaking services with a structured action plan. **This is the core demo moment.**

### 2C. TTS Endpoint

Add to `main.py`:
```python
@app.post("/api/tts")
async def text_to_speech(text: str = Form(...)):
    from elevenlabs import ElevenLabs
    client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
    audio = client.text_to_speech.convert(
        text=text, voice_id="21m00Tcm4TlvDq8ikWAM",  # "Rachel" — warm voice
        model_id="eleven_multilingual_v2", output_format="mp3_44100_128",
    )
    audio_bytes = b"".join(audio)
    path = "/tmp/goldenguide_tts.mp3"
    with open(path, "wb") as f: f.write(audio_bytes)
    return FileResponse(path, media_type="audio/mpeg")
```

### 2D. Frontend — Rich Cards + Voice

Now build the components that make tool results look beautiful:

**`ServiceCard.jsx`** — Renders a single Kingston service. Show name (bold, large), 1-2 sentence description, phone number as a big tappable `tel:` link, address, how-to-apply text. Buttons at bottom: [📞 Call for Me] [📧 Email for Me]. Style: cornsilk background, golden border, rounded, shadow.

**`ActionPlanCard.jsx`** — **The hero component.** Title: "🎯 Your Personalized Action Plan." Numbered steps with circled numbers and emoji icons. Each step shows service name, description, phone, address. Each step has [📞 Call for Me] [📧 Email for Me] buttons. Bottom of card: [📱 Text This Plan to My Phone]. Style: golden border, generous padding, clear visual hierarchy.

**`LoadingIndicator.jsx`** — "🌟 GoldenGuide is thinking..." with three pulsing golden dots. Styled like a left-aligned agent message.

**`VoicePlayback.jsx`** — Small 🔊 button on each agent message. On click: POST text to `/api/tts`, play returned audio. Show spinner while generating.

**Parsing structured data**: The backend returns `structured_data` alongside the text response. In your `ChatWindow`, check for:
- `structured_data.action_plan` → render `<ActionPlanCard>`
- `structured_data.eligibility` → render eligibility results inline
- `structured_data.pending_actions` → render confirmation cards (Phase 3)
- `structured_data.draft` → render email/call preview (Phase 3)

Additionally, Gemini may embed JSON in its text response inside \`\`\`json blocks. Your `MessageBubble` should detect these, extract the JSON, and render the appropriate card component instead of raw JSON text.

**Test**: Send a complex query. The response should show beautiful service cards or an action plan card with numbered steps. The 🔊 button should read the response aloud. **Phase 2 is done.**

---

## PHASE 3: REAL ACTIONS — THE WOW FACTOR (Hours 12–24)

### 3A. The Confirm-Before-Acting Pattern

This is the critical design pattern. When Gemini calls `send_email`, `place_call`, or `send_sms`, the agentic loop does NOT execute the action. Instead, it returns a preview:

```json
{"action": "send_email", "preview": {"to_email": "...", "subject": "...", "body": "..."}, "requires_confirmation": true}
```

The frontend shows a confirmation card. The user reviews it and taps "Send" or "Cancel." Only then does the frontend call the separate execution endpoint (`POST /api/email`). This keeps the human in control.

### 3B. Email — SendGrid (Build First, Most Reliable)

**Backend** — `backend/tools/send_email.py`:
```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

def execute_send_email(to_email, subject, body_html):
    html = f"""<div style="font-family:Georgia; max-width:600px; margin:0 auto; padding:20px; background:#FFFAF0; border-radius:12px;">
        <h2 style="color:#B8860B;">GoldenGuide — Kingston Senior Services</h2>
        <div style="color:#2C1810; font-size:16px; line-height:1.6;">{body_html}</div>
        <hr style="border:1px solid #F5DEB3; margin:20px 0;">
        <p style="color:#8B4513; font-size:14px; font-style:italic;">Sent by GoldenGuide, an AI assistant helping Kingston seniors.</p>
    </div>"""
    try:
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        msg = Mail(from_email=(os.getenv("SENDGRID_FROM_EMAIL"), "GoldenGuide"), to_emails=to_email, subject=subject, html_content=html)
        resp = sg.send(msg)
        return {"status": "sent", "status_code": resp.status_code}
    except Exception as e:
        return {"status": "error", "message": str(e)}
```

Add endpoint to `main.py`: `POST /api/email` accepts `{to_email, subject, body_html}`.

**Frontend** — Build `EmailPreview.jsx`: Shows To, Subject, Body fields (readonly). Three buttons: [✅ Send Now] → calls `/api/email` → shows "✅ Email sent!" [✏️ Edit] → makes fields editable. [❌ Cancel] → dismisses card.

**Test**: Get the agent to draft an email, confirm it, and check your inbox. Should arrive in < 5 seconds.

### 3C. SMS — Twilio Programmable Messaging

**Backend** — `backend/tools/send_sms.py`:
```python
from twilio.rest import Client
import os

def execute_send_sms(to_number, message, caregiver_number=None):
    client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
    body = f"📋 GoldenGuide Action Plan\n\n{message}\n\nQuestions? Call 613-546-0000"
    results = []
    sms = client.messages.create(to=to_number, from_=os.getenv("TWILIO_PHONE_NUMBER"), body=body)
    results.append({"to": to_number, "status": sms.status})
    if caregiver_number:
        cg = client.messages.create(to=caregiver_number, from_=os.getenv("TWILIO_PHONE_NUMBER"),
                                     body=f"📋 GoldenGuide: Your family member's plan:\n\n{message}")
        results.append({"to": caregiver_number, "status": cg.status})
    return {"status": "sent", "messages": results}
```

Add `POST /api/sms` endpoint accepting `{to_number, message, caregiver_number}`.

**Frontend** — Build `SmsCard.jsx`: Phone number input (large, `inputMode="tel"`). Optional "Also send to caregiver" checkbox with second input. [📱 Send Text] button → calls `/api/sms` → "✅ Text sent!"

⚠️ **Twilio trial only texts verified numbers.** This is fine for demo — your phones are verified.

### 3D. Phone Call — ElevenLabs + Twilio

**Backend** — `backend/tools/place_call.py`:
```python
import requests, os

def execute_place_call(to_number, purpose, service_name, message_script):
    # Try ElevenLabs Conversational AI first
    try:
        resp = requests.post(
            "https://api.elevenlabs.io/v1/convai/twilio/outbound-call",
            headers={"xi-api-key": os.getenv("ELEVENLABS_API_KEY"), "Content-Type": "application/json"},
            json={
                "agent_id": os.getenv("ELEVENLABS_AGENT_ID"),
                "agent_phone_number_id": os.getenv("ELEVENLABS_PHONE_ID"),
                "to_number": to_number,
                "conversation_config_override": {
                    "agent": {"prompt": {"prompt": f"Calling about: {purpose} for {service_name}. Say: {message_script}"}}
                }
            }, timeout=15)
        if resp.status_code == 200:
            return {"status": "calling", "details": resp.json()}
    except: pass
    
    # Fallback: Twilio built-in TTS
    from twilio.rest import Client
    client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
    call = client.calls.create(
        to=to_number, from_=os.getenv("TWILIO_PHONE_NUMBER"),
        twiml=f'<Response><Say voice="Polly.Joanna">{message_script}</Say></Response>')
    return {"status": "calling", "call_sid": call.sid, "method": "twilio_fallback"}
```

Add `POST /api/call` endpoint.

**Frontend** — Build `CallPreview.jsx`: Shows "Calling: [name]", phone number, script text. [✅ Place Call] → calls `/api/call` → transitions to `CallStatus.jsx` (pulsing red dot, "📞 Live Call", timer, [📴 End] button).

**Test**: Place a call to your teammate. Their phone should ring. They hear a warm AI voice.

### 3E. Voice Input (Microphone)

Build `VoiceInput.jsx`:
```jsx
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
// Set: recognition.continuous = false; recognition.interimResults = false; recognition.lang = 'en-CA';
// On start: button turns red + pulses + "Listening..."
// On result: extract transcript, call onSend(transcript)
// If SpeechRecognition is null: hide the mic button
```

Big mic button in `ChatInput`, always visible. Works on Chrome (desktop + mobile). May not work on Firefox/Safari — that's fine.

### 3F. Document Upload

Build `DocumentUpload.jsx` — a 📎 button in `ChatInput` that opens a file picker (`accept="image/*,.pdf"`). On select, show a small thumbnail, then send via `FormData` to `POST /api/chat/image` (which accepts `multipart/form-data` with message + history + image file).

Backend: add a `/api/chat/image` endpoint that base64-encodes the image and passes it to `agent_chat()` with `image_data` and `image_mime`. In the agentic loop, include the image as an `inline_data` part in the user message. Gemini's vision model reads it automatically.

**Test**: Upload a photo of any official-looking letter. The agent should explain it in plain English.

---

## PHASE 4: POLISH + DEPLOY (Hours 24–32)

### 4A. Error Handling

- Wrap every external API call (`genai`, `twilio`, `sendgrid`, `elevenlabs`, `requests`) in try/except
- If SendGrid fails → try Gmail SMTP fallback (use `smtplib` with a Gmail App Password)
- If ElevenLabs call fails → Twilio `<Say>` fallback is already built into place_call
- If Gemini takes > 15 seconds → show "This is taking a moment, hang tight..."
- If any tool throws → return `{"error": "..."}` to Gemini so it can recover gracefully
- Never crash. Never show a stack trace to the user.

### 4B. Demo Safety Net

Save one complete successful conversation as `demo_cache.json`:
```json
{
  "input": "I'm 73, I live alone, I can't afford the dentist",
  "response": { "text": "...", "structured_data": { "action_plan": {...} } }
}
```

Add a hidden keyboard shortcut (e.g., `Ctrl+Shift+D`) in the frontend that loads and displays this cached response. If the live API fails during the demo, hit the shortcut.

### 4C. Deploy to Vultr

1. Spin up an Ubuntu 24 instance (cheapest with 2GB+ RAM)
2. SSH in: `ssh root@your-ip`
3. Install deps: `apt update && apt install python3-pip nodejs npm nginx -y`
4. Upload your project (scp, git clone, etc.)
5. Backend: `cd backend && pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --port 8000 &`
6. Frontend: `cd frontend && npm install && npm run build && npx serve out -l 3000 &`
7. Open firewall: `ufw allow 8000 && ufw allow 3000`
8. Update `NEXT_PUBLIC_API_URL` and `SERVER_URL` to your Vultr IP

**Or just demo from localhost** — only deploy if you have time and want the Vultr prize.

### 4D. Visual Polish Checklist

Go through every screen:
- [ ] All text ≥ 18px
- [ ] All buttons ≥ 48x48px touch target
- [ ] Dark text on light backgrounds (contrast ratio OK)
- [ ] Cards have `rounded-xl` and subtle `shadow-sm`
- [ ] Input bar doesn't hide behind mobile keyboard
- [ ] Auto-scroll to newest message works
- [ ] No console errors
- [ ] Works on 375px mobile viewport

---

## PHASE 5: SUBMIT + PITCH (Hours 32–36)

### 5A. Devpost Submission

Fill in all fields:
- **Title**: GoldenGuide — Your Kingston Services Agent
- **What it does**: 2-3 paragraphs (problem → solution → 3 real actions)
- **How we built it**: List every technology
- **Prizes**: Main Track, City of Kingston, Gemini, ElevenLabs, Vultr, National Bank, Gradium
- **Screenshots**: Welcome screen, action plan card, email preview, call status
- **Demo video**: 2-minute screen recording as backup

### 5B. The 3-Minute Pitch

| Time | What |
|------|------|
| 0:00–0:15 | **Hook**: "What if your grandmother had a personal assistant who knew every Kingston service, could check what she qualifies for, and make the phone call for her?" |
| 0:15–0:35 | **Problem**: Services are scattered, buried in PDFs, process is overwhelming |
| 0:35–0:55 | **Solution**: GoldenGuide — personal municipal agent, takes real action |
| 0:55–1:55 | **Demo Part 1**: Speak into mic → agent thinks → action plan appears |
| 1:55–2:35 | **Demo Part 2**: Email — tap send → "check your inbox" → judge's phone buzzes |
| 2:35–3:25 | **Demo Part 3**: Phone call rings teammate's phone + SMS arrives on your phone |
| 3:25–3:40 | **Close**: "Margaret asked one question. GoldenGuide found 5 services, sent an email, called the dental program, and texted the plan to her daughter." |

### 5C. Q&A Prep

| Question | Your Answer |
|----------|-------------|
| How is this different from ChatGPT? | Kingston-specific data, takes real autonomous actions, elderly-focused UI |
| What about accuracy? | Grounded in real scraped city data. Says "I'm not sure" over hallucinating. |
| Privacy? | No data stored, no login, ephemeral sessions. AI identifies itself on every call. |
| How does it scale? | Re-scrape city data periodically. Could embed on cityofkingston.ca. |
| Why real actions? | Knowing about a service and actually accessing it are two different things. |

Practice the full pitch **5+ times** with a timer. Practice the Q&A with your teammate throwing curveballs.

---

## IF YOU'RE BEHIND — WHAT TO CUT

Cut from bottom up:

| Priority | Feature | Notes |
|----------|---------|-------|
| 🔴 CRITICAL | Chat + Gemini + Kingston data | No project without this |
| 🔴 CRITICAL | 3 agentic tools (search, eligibility, action plan) | Makes it an agent |
| 🔴 CRITICAL | Action Plan Card component | The visual centerpiece |
| 🟠 HIGH | Voice playback (ElevenLabs TTS) | Needed for ElevenLabs prize |
| 🟠 HIGH | Email action (SendGrid) | Easiest, most reliable "drop moment" |
| 🟡 MEDIUM | Voice input (microphone) | Important for "voice-first" story |
| 🟡 MEDIUM | SMS action | Good "drop moment" — pull out phone |
| 🟡 MEDIUM | Phone call action | Hardest but most impressive |
| 🟢 LOW | Document upload/explain | Nice-to-have |
| 🟢 LOW | Transit GTFS | Low demo impact |
| 🟢 LOW | Vultr deployment | Only for Vultr prize |

**Minimum winning demo**: Chat + 3 tools + action plan card + TTS + email action = still crushes it.

---

*You've got this. Go make Kingston proud. 🌟*
