# 🚀 GoldenGuide: Real Actions That Actually Execute

## The Upgrade: From "Here's What to Do" → "Done."

The agentic version plans and prepares. **This version executes.** Three real-world actions the agent can take autonomously — each confirmed by the user with a single tap, then executed for real in the demo.

These three were chosen for maximum demo impact with minimum implementation risk. Don't add more — these three, done well, will be the most memorable thing any judge sees all weekend.

---

## Action 1: 📞 AI Calls the Office For You (THE Demo Moment)

**What happens**: The senior says "I'm nervous about calling — can you do it for me?" GoldenGuide places a **real phone call** to the service office using a warm AI voice, introduces itself on behalf of the user, and makes the inquiry.

**Why this wins the hackathon**: A judge's phone rings. They pick up. A warm, grandmotherly voice says "Hello, I'm calling on behalf of a Kingston resident to inquire about the Municipal Fee Assistance Program..." — that's the moment they decide you win. No other team will have this.

### How It Works (User Experience)

```
┌──────────────────────────────────────────────────────────────┐
│ GoldenGuide: I've prepared a call to the MFAP office.       │
│ Here's what I'll say on your behalf:                         │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 📞 CALL PREVIEW                                         │ │
│ │                                                         │ │
│ │ Calling: Municipal Fee Assistance Program                │ │
│ │ Number: 613-546-2695 ext 4906                           │ │
│ │                                                         │ │
│ │ "Hello, my name is GoldenGuide and I'm an AI            │ │
│ │ assistant calling on behalf of a 73-year-old Kingston    │ │
│ │ resident who lives alone and is interested in the       │ │
│ │ Municipal Fee Assistance Program. Could you please      │ │
│ │ provide information about eligibility requirements      │ │
│ │ and the application process? I'll relay this            │ │
│ │ information back to the resident. Thank you."           │ │
│ │                                                         │ │
│ │     [✅ Place Call]         [✏️ Edit First]              │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ 🔊 "Would you like me to make this call now, or would you   │
│     prefer to edit what I'll say first?"                     │
└──────────────────────────────────────────────────────────────┘

        User taps [✅ Place Call]

┌──────────────────────────────────────────────────────────────┐
│ 📞 CALLING... Municipal Fee Assistance Program               │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │  🔴 Live Call in Progress                                │ │
│ │                                                         │ │
│ │  ● Connected                                            │ │
│ │  ● Duration: 0:23                                       │ │
│ │  ● GoldenGuide is speaking on your behalf...            │ │
│ │                                                         │ │
│ │  Live transcript:                                       │ │
│ │  🤖 "Hello, my name is GoldenGuide and I'm calling     │ │
│ │     on behalf of a Kingston resident..."                │ │
│ │  👤 "Hi there, I can help with that. The MFAP is       │ │
│ │     available to residents with income below..."        │ │
│ │                                                         │ │
│ │     [🔇 Mute]  [🤚 Take Over Call]  [📴 End Call]      │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Technical Implementation

**Stack**: Twilio (phone infrastructure) + ElevenLabs Conversational AI (voice agent)

**Setup required** (do this BEFORE the hackathon):
1. Create a Twilio account → free trial gives **$15.50 in credits** (voice calls to Canada are ~$0.014/min — that's ~1,100 minutes of calling)
2. Get a Twilio phone number (free with trial)
3. Verify the demo phone numbers you'll call (Twilio trial requires this)
4. Create an ElevenLabs Conversational AI agent in their dashboard

**Twilio trial limitations to know**:
- Can only call **verified phone numbers** (pre-register your teammate's + a demo phone)
- Calls include "Sent from Twilio trial account" prefix (mention during demo: "In production we'd use a paid Twilio account")
- Max 10 minutes per call, max 5 concurrent calls
- $15.50 free credits = plenty for a hackathon

**Architecture**:
```
User taps "Place Call"
       │
       ▼
┌─────────────────────┐
│  Your FastAPI        │──── POST /api/call ────┐
│  Backend             │                         │
└─────────────────────┘                         │
                                                 ▼
                                    ┌────────────────────────┐
                                    │  Twilio REST API        │
                                    │  client.calls.create()  │
                                    │                         │
                                    │  Initiates outbound     │
                                    │  call to target number  │
                                    └────────────┬───────────┘
                                                 │
                                        Call connects
                                                 │
                                                 ▼
                                    ┌────────────────────────┐
                                    │  Twilio Media Streams   │
                                    │  (WebSocket)            │
                                    │                         │
                                    │  Streams audio          │
                                    │  bidirectionally        │
                                    └────────────┬───────────┘
                                                 │
                                                 ▼
                                    ┌────────────────────────┐
                                    │  ElevenLabs             │
                                    │  Conversational AI      │
                                    │                         │
                                    │  Handles the actual     │
                                    │  conversation with a    │
                                    │  warm, natural voice    │
                                    └────────────────────────┘
```

**Backend Code** (Python — simplified for hackathon):

```python
from twilio.rest import Client
from fastapi import FastAPI, WebSocket
import os

twilio_client = Client(
    os.environ["TWILIO_ACCOUNT_SID"],
    os.environ["TWILIO_AUTH_TOKEN"]
)

TWILIO_NUMBER = os.environ["TWILIO_PHONE_NUMBER"]
SERVER_URL = os.environ["SERVER_URL"]  # Your Vultr public URL

@app.post("/api/call")
async def place_call(request: CallRequest):
    """Agent decides to make a call — Twilio initiates it."""
    
    call = twilio_client.calls.create(
        to=request.target_number,        # e.g. the MFAP office
        from_=TWILIO_NUMBER,
        url=f"{SERVER_URL}/twiml/outbound?prompt={request.encoded_prompt}",
        status_callback=f"{SERVER_URL}/api/call-status",
        record=True  # Record for transcript/summary later
    )
    
    return {"call_sid": call.sid, "status": "initiated"}


@app.route("/twiml/outbound", methods=["POST"])
def outbound_twiml():
    """When Twilio connects the call, stream audio to ElevenLabs."""
    prompt = request.args.get("prompt")
    
    # TwiML tells Twilio to open a WebSocket media stream to our server
    response = f"""<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Connect>
            <Stream url="wss://{SERVER_URL}/media-stream">
                <Parameter name="prompt" value="{prompt}"/>
            </Stream>
        </Connect>
    </Response>"""
    return response


@app.websocket("/media-stream")
async def media_stream(websocket: WebSocket):
    """Bridge between Twilio audio stream and ElevenLabs Conversational AI."""
    await websocket.accept()
    
    # Connect to ElevenLabs Conversational AI WebSocket
    elevenlabs_ws = await connect_to_elevenlabs(
        agent_id=os.environ["ELEVENLABS_AGENT_ID"]
    )
    
    # Bidirectional audio bridge:
    # Twilio caller audio → ElevenLabs (for understanding)
    # ElevenLabs response audio → Twilio (for speaking)
    async for message in websocket.iter_text():
        data = json.loads(message)
        
        if data["event"] == "media":
            # Forward caller's audio to ElevenLabs
            await elevenlabs_ws.send(data["media"]["payload"])
        
        # Forward ElevenLabs audio back to Twilio
        elevenlabs_response = await elevenlabs_ws.recv()
        await websocket.send_json({
            "event": "media",
            "streamSid": data.get("streamSid"),
            "media": {"payload": elevenlabs_response}
        })
```

**ElevenLabs Agent Configuration** (set up in their dashboard or via API):
- **Voice**: Choose a warm, mature voice (not young/perky — match the brand)
- **System prompt**: "You are GoldenGuide, an AI assistant calling on behalf of an elderly Kingston resident. Be polite, clear, and concise. Introduce yourself, explain you are an AI assistant, state the purpose of the call, and ask for the information the resident needs. Thank them for their time."
- **Knowledge base**: Upload the Kingston services data so the agent can answer follow-up questions during the call

**SIMPLER FALLBACK** (if WebSocket bridge is too complex for 36 hrs):

Use Twilio's `<Say>` or `<Play>` to deliver a one-way message — not a full conversation, but still a real phone call:

```python
@app.route("/twiml/outbound", methods=["POST"])
def outbound_twiml():
    """Simpler version: play pre-generated ElevenLabs audio."""
    
    # Pre-generate the message audio with ElevenLabs TTS API
    audio_url = generate_elevenlabs_audio(
        "Hello, my name is GoldenGuide and I'm calling on behalf of "
        "a 73-year-old Kingston resident to inquire about the Municipal "
        "Fee Assistance Program. Could you please provide information "
        "about eligibility and the application process? "
        "The resident can be reached at 613-555-0123. Thank you."
    )
    
    response = f"""<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Play>{audio_url}</Play>
    </Response>"""
    return response
```

This simpler version:
- ✅ Makes a real phone call
- ✅ Uses ElevenLabs voice (warm, natural)
- ✅ Delivers the message to the recipient
- ❌ Can't have a back-and-forth conversation
- Still absolutely impressive for a demo

**Demo strategy**: Pre-verify your teammate's phone number. During the pitch, say "Let me show you GoldenGuide placing a call on behalf of our user..." → Your teammate's phone rings live on stage. Even if it's a one-way message, the judges will lose their minds.

---

## Action 2: 📧 Sends the Email For Real

**What happens**: The agent drafts an email to a service provider, shows a preview, and when the user taps "Send" — the email actually sends. During the demo, a judge provides their email address and receives the email in real time on their phone.

### How It Works (User Experience)

```
┌──────────────────────────────────────────────────────────────┐
│ GoldenGuide: I've drafted an email to the Homemaking         │
│ Services office. Here's what it says:                        │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 📧 EMAIL READY TO SEND                                  │ │
│ │                                                         │ │
│ │ To: housing@cityofkingston.ca                           │ │
│ │ From: GoldenGuide (on your behalf)                      │ │
│ │ Subject: Homemaking Services Inquiry — Senior Resident  │ │
│ │                                                         │ │
│ │ Dear Housing and Social Services,                       │ │
│ │                                                         │ │
│ │ I am writing on behalf of a 73-year-old Kingston        │ │
│ │ resident who lives alone and would like to learn more   │ │
│ │ about the subsidized homemaking services program.       │ │
│ │ Could you please provide information about...           │ │
│ │                                                         │ │
│ │    [✅ Send Now]    [✏️ Edit]    [❌ Cancel]             │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ 🔊 "I've prepared an email. Shall I send it?"               │
└──────────────────────────────────────────────────────────────┘

        User taps [✅ Send Now]

┌──────────────────────────────────────────────────────────────┐
│ ✅ Email sent successfully!                                   │
│                                                              │
│ I sent the inquiry to housing@cityofkingston.ca.             │
│ You should expect a reply within 2-3 business days.          │
│                                                              │
│ 🔊 "Done! Your email has been sent. They usually reply       │
│     within a few days. Would you like me to set a reminder   │
│     to follow up if you don't hear back?"                    │
│                                                              │
│ [🗓 Yes, remind me in 5 days]    [No thanks]                 │
└──────────────────────────────────────────────────────────────┘
```

### Technical Implementation

**Stack**: Python `smtplib` with a Gmail app password (simplest — zero dependencies, zero cost, works in 10 minutes)

> Note: SendGrid retired its free tier in July 2025, so Gmail SMTP is actually the most reliable free option for a hackathon.

**Setup** (5 minutes):
1. Create a dedicated Gmail account (e.g., `goldenguide.kingston@gmail.com`)
2. Enable 2FA on the account
3. Generate an App Password (Google Account → Security → App Passwords)
4. Store as environment variable

**Backend Code** (this is genuinely all you need):

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

GMAIL_ADDRESS = "goldenguide.kingston@gmail.com"
GMAIL_APP_PASSWORD = os.environ["GMAIL_APP_PASSWORD"]

@app.post("/api/send-email")
async def send_email(request: EmailRequest):
    """Actually sends the email drafted by the agent."""
    
    msg = MIMEMultipart()
    msg["From"] = f"GoldenGuide <{GMAIL_ADDRESS}>"
    msg["To"] = request.to_email
    msg["Subject"] = request.subject
    
    # Nice HTML email body
    html_body = f"""
    <div style="font-family: Georgia, serif; font-size: 16px; color: #2C1810; 
                max-width: 600px; margin: 0 auto;">
        <div style="background: #F5DEB3; padding: 20px; border-radius: 8px;">
            <h2 style="color: #8B4513;">🌟 GoldenGuide</h2>
            <p style="font-size: 13px; color: #666;">
                This email was sent by GoldenGuide, an AI assistant helping 
                a Kingston senior access municipal services.
            </p>
        </div>
        <div style="padding: 20px;">
            {request.body_html}
        </div>
        <div style="background: #FFF8DC; padding: 15px; border-radius: 8px; 
                    font-size: 13px; color: #666;">
            <p>Sent via GoldenGuide — Helping Kingston seniors access the 
               services they deserve.</p>
        </div>
    </div>
    """
    
    msg.attach(MIMEText(html_body, "html"))
    
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        server.send_message(msg)
    
    return {"status": "sent", "to": request.to_email}
```

**Demo strategy**: Ask a judge for their email address. Type/speak it in. The agent drafts the email, judge watches it appear on screen, user taps "Send" → judge's phone buzzes with the email within 5 seconds. **Live proof it works.**

---

## Action 3: 📱 Texts the Action Plan to Your Phone (or a Caregiver's)

**What happens**: After generating the action plan, GoldenGuide texts a clean summary to the user's phone — or to a family member/caregiver. This means the senior walks away from the conversation with the plan in their pocket, literally.

### Why This One Matters

Seniors may not remember everything from a conversation, and many don't know how to bookmark or screenshot. Texting the plan to their phone (or a caregiver who helps them) means the information **persists** in the real world. This also opens the door to the caregiver use case — "Text this to my daughter so she can help me with Step 2."

### How It Works (User Experience)

```
┌──────────────────────────────────────────────────────────────┐
│ GoldenGuide: I've created your action plan! Want me to       │
│ text it to your phone so you have it handy?                  │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 📱 TEXT ACTION PLAN                                      │ │
│ │                                                         │ │
│ │ Send to: [  613-555-____  ]                             │ │
│ │                                                         │ │
│ │ Preview:                                                │ │
│ │ "🌟 Your GoldenGuide Plan:                              │ │
│ │  1. Apply for MFAP → 613-546-2695 x4906                │ │
│ │  2. Call CDCP for dental → 1-833-537-4342               │ │
│ │  3. Visit Lionhearts Food → see mfap.ca                 │ │
│ │  Full plan: goldenguide.app/plan/abc123"                │ │
│ │                                                         │ │
│ │ ☐ Also send to a family member/caregiver                │ │
│ │   [  ___-___-____  ]                                    │ │
│ │                                                         │ │
│ │     [📱 Send Text]       [Skip]                         │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

        User taps [📱 Send Text]

┌──────────────────────────────────────────────────────────────┐
│ ✅ Text sent to 613-555-1234!                                │
│ ✅ Text sent to 613-555-5678 (your daughter Sarah)           │
│                                                              │
│ 🔊 "I've texted your plan to both you and Sarah.            │
│     You'll have all the phone numbers and steps right        │
│     on your phone whenever you need them."                   │
└──────────────────────────────────────────────────────────────┘
```

### Technical Implementation

**Stack**: Twilio SMS API (same Twilio account you set up for calling)

**Twilio trial**: Can send SMS to verified numbers only, messages prefixed with "Sent from your Twilio trial account." SMS to Canada costs $0.0079/msg — your $15.50 trial credit covers ~1,900 messages.

**Backend Code**:

```python
@app.post("/api/send-sms")
async def send_sms(request: SMSRequest):
    """Send the action plan summary via SMS."""
    
    # Format the action plan as a clean text message
    sms_body = f"""🌟 Your GoldenGuide Action Plan:

{chr(10).join(f"{i+1}. {step['action']} → {step['phone']}" 
              for i, step in enumerate(request.steps))}

Full details: {request.plan_url}
Reply HELP for assistance."""
    
    message = twilio_client.messages.create(
        body=sms_body,
        from_=TWILIO_NUMBER,
        to=request.phone_number
    )
    
    results = [{"to": request.phone_number, "status": "sent", "sid": message.sid}]
    
    # If caregiver number provided, send to them too
    if request.caregiver_number:
        caregiver_msg = twilio_client.messages.create(
            body=f"""Hi! GoldenGuide helped your family member find Kingston services today.

Here's their plan:
{chr(10).join(f"{i+1}. {step['action']} → {step['phone']}" 
              for i, step in enumerate(request.steps))}

They might appreciate your help with Step 1. 💛
Full details: {request.plan_url}""",
            from_=TWILIO_NUMBER,
            to=request.caregiver_number
        )
        results.append({"to": request.caregiver_number, "status": "sent"})
    
    return {"results": results}
```

**Demo strategy**: Pre-verify your own phone number + your teammate's. During the demo, generate the action plan, then text it — pull your phone out and show the judges the actual SMS that just arrived. The caregiver angle adds emotional weight: "It also texts the plan to the user's daughter, so she can help Mom with the application."

---

## Updated Gemini Tool Declarations (Add These Three)

Add these to your existing function declarations:

```python
{
    "name": "place_call",
    "description": "Place a real phone call to a Kingston service office on behalf of the user. The AI will call the number and deliver the message using a warm, natural voice. ALWAYS show the user what you plan to say and get confirmation before calling.",
    "parameters": {
        "type": "object",
        "properties": {
            "target_number": {
                "type": "string",
                "description": "Phone number to call, e.g. '6135462695'"
            },
            "recipient_name": {
                "type": "string",
                "description": "Who is being called, e.g. 'MFAP Office'"
            },
            "message_script": {
                "type": "string",
                "description": "What the AI voice will say on the call"
            },
            "user_context": {
                "type": "string",
                "description": "Brief context about the user to inform the call"
            }
        },
        "required": ["target_number", "recipient_name", "message_script"]
    }
},
{
    "name": "send_email",
    "description": "Send a real email to a Kingston service provider on behalf of the user. ALWAYS show the user the draft and get confirmation before sending.",
    "parameters": {
        "type": "object",
        "properties": {
            "to_email": {
                "type": "string",
                "description": "Recipient email address"
            },
            "subject": {
                "type": "string",
                "description": "Email subject line"
            },
            "body": {
                "type": "string",
                "description": "Email body text"
            },
            "recipient_name": {
                "type": "string",
                "description": "Name of the recipient/department"
            }
        },
        "required": ["to_email", "subject", "body"]
    }
},
{
    "name": "send_sms",
    "description": "Text the user's action plan or key information to their phone (or a caregiver's phone). Use this after generating an action plan to ensure the user walks away with the info in their pocket.",
    "parameters": {
        "type": "object",
        "properties": {
            "phone_number": {
                "type": "string",
                "description": "User's phone number"
            },
            "caregiver_number": {
                "type": "string",
                "description": "Optional: caregiver/family member phone number"
            },
            "message": {
                "type": "string",
                "description": "The text message content (will be formatted as action plan summary)"
            }
        },
        "required": ["phone_number", "message"]
    }
}
```

---

## Critical Design Pattern: Confirm Before Acting

Every real action MUST follow this pattern:

```
Agent proposes action → Shows preview → User confirms → Action executes
```

This is non-negotiable for three reasons:

1. **Trust**: Elderly users need to feel in control. "I'm about to call the dental office for you — here's what I'll say. Should I go ahead?" builds trust. Executing without asking would be terrifying.

2. **Demo clarity**: Judges need to see the preview to understand what's happening. The confirmation step gives you a natural pause to explain during the pitch.

3. **Safety**: Prevents the AI from accidentally calling wrong numbers or sending emails with errors.

**Frontend implementation**: When the agent returns a `place_call`, `send_email`, or `send_sms` tool call, your frontend should:
1. **NOT** execute immediately
2. Render a preview card with the details
3. Show [✅ Confirm] and [✏️ Edit] buttons
4. Only hit the backend API endpoint when user confirms

```jsx
// React component pattern
function ActionConfirmation({ action, onConfirm, onEdit }) {
  // action.type is "place_call" | "send_email" | "send_sms"
  
  return (
    <div className="action-card">
      <ActionPreview action={action} />
      <div className="action-buttons">
        <button onClick={() => onConfirm(action)} className="confirm-btn">
          {action.type === "place_call" ? "📞 Place Call" :
           action.type === "send_email" ? "📧 Send Email" :
           "📱 Send Text"}
        </button>
        <button onClick={() => onEdit(action)} className="edit-btn">
          ✏️ Edit First
        </button>
      </div>
    </div>
  );
}
```

---

## Updated Demo Flow (3 Minutes)

### Hook → Problem → Solution (45 sec, same as before)

### Demo (105 sec — extended to show actions)

**Minute 1 (Search + Plan)**:
1. Open the app, speak: "I'm 73, I live alone, I can't afford the dentist"
2. Agent searches → checks eligibility → generates action plan
3. Show the 3-step plan with beautiful cards

**Minute 2 (Email — LIVE)**:
4. Tap "📧 Email Draft Ready" on the MFAP step
5. Agent shows the pre-written email
6. "For the demo, let me send this to [judge's email]..." → Tap Send
7. Judge's phone buzzes → **"Check your inbox."** 🎤 drop moment

**Minute 3 (Call + Text — LIVE)**:
8. Tap "📞 Call for Me" on the dental step
9. Agent shows the call script preview → Tap "Place Call"
10. Teammate's phone rings on the demo table → They answer → ElevenLabs voice speaks
11. While the call plays, tap "📱 Text Plan to My Phone"
12. Your phone buzzes with the full action plan summary

### Close (15 sec):
"Margaret asked one question. GoldenGuide found 5 services she didn't know about, checked her eligibility, built a step-by-step plan, sent an email to the housing office, called the dental program on her behalf, and texted the plan to her daughter. That's not a chatbot. That's an AI agent that takes real action for Kingston's most vulnerable residents."

---

## Setup Checklist (Do BEFORE the hackathon starts)

### Accounts to Create (Friday before opening ceremony)
- [ ] **Twilio**: Sign up → get phone number → verify demo phone numbers (yours + teammate's + one spare)
- [ ] **Gmail**: Create `goldenguide.kingston@gmail.com` → enable 2FA → generate App Password
- [ ] **ElevenLabs**: Sign up → create a Conversational AI agent with warm voice + Kingston knowledge base
- [ ] **Gemini**: Get API key
- [ ] **Vultr**: Set up account (use hackathon credits if available)

### Pre-Verify These Phone Numbers in Twilio
- [ ] Your personal phone (for SMS demo)
- [ ] Teammate's phone (for call demo)
- [ ] One backup number

### Environment Variables to Have Ready
```bash
# Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1613...

# Gmail SMTP
GMAIL_ADDRESS=goldenguide.kingston@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

# ElevenLabs
ELEVENLABS_API_KEY=...
ELEVENLABS_AGENT_ID=...

# Gemini
GEMINI_API_KEY=...

# Server
SERVER_URL=https://your-vultr-instance.com
```

---

## How This Stacks Prize Tracks

| Action | Prize Track Impact |
|--------|-------------------|
| 📞 AI Phone Call | **ElevenLabs** (core voice feature — not just TTS, actual voice agent calling), **City of Kingston** (direct service access improvement) |
| 📧 Real Email | **City of Kingston** (reduces barriers to service access), **Main Track** (goes far beyond basic LLM) |
| 📱 SMS Action Plan | **City of Kingston** (persistent access to service info), **Main Track** (multi-channel delivery) |
| All three together | Demonstrates **Gemini function calling** (best use of Gemini), deployed on **Vultr**, built with **National Bank** social impact angle |

The three real actions transform GoldenGuide from "impressive chatbot" to "the only project at QHacks that actually did something in the real world during the demo." That's how you win.
