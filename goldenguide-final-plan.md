# 🏆 GoldenGuide — Complete Project Plan for QHacks 2026

> **One-liner**: GoldenGuide is a voice-first agentic AI that helps elderly Kingston residents discover, understand, and *actually access* municipal services through natural conversation — it doesn't just tell you what's available, it makes the phone call, sends the email, and texts you the plan.

---

# PART 1: COMPETITION INTELLIGENCE

## 1.1 QHacks 2026 Overview

- **Event**: QHacks 2026 — Queen's University's 11th annual hackathon
- **Dates**: February 6–8, 2026 (36 hours)
- **Location**: Queen's University, Kingston, Ontario
- **Theme**: **"The Golden Age"**
- **Team size**: 2 people
- **Format**: Design, develop, and demo from scratch in 36 hours

**Theme description from Devpost**: "For the main prize track, we are looking for projects that strive to 'Improve the Future Quality of Life' by building a sustainable and altruistic world. Participants should develop solutions that aim to spark a new 'Golden Era' specifically for vulnerable communities or aging industries. Whether you are revitalizing old systems or creating brand-new tools for social good, your project should focus on long-term sustainability."

## 1.2 Judging Criteria (Five Categories, Equally Weighted)

| Category | What Judges Look For |
|----------|---------------------|
| **Implementation** | Working features, appropriate tech choices, scalability potential |
| **Design & UX** | Aesthetics, ease-of-use, accessibility, consistency |
| **Innovation & Social Impact** | Market need, feasibility, target audience, creative problem-solving |
| **Pitch & Presentation** | Clarity, structure, demo effectiveness, Q&A handling |
| **Theme Alignment** | Explicitly states: *"Look beyond basic LLM implementation"* |

**Key insight**: The judging criteria literally warn against "basic LLM implementation." Our agentic tool-use architecture with real-world actions directly addresses this.

## 1.3 Past QHacks Winners & What We Learned

**QHacks 2025 Winners**:
1. **1st Place — "Luna"**: Wearable device for blind users using multimodal OCR (accessibility + hardware + AI)
2. **2nd Place — "TLDR.AI"**: Chrome extension that summarizes Terms of Service (practical utility + clean UX)
3. **3rd Place — "NextBid"**: AI-powered auction modernization platform (revitalizing an old industry + AI)

**QHacks 2023 Notable**: "All Eyez On Me" (3rd place) — accessibility-focused project for visually impaired users

**The winning pattern**: Real social impact for a vulnerable population + goes beyond basic LLM wrapper + polished demo + clean UI/UX + clear pitch narrative + emotional hook

## 1.4 Prize Track Strategy

We are targeting **4+ prizes simultaneously** with a single project:

| Prize Track | Prize | Why We Qualify |
|-------------|-------|----------------|
| **Main Track** | Sony WH-1000XM5 headphones | Perfect theme alignment: "Golden Age" → golden years → empowering seniors |
| **City of Kingston** | **$10,000** (pitch competition) | Directly enhances municipal service delivery, uses Kingston open data, aligned with city's Multi-Year Accessibility Plan |
| **National Bank** | $500/hacker ($1,000 total) | Social impact for vulnerable population, financial inclusion via MFAP |
| **Best Use of Gemini API** | Google swag | Core LLM with function calling, 10 registered tools, multimodal document understanding, structured output |
| **Best Use of ElevenLabs** | Wireless earbuds | Voice output as a CORE feature (not bolt-on) + Conversational AI for real phone calls |
| **Best Use of Vultr** | Portable screens | Deployed on Vultr cloud compute |
| **Gradium** | $300 + 1M credits | AI-powered application |

**City of Kingston prize is the big one** ($10K). We present at a separate pitch competition for projects that improve municipal service delivery for Kingston residents. GoldenGuide is *purpose-built* for this.

---

# PART 2: THE PROBLEM

## 2.1 The Core Problem

Kingston has a rich ecosystem of services for seniors, but the gap between *services existing* and *seniors actually accessing them* is enormous.

**The information problem**:
- Information is scattered across dozens of pages on cityofkingston.ca, each with different navigation patterns
- Key details are buried in PDF documents (housing applications, program guidelines, eligibility forms)
- The city website is not designed for elderly users — small text, complex menus, jargon-heavy language
- Many seniors don't know what they're eligible for because they don't know what exists
- The alternative is calling 613-546-0000 and waiting on hold, or physically going to City Hall

**The action problem** (this is what differentiates us from a chatbot):
- Even when seniors learn about a service, the *process of accessing it* is overwhelming
- Filling forms, drafting emails, making phone calls, remembering follow-ups — each step is a friction point
- Many seniors are intimidated by bureaucracy and give up before completing the process
- Caregivers and family members are often remote and can't help in real-time

## 2.2 Real Kingston Data Supporting the Problem

| Data Point | Source |
|------------|--------|
| Kingston's subsidized homemaking services currently have a **WAITLIST** — demand outstrips supply | cityofkingston.ca |
| The Municipal Fee Assistance Program (MFAP) has a complex application requiring income verification | cityofkingston.ca |
| Kingston Transit has 45 routes and 891 stops — navigating this as a senior is daunting | Kingston GTFS data |
| City's Multi-Year Accessibility Plan explicitly calls for "providing seniors with basic computer training" and "accessible wayfinding" | Kingston Accessibility Plan |
| Canadian Dental Care Program (CDCP) provides free dental for low-income seniors 65+ — but many are unaware | Government of Canada |
| Kingston's population is aging — this problem is only growing | Census data |

**Emotional pitch hook**: "What if your grandmother had a personal assistant who knew every Kingston city service, could check what she qualifies for, draft her emails, make phone calls on her behalf, and text her the plan — all from a single conversation?"

---

# PART 3: THE SOLUTION

## 3.1 What GoldenGuide Is

GoldenGuide is a **web-based personal municipal agent** for Kingston seniors. It runs in any browser — no app download, no account creation, no tech literacy required.

**What makes it an agent (not a chatbot)**:
1. **Perceives** — Understands the user's situation from natural conversation
2. **Plans** — Determines which services to search, which eligibility checks to run, what actions to propose
3. **Executes** — Autonomously calls tools (search, eligibility check, transit lookup, email draft, phone call, SMS)
4. **Synthesizes** — Packages results into a clear, actionable response with beautiful UI components
5. **Acts** — Actually sends emails, places phone calls, texts action plans — real-world execution

## 3.2 Key Capabilities

| Capability | Description |
|-----------|-------------|
| 🎙️ **Voice-first interface** | Large microphone button, speak naturally, answers read aloud via ElevenLabs warm voice |
| 🔍 **Service discovery** | Searches all Kingston senior services by natural language query |
| ✅ **Eligibility checking** | Runs eligibility assessment across multiple programs simultaneously based on conversational context |
| 🚌 **Transit lookup** | Queries real GTFS data for routes, stops, and next departure times |
| 📋 **Action plan generation** | Creates prioritized, step-by-step plans with phone numbers and addresses |
| 📧 **Real email sending** | Drafts and sends emails to service offices on the senior's behalf via Twilio SendGrid |
| 📞 **Real phone calls** | Places outbound calls with a warm AI voice via Twilio Voice + ElevenLabs Conversational AI |
| 📱 **Real SMS** | Texts action plan summaries to the senior's phone (and optionally to a caregiver) via Twilio Programmable Messaging |
| 📄 **Document explanation** | Upload a photo of a confusing city letter → get plain English explanation + action items |
| 🗓️ **Reminder creation** | Generates downloadable .ics calendar files for follow-up dates |

## 3.3 Example Conversation Flow

```
User (speaking): "I'm 73, I live alone, and I can't afford the dentist."

[Agent internally executes]:
  → search_services("dental", "seniors", "low income")
  → search_services("fee assistance", "seniors")  
  → check_eligibility(age=73, living_alone=true, income="low", programs=["CDCP", "MFAP", "homemaking", "SPARK"])
  → generate_action_plan(eligible_services=["CDCP", "MFAP", "homemaking"])

GoldenGuide (speaks aloud + displays):
  "Great news, Margaret! Based on what you've told me, you likely qualify for 
   three programs you might not know about..."

  [Displays beautiful Action Plan Card with 3 steps]
  
  Step 1: 🦷 Canadian Dental Care Program — FREE dental for seniors 65+ with low income
          [📞 Call for Me] [📧 Email for Me]
  
  Step 2: 💰 Municipal Fee Assistance Program — discounted city services  
          [📞 Call for Me] [📧 Email for Me]
  
  Step 3: 🏠 Subsidized Homemaking Services — help keeping your home clean
          [📞 Call for Me] [📧 Email for Me]
  
  [📱 Text This Plan to My Phone]
```

---

# PART 4: TECHNICAL ARCHITECTURE

## 4.1 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│              React + Next.js + Tailwind CSS                      │
│                                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────────────┐   │
│  │  🎙️ Voice │  │  💬 Chat     │  │  📋 Action Plan /       │   │
│  │  Input    │  │  Messages    │  │  Service Cards /        │   │
│  │  (Web     │  │  (bubbles    │  │  Email Preview /        │   │
│  │  Speech   │  │  + rich      │  │  Call Status /          │   │
│  │  API)     │  │  components) │  │  SMS Confirmation       │   │
│  └──────────┘  └──────────────┘  └─────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  🔊 ElevenLabs TTS Voice Playback (reads responses)      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  📎 Document Upload (camera / file picker)                │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API (JSON)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                   │
│                 Python + FastAPI                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            🧠 Google Gemini 1.5 Pro                       │   │
│  │                                                           │   │
│  │  • System prompt with Kingston services context           │   │
│  │  • 10 registered function declarations (tools)            │   │
│  │  • Agentic loop: call → tool results → maybe more         │   │
│  │    calls → final response with structured output          │   │
│  │  • Multimodal: accepts document images for explanation     │   │
│  └────────────────────────────┬──────────────────────────────┘   │
│                               │                                  │
│              ┌────────────────┼───────────────────┐              │
│              ▼                ▼                   ▼              │
│  ┌────────────────┐ ┌─────────────────┐ ┌──────────────────┐   │
│  │ 7 Info Tools    │ │ 3 Action Tools  │ │ Knowledge Base   │   │
│  │                 │ │ (Twilio-powered)│ │                  │   │
│  │ search_services │ │ place_call      │ │ Kingston services│   │
│  │ check_elig.     │ │ send_email      │ │ GTFS transit     │   │
│  │ get_transit     │ │ send_sms        │ │ Program rules    │   │
│  │ gen_action_plan │ │                 │ │ Phone numbers    │   │
│  │ draft_comms     │ │                 │ │ Addresses        │   │
│  │ create_reminder │ │                 │ │                  │   │
│  │ explain_doc     │ │                 │ │                  │   │
│  └────────────────┘ └─────────────────┘ └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TWILIO PLATFORM                              │
│            (All 3 real actions, one account)                     │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Twilio Voice  │  │ SendGrid     │  │ Twilio Programmable  │  │
│  │ + ElevenLabs  │  │ Email API    │  │ Messaging (SMS)      │  │
│  │ native integ. │  │              │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    Vultr Cloud Compute
                    (deployment target)
```

## 4.2 The Agentic Loop (Core Pattern)

This is what makes GoldenGuide an **agent** rather than a chatbot. Gemini's function calling API lets the model decide which tools to invoke, execute them, get results back, and potentially call *more* tools before synthesizing a final response.

### The Full Gemini System Prompt (Critical)

```python
system_prompt = """You are GoldenGuide, a proactive AI agent that helps elderly Kingston, Ontario 
residents navigate and ACCESS municipal services. You don't just answer questions — you take action.

CORE BEHAVIORS:
1. PROACTIVE: When a user mentions their age, income, or situation, ALWAYS use check_eligibility 
   to scan ALL relevant programs — not just the one they asked about. Surprise them with help 
   they didn't know existed.

2. ACTION-ORIENTED: Don't just list information. Use generate_action_plan to create clear, 
   numbered steps. Use draft_communication to prepare emails and call scripts. Use create_reminder 
   for follow-ups. Your goal is to reduce the user's burden to near-zero.

3. MULTI-STEP: Chain tools together. A single user message might require you to search_services, 
   then check_eligibility, then generate_action_plan, then draft_communication. Do all of this 
   in one turn.

4. WARM & SIMPLE: Speak in plain, warm language. No jargon. No acronyms without explanation. 
   Imagine you're a friendly neighbor who happens to know everything about city services.

5. DOCUMENT HELPER: If a user uploads a photo of a letter or form, use explain_document to 
   decode it into plain English and identify what they need to do.

6. REAL ACTIONS: You can place_call, send_email, and send_sms on behalf of the user. ALWAYS 
   show a preview and get confirmation before executing any real action.

AVAILABLE KINGSTON SERVICES (in your knowledge base):
- Municipal Fee Assistance Program (MFAP) — reduced costs for many services
- Canadian Dental Care Program (CDCP) — free dental for 65+ low income
- Subsidized Homemaking Services — through Comfort Keepers
- Kingston Transit — 45 bus routes, GTFS data available
- SPARK Recreation Subsidy — $300/year toward recreation
- Affordable Housing Programs — social housing, renovations
- Community Centres — recreation programs for older adults
- Seniors Association — social programs, home maintenance help
- 211 Ontario — general social services referral
- Low-Income Health Benefits — vision, dental, prescriptions
- Lionhearts Fresh Food Market — discounted fresh food with MFAP
- Kingston Access Services — accessible transportation

ALWAYS end your response with a clear next step the user can take RIGHT NOW."""
```

### The Agentic Loop Diagram

```
User message arrives
       │
       ▼
┌──────────────────────┐
│  Inject system prompt │
│  + Kingston knowledge │
│  + conversation       │
│  history              │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│   Send to Gemini     │◄─────────────────────────────┐
│   with 10 tool       │                               │
│   declarations       │                               │
└──────────┬───────────┘                               │
           │                                           │
           ▼                                           │
    ┌──────────────┐     YES     ┌─────────────────┐  │
    │ Gemini wants │────────────►│  Execute tool(s) │──┘
    │ to call      │             │  on backend      │
    │ tool(s)?     │             │  Return results  │
    └──────┬───────┘             └─────────────────┘
           │ NO
           ▼
┌──────────────────────┐
│  Gemini returns      │
│  final text response │
│  (may include JSON   │
│   for rich UI cards) │
└──────────┬───────────┘
           ▼
    Return to frontend
    with structured data
    for rendering
```

**Key design decision — RAG shortcut**: Gemini 1.5 Pro has a 1M token context window. All Kingston senior services data fits in ~50K tokens. We concatenate all scraped data directly into the system prompt instead of building a vector database. This saves hours of setup time with zero loss of quality for our use case.

## 4.2.1 Full Agentic Flow Example

Here's what happens when a user says: *"I'm 73 and I can barely afford to eat, let alone go to the dentist"*

```
┌──────────────────────────────────────────────────────────────┐
│ USER: "I'm 73 and I can barely afford to eat, let alone      │
│        go to the dentist"                                    │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│ GEMINI THINKS: User is elderly, low income, food insecure,   │
│ needs dental care. I should:                                  │
│  1. Search for food assistance programs                       │
│  2. Search for dental programs for seniors                    │
│  3. Check eligibility for MFAP (covers multiple needs)       │
│  4. Generate an action plan                                   │
│  5. Draft communication to get started                        │
└──────────────────────┬───────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
  ┌─────────────┐ ┌──────────┐ ┌──────────────┐
  │search_      │ │search_   │ │check_        │
  │services(    │ │services( │ │eligibility(  │
  │"food help") │ │"dental   │ │age=73,       │
  │             │ │seniors") │ │income=low)   │
  └──────┬──────┘ └────┬─────┘ └──────┬───────┘
         │             │              │
         ▼             ▼              ▼
     Found:        Found:        Eligible for:
     - MFAP food   • CDCP        • MFAP ✓
       discounts   • MFAP        • CDCP ✓
     - Lionhearts    dental      • Homemaking ✓
     - 211 Ontario                • SPARK (maybe)
         │             │              │
         └─────────────┼──────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │ generate_action_plan() │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │ draft_communication()  │ ← email to MFAP office
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │ create_reminder()      │ ← "Apply for MFAP by next week"
              └────────────┬───────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ GOLDENGUIDE RESPONDS:                                         │
│                                                               │
│ 🔊 "I found several programs that can help you right away..." │
│                                                               │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ 🎯 YOUR PERSONALIZED ACTION PLAN                         │  │
│ │                                                          │  │
│ │ Step 1: Apply for Municipal Fee Assistance (MFAP)        │  │
│ │ → Unlocks: discounted food, dental, recreation, etc      │  │
│ │ 📞 613-546-2695 ext 4906  📍 362 Montreal St             │  │
│ │ [📧 Email Draft Ready] [📞 Call for Me]                   │  │
│ │                                                          │  │
│ │ Step 2: Apply for Canadian Dental Care Program            │  │
│ │ → Free dental cleanings, dentures, emergency work        │  │
│ │ 📞 1-833-537-4342                                        │  │
│ │ [📞 Call for Me] [📋 Call Script Ready]                    │  │
│ │                                                          │  │
│ │ Step 3: Visit Lionhearts Fresh Food Market                │  │
│ │ → $10 discount on fresh food (with MFAP card)            │  │
│ │ 📍 Multiple Kingston locations                            │  │
│ │ [🗓 Add reminder to visit]                                │  │
│ │                                                          │  │
│ │ [📱 Text Plan to My Phone]  [📥 Download Full Plan]       │  │
│ └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**The user asked ONE casual sentence. The agent ran 6 tools, found 5+ services, checked eligibility, generated a prioritized plan, drafted communications, and created reminders.** That's the difference between a chatbot and an agent.

## 4.2.2 Chatbot vs Agent Comparison

| Aspect | Chatbot Version | Agentic Version |
|--------|----------------|-----------------|
| User says "I need dental help" | "Here's the CDCP program, call 1-833-537-4342" | Checks eligibility, finds 3 more programs user qualifies for, generates action plan, drafts email, creates phone script, sets reminder |
| Number of tools | 0 (just LLM text generation) | 10 registered function calls |
| Judge impression | "Nice chatbot with good data" | "This is a real AI agent that takes action" |
| Theme alignment criteria | "Basic LLM implementation" | "Goes beyond basic LLM, demonstrates understanding of AI concepts" |
| User effort after using | Still needs to figure out how to apply | Everything is prepared — just click send/call/download |
| Demo energy | Moderate | Jaw-dropping — agent executing visibly in real time |

## 4.3 The 10 Agent Tools

### Information Tools (7)

**Tool 1: `search_services`**
Searches the Kingston services knowledge base by keywords, categories, or user needs. The AI decides what to search for based on context clues — the user doesn't need to know what services exist.

```python
# Gemini function declaration
{
    "name": "search_services",
    "description": "Search Kingston municipal services for seniors",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Natural language search query"},
            "category": {"type": "string", "enum": ["health", "housing", "transit", "recreation", "financial", "all"]}
        },
        "required": ["query"]
    }
}

# Backend implementation
def search_services(query: str, category: str = "all") -> list[dict]:
    """Simple keyword search over pre-built service records."""
    results = []
    for service in KINGSTON_SERVICES:
        if category != "all" and service["category"] != category:
            continue
        if any(kw in service["text"].lower() for kw in query.lower().split()):
            results.append(service)
    return results[:5]  # Top 5 matches
```

**Tool 2: `check_eligibility`**
Runs eligibility assessment for specific programs based on user-provided details (age, income, household size, residency). Proactively checks MULTIPLE programs simultaneously.

```python
{
    "name": "check_eligibility",
    "description": "Check eligibility for Kingston senior programs",
    "parameters": {
        "type": "object",
        "properties": {
            "age": {"type": "integer"},
            "income_level": {"type": "string", "enum": ["low", "medium", "high", "unknown"]},
            "household_size": {"type": "integer"},
            "lives_in_kingston": {"type": "boolean"},
            "programs_to_check": {
                "type": "array",
                "items": {"type": "string"}
            }
        },
        "required": ["age"]
    }
}

# Backend: rule-based logic using scraped eligibility criteria
def check_eligibility(age, income_level="unknown", household_size=1, 
                      lives_in_kingston=True, programs_to_check=None):
    results = {"eligible": [], "maybe_eligible": [], "not_eligible": []}
    
    if programs_to_check is None:
        programs_to_check = ["CDCP", "MFAP", "homemaking", "SPARK", "transit_discount"]
    
    for program in programs_to_check:
        if program == "CDCP" and age >= 65 and income_level in ["low", "unknown"]:
            results["eligible"].append({"program": "CDCP", "reason": "Age 65+ and low income"})
        elif program == "MFAP" and lives_in_kingston and income_level in ["low", "unknown"]:
            results["maybe_eligible"].append({"program": "MFAP", "reason": "Requires income verification"})
        # ... etc for each program
    
    return results
```

**Tool 3: `get_transit_info`**
Queries real Kingston Transit GTFS data for routes, stops, and schedules.

```python
{
    "name": "get_transit_info",
    "description": "Look up Kingston Transit bus routes, stops, and schedules",
    "parameters": {
        "type": "object",
        "properties": {
            "destination": {"type": "string"},
            "origin": {"type": "string"},
            "time": {"type": "string", "description": "Departure time or 'now'"}
        },
        "required": ["destination"]
    }
}

# Backend: parse GTFS files (routes.txt, stops.txt, stop_times.txt, calendar.txt)
# from https://api.cityofkingston.ca/gtfs/gtfs.zip
```

**Tool 4: `generate_action_plan`**
Creates a prioritized, step-by-step action plan with contact info and next steps for each eligible service.

```python
{
    "name": "generate_action_plan",
    "description": "Generate a structured, prioritized action plan for accessing services",
    "parameters": {
        "type": "object",
        "properties": {
            "services": {
                "type": "array",
                "items": {"type": "string"},
                "description": "List of service names to include in plan"
            },
            "user_context": {"type": "string", "description": "Brief summary of user's situation"}
        },
        "required": ["services"]
    }
}
```

**Tool 5: `draft_communication`**
Drafts emails or phone call scripts for the user, pre-filled with context from the conversation.

```python
{
    "name": "draft_communication",
    "description": "Draft an email or phone call script for contacting a service",
    "parameters": {
        "type": "object",
        "properties": {
            "type": {"type": "string", "enum": ["email", "call_script"]},
            "recipient_service": {"type": "string"},
            "recipient_email": {"type": "string"},
            "user_situation": {"type": "string"},
            "specific_question": {"type": "string"}
        },
        "required": ["type", "recipient_service"]
    }
}
```

**Tool 6: `create_reminder`**
Generates a downloadable `.ics` calendar file for follow-up dates, deadlines, or appointments.

```python
{
    "name": "create_reminder",
    "description": "Create a calendar reminder (.ics file) for a follow-up action",
    "parameters": {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "date": {"type": "string", "description": "ISO format date"},
            "description": {"type": "string"},
            "location": {"type": "string"}
        },
        "required": ["title", "date"]
    }
}
```

**Tool 7: `explain_document`**
Multimodal document understanding — user uploads a photo of a confusing city letter or form, Gemini explains it in plain English and extracts action items. Uses Gemini's native vision capabilities.

```python
{
    "name": "explain_document",
    "description": "Explain a confusing document (uploaded as image) in plain English",
    "parameters": {
        "type": "object",
        "properties": {
            "image_data": {"type": "string", "description": "Base64 encoded image"},
            "user_question": {"type": "string", "description": "What the user wants to know about the document"}
        },
        "required": ["image_data"]
    }
}
```

### Real Action Tools (3) — All Powered by Twilio

These are the **differentiators**. Every action follows a **confirm-before-acting** pattern: Agent proposes → Shows preview → User confirms → Action executes. This builds trust with elderly users and provides demo clarity for judges.

**Gemini Function Declarations for Action Tools**:

```python
# Add these to your tools list alongside the 7 info tools
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
                "description": "The text message content (action plan summary)"
            }
        },
        "required": ["phone_number", "message"]
    }
}
```

**Critical Design Pattern: Confirm Before Acting**

Every real action MUST follow this pattern. This is non-negotiable for three reasons:

1. **Trust**: Elderly users need to feel in control. Executing without asking would be terrifying.
2. **Demo clarity**: Judges need to see the preview to understand what's happening. The confirmation step gives you a natural pause to explain during the pitch.
3. **Safety**: Prevents the AI from accidentally calling wrong numbers or sending emails with errors.

**Frontend implementation**: When the agent returns a `place_call`, `send_email`, or `send_sms` tool call, your frontend should **NOT** execute immediately. Render a preview card, show confirm/edit buttons, only hit the backend when user confirms.

```jsx
// React component pattern for action confirmation
function ActionConfirmation({ action, onConfirm, onEdit }) {
  // action.type is "place_call" | "send_email" | "send_sms"
  
  return (
    <div className="bg-cornsilk rounded-xl p-6 border-2 border-goldenrod shadow-lg">
      <ActionPreview action={action} />
      <div className="flex gap-4 mt-4">
        <button 
          onClick={() => onConfirm(action)} 
          className="bg-green-700 text-white text-lg px-6 py-3 rounded-lg font-bold
                     min-h-[48px] hover:bg-green-800 transition"
        >
          {action.type === "place_call" ? "📞 Place Call" :
           action.type === "send_email" ? "📧 Send Email" :
           "📱 Send Text"}
        </button>
        <button 
          onClick={() => onEdit(action)} 
          className="bg-amber-100 text-brown-900 text-lg px-6 py-3 rounded-lg
                     min-h-[48px] hover:bg-amber-200 transition"
        >
          ✏️ Edit First
        </button>
      </div>
    </div>
  );
}
```

**Tool 8: `place_call`** — See Part 5.2

**Tool 9: `send_email`** — See Part 5.3

**Tool 10: `send_sms`** — See Part 5.4

---

# PART 5: UNIFIED TWILIO PLATFORM (ALL REAL ACTIONS)

## 5.1 Why Everything Runs Through Twilio

One platform, one account, one SDK, one `pip install`. This keeps the stack clean, the demo reliable, and the pitch tight.

| Action | Twilio Product | API/SDK |
|--------|---------------|---------|
| 📞 AI calls the office | **Twilio Voice** + ElevenLabs native integration | `twilio` Python SDK + ElevenLabs dashboard |
| 📧 Sends email for you | **Twilio SendGrid** | `sendgrid` Python SDK |
| 📱 Texts action plan | **Twilio Programmable Messaging** | `twilio` Python SDK |

### Twilio Free Trial Details

- **$15.50 in credits** — no credit card required
- Covers: ~1,100 minutes of calls to Canada ($0.014/min), ~1,900 SMS to Canada ($0.0079/msg)
- SendGrid adds 100 emails/day for 60 days (separate free tier)
- **Trial limitations**:
  - Can only call/text **verified phone numbers** (must pre-register demo numbers)
  - Outbound calls include a "Sent from Twilio trial account" prefix message
  - Limited to one phone number and one active sub-account
  - SMS from trial accounts are prepended with "Sent from your Twilio trial account"

### Python Dependencies

```bash
pip install twilio sendgrid python-dotenv fastapi uvicorn google-generativeai elevenlabs
```

### Environment Variables

```
# Twilio (Voice + SMS)
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+16131234567

# Twilio SendGrid (Email)
SENDGRID_API_KEY=SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_agent_id

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Server
SERVER_URL=https://your-vultr-server.com
```

## 5.2 Action 1: 📞 AI Calls the Office For You (THE Demo Moment)

**What happens**: The senior says "I'm nervous about calling — can you do it for me?" GoldenGuide places a **real phone call** using a warm AI voice, introduces itself on behalf of the user, and makes the inquiry.

**Why this wins**: A teammate's phone rings live on stage. They answer. A warm AI voice says "Hello, I'm calling on behalf of a Kingston senior resident..." — no other team will have this.

### Architecture: ElevenLabs Native Twilio Integration

ElevenLabs has a **native Twilio integration** that eliminates all custom WebSocket/TwiML code. You import your Twilio number into ElevenLabs dashboard and it handles everything automatically.

**How it works**:
1. Your Twilio phone number is imported into ElevenLabs dashboard
2. ElevenLabs automatically configures Twilio voice webhooks — no manual TwiML setup
3. An ElevenLabs Conversational AI agent is assigned to handle calls on that number
4. For outbound calls, you trigger via ElevenLabs API → Twilio places the call → ElevenLabs agent handles the conversation
5. Both purchased Twilio numbers and verified caller IDs support outbound calls

**Setup (before hackathon)**:
1. Create ElevenLabs agent with warm voice + Kingston knowledge base
2. In ElevenLabs dashboard → Phone Numbers → Import Twilio Number
3. Enter Twilio Account SID and Auth Token
4. ElevenLabs auto-detects number capabilities and configures webhooks
5. Assign your agent to the imported number
6. Test: Click "Outbound call" button → enter verified number → phone rings

**ElevenLabs Agent System Prompt**:
```
You are GoldenGuide, a helpful AI assistant calling on behalf of an elderly 
Kingston, Ontario resident. You are polite, clear, and warm.

When the call is answered:
1. Introduce yourself: "Hello, my name is GoldenGuide. I'm an AI assistant 
   calling on behalf of a Kingston senior resident."
2. State the purpose clearly and concisely.
3. Ask for the specific information the resident needs.
4. Thank them for their time.
5. Keep the call under 2 minutes.

You are NOT pretending to be human. Always identify as an AI assistant.
Be patient if the recipient is confused.

If asked questions you can't answer, say: "I don't have those details right 
now, but the resident or their caregiver can follow up. Could you let me 
know what they would need to provide?"
```

**Backend endpoint for triggering outbound calls via ElevenLabs API**:
```python
import requests
from fastapi import APIRouter

router = APIRouter()

@router.post("/api/call")
async def place_call(to_number: str, purpose: str, service_name: str):
    """Trigger an outbound call via ElevenLabs Conversational AI + Twilio."""
    
    # Option A: Use ElevenLabs API to initiate outbound call
    response = requests.post(
        f"https://api.elevenlabs.io/v1/convai/twilio/outbound-call",
        headers={
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        },
        json={
            "agent_id": ELEVENLABS_AGENT_ID,
            "agent_phone_number_id": ELEVENLABS_PHONE_ID,
            "to_number": to_number,
            "conversation_config_override": {
                "agent": {
                    "prompt": {
                        "prompt": f"You are calling about: {purpose} for service: {service_name}"
                    }
                }
            }
        }
    )
    
    return {"status": "calling", "details": response.json()}
```

**Alternative (simpler for demo)**: Use Twilio Voice API to play a pre-generated ElevenLabs TTS audio message — less interactive but more reliable for a 36-hour hackathon:

```python
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse
import os

client = Client(os.environ["TWILIO_ACCOUNT_SID"], os.environ["TWILIO_AUTH_TOKEN"])

@router.post("/api/call/simple")
async def place_simple_call(to_number: str, message_text: str):
    """Simpler approach: Twilio call that plays pre-generated TTS audio."""
    
    # Generate audio with ElevenLabs TTS, host the MP3 on your server
    audio_url = await generate_elevenlabs_audio(message_text)
    
    call = client.calls.create(
        to=to_number,
        from_=os.environ["TWILIO_PHONE_NUMBER"],
        twiml=f'<Response><Play>{audio_url}</Play></Response>'
    )
    
    return {"status": "calling", "call_sid": call.sid}
```

**Demo moment**: Teammate's phone rings on the demo table → they answer → warm AI voice speaks the inquiry → judges are stunned.

## 5.3 Action 2: 📧 Sends the Email For Real

**What happens**: Agent drafts an email to the service office, shows a preview with To/Subject/Body, user confirms with one tap, email actually sends and arrives in the recipient's inbox within seconds.

**Why this wins for the demo**: Ask a judge for their email address, send a live email, their phone buzzes within 5 seconds. **"Check your inbox."**

### Implementation: Twilio SendGrid

```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

@router.post("/api/email")
async def send_email(to_email: str, subject: str, body_html: str, 
                     from_name: str = "GoldenGuide Kingston"):
    """Send an email via Twilio SendGrid."""
    
    message = Mail(
        from_email=("goldenguide.kingston@gmail.com", from_name),
        to_emails=to_email,
        subject=subject,
        html_content=body_html
    )
    
    try:
        sg = SendGridAPIClient(os.environ["SENDGRID_API_KEY"])
        response = sg.send(message)
        return {
            "status": "sent",
            "status_code": response.status_code,
            "to": to_email
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
```

**SendGrid Setup (before hackathon)**:
1. Sign up at sendgrid.com — free trial: 100 emails/day for 60 days
2. Enable Two-Factor Authentication (required by SendGrid)
3. Create API Key: Settings → API Keys → Create API Key → Full Access
4. Complete Single Sender Verification (sufficient for hackathon — skip Domain Authentication):
   - Settings → Sender Authentication → Single Sender Verification
   - Add your from address, verify via confirmation email
5. Store the API key as `SENDGRID_API_KEY`

**Email template for demo** (generated by `draft_communication` tool):
```html
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; 
            padding: 20px; background: #FFFAF0;">
  <h2 style="color: #B8860B;">Inquiry from GoldenGuide — Kingston Senior Services</h2>
  <p>Hello,</p>
  <p>I am writing on behalf of a 73-year-old Kingston resident who lives alone 
     and is interested in learning more about the Municipal Fee Assistance Program.</p>
  <p>Could you please provide information about:</p>
  <ul>
    <li>Current eligibility requirements</li>
    <li>Required documentation for the application</li>
    <li>Expected processing time</li>
  </ul>
  <p>Thank you for your time and assistance.</p>
  <p style="color: #8B4513;"><em>— Sent by GoldenGuide, an AI assistant helping 
     Kingston seniors access municipal services</em></p>
</div>
```

## 5.4 Action 3: 📱 Texts the Action Plan to Your Phone

**What happens**: Agent compiles the full action plan into a clean, readable SMS and texts it to the senior's phone (and optionally to a caregiver or family member).

**Why this wins for the demo**: After the whole demo, pull out your phone and show the text that just arrived with the complete action plan. Tangible proof that the agent took real action.

### Implementation: Twilio Programmable Messaging

```python
from twilio.rest import Client
import os

client = Client(os.environ["TWILIO_ACCOUNT_SID"], os.environ["TWILIO_AUTH_TOKEN"])

@router.post("/api/sms")
async def send_sms(to_number: str, action_plan_text: str, 
                   caregiver_number: str = None):
    """Send action plan via Twilio SMS."""
    
    # Format the action plan for SMS (max 1600 chars for multi-segment)
    sms_body = f"📋 GoldenGuide Action Plan\n\n{action_plan_text}\n\n" \
               f"Questions? Visit goldenguide.ca or call 613-546-0000"
    
    # Send to the senior
    message = client.messages.create(
        to=to_number,
        from_=os.environ["TWILIO_PHONE_NUMBER"],
        body=sms_body
    )
    
    results = [{"to": to_number, "sid": message.sid, "status": message.status}]
    
    # Optionally send to caregiver/family member
    if caregiver_number:
        caregiver_msg = client.messages.create(
            to=caregiver_number,
            from_=os.environ["TWILIO_PHONE_NUMBER"],
            body=f"📋 GoldenGuide: Your family member's action plan:\n\n{action_plan_text}"
        )
        results.append({"to": caregiver_number, "sid": caregiver_msg.sid})
    
    return {"status": "sent", "messages": results}
```

**SMS formatting for the demo**:
```
📋 GoldenGuide Action Plan

1. 🦷 Canadian Dental Care Program
   Call: 1-833-537-4342
   → You likely qualify for FREE dental

2. 💰 Municipal Fee Assistance Program  
   Call: 613-546-2695 ext 4906
   → Reduced fees for city services

3. 🏠 Homemaking Services
   Call: 613-634-2273
   → Subsidized home cleaning help

Questions? Visit goldenguide.ca
```

---

# PART 6: UI/UX DESIGN (ELDERLY-FOCUSED)

## 6.1 Design Philosophy

Every design decision reflects a 70–80-year-old user. This isn't a tech product that happens to be for seniors — it's a senior product that happens to use tech.

## 6.2 Color Palette (Ties to "Golden Age" Theme)

| Role | Color | Hex | Notes |
|------|-------|-----|-------|
| Primary | Dark Goldenrod | `#B8860B` | Warm, regal, readable |
| Primary Light | Wheat | `#F5DEB3` | Gentle highlights, hover states |
| Accent | Saddle Brown | `#8B4513` | Buttons, icons |
| Background | Floral White | `#FFFAF0` | Warm white, easy on the eyes |
| Text | Dark Brown-Black | `#2C1810` | High contrast for readability |
| Success | Forest Green | `#228B22` | Confirmations, eligibility ✅ |
| Card Background | Cornsilk | `#FFF8DC` | Service cards, action plans |
| Danger/Warning | Soft Red | `#C0392B` | Errors, cancel buttons |

## 6.3 Typography

| Element | Font | Size | Notes |
|---------|------|------|-------|
| Headings | Georgia or Merriweather | 24px+ | Warm serif, familiar |
| Body text | Verdana or Atkinson Hyperlegible | 18px+ | Atkinson was designed specifically for low-vision readers |
| Buttons | Same as body | 18px+ | Bold weight |
| Line height | — | 1.6+ | Generous spacing for readability |

## 6.4 Layout Principles

- **Single column layout** — no multi-panel confusion, no sidebars
- **Big touch targets** — minimum 48×48px buttons (WCAG recommendation), ideally larger
- **Minimal navigation** — the chat IS the navigation, no menus to learn
- **No hamburger menus** — seniors don't know what ☰ means
- **Prominent microphone button** — large, center-bottom, always visible, labeled "Speak"
- **Auto-scroll to newest message** — user never has to scroll to find the latest response
- **Clear loading states** — "GoldenGuide is thinking..." with animated gold dots
- **Quick topic buttons** on first load: "🦷 Dental Help", "🚌 Bus Times", "💰 Fee Assistance", "🏠 Homemaking", "❓ What Can You Help With?"

## 6.5 Full App Wireframe

```
┌────────────────────────────────────────┐
│  🌟 GoldenGuide                        │
│  Your Kingston Services Assistant      │
│  [A+]  [A-] font controls             │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  👋 Hello! I'm GoldenGuide.     │  │
│  │  I can help you find Kingston    │  │
│  │  city services. Ask me anything, │  │
│  │  or tap a topic below:           │  │
│  └──────────────────────────────────┘  │
│                                        │
│  [🚌 Transit]  [🏠 Housing]           │
│  [🏥 Health]   [🎭 Activities]        │
│  [💰 Financial Help] [♿ Accessibility]│
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  User: "I need help cleaning    │  │
│  │  my house, I'm 74 and it's      │  │
│  │  getting hard"                   │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  🌟 GoldenGuide:                │  │
│  │  The City of Kingston offers     │  │
│  │  subsidized homemaking services  │  │
│  │  through Comfort Keepers for     │  │
│  │  older residents...              │  │
│  │                                  │  │
│  │  ┌────────────────────────────┐  │  │
│  │  │  📋 HOMEMAKING SERVICES   │  │  │
│  │  │  Comfort Keepers Kingston  │  │  │
│  │  │  📞 613-634-2273           │  │  │
│  │  │  📍 12-1786 Bath Rd.      │  │  │
│  │  │  [📞 Call for Me]         │  │  │
│  │  │  [📧 Email for Me]        │  │  │
│  │  └────────────────────────────┘  │  │
│  │  🔊                              │  │
│  └──────────────────────────────────┘  │
│                                        │
├────────────────────────────────────────┤
│  ┌──────────────────────────────┐     │
│  │  Ask me anything...          │ 🎤  │
│  └──────────────────────────────┘     │
└────────────────────────────────────────┘
```

## 6.6 Rich UI Components (What Separates This From a Chatbot)

GoldenGuide renders structured data as beautiful, actionable cards — not just text bubbles.

**Action Plan Card**: Multi-step plan with priority numbering, icons, and action buttons
```
┌──────────────────────────────────────────────────────┐
│ 📋 YOUR ACTION PLAN                                  │
│                                                      │
│  Step 1  🦷 Canadian Dental Care Program             │
│  ─────────────────────────────────────               │
│  FREE dental care for seniors 65+ with low income    │
│  Phone: 1-833-537-4342                               │
│                                                      │
│  [📞 Call for Me]  [📧 Email for Me]                  │
│                                                      │
│  Step 2  💰 Municipal Fee Assistance Program         │
│  ─────────────────────────────────────               │
│  Discounted city services (transit, recreation)      │
│  Phone: 613-546-2695 ext 4906                        │
│                                                      │
│  [📞 Call for Me]  [📧 Email for Me]                  │
│                                                      │
│  ─────────────────────────────────────               │
│  [📱 Text This Plan to My Phone]                      │
│  [🖨️ Print This Plan]                                │
└──────────────────────────────────────────────────────┘
```

**Email Draft Preview**: Shows full email with edit/send buttons
```
┌──────────────────────────────────────────────────────┐
│ 📧 EMAIL DRAFT READY                                  │
│                                                      │
│ To: mfap@cityofkingston.ca                           │
│ Subject: MFAP Inquiry — Kingston Senior Resident     │
│                                                      │
│ Hello, I am writing on behalf of a 73-year-old       │
│ Kingston resident who lives alone and is interested   │
│ in the Municipal Fee Assistance Program...           │
│                                                      │
│     [✏️ Edit]    [📋 Copy]    [📧 Send Now]           │
└──────────────────────────────────────────────────────┘
```

**Call Preview + Live Status Card**: Full confirm-before-acting flow
```
┌──────────────────────────────────────────────────────────────┐
│ GoldenGuide: I've prepared a call to the MFAP office.        │
│ Here's what I'll say on your behalf:                          │
│                                                               │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ 📞 CALL PREVIEW                                           │ │
│ │                                                           │ │
│ │ Calling: Municipal Fee Assistance Program                  │ │
│ │ Number: 613-546-2695 ext 4906                             │ │
│ │                                                           │ │
│ │ "Hello, my name is GoldenGuide and I'm an AI assistant    │ │
│ │ calling on behalf of a 73-year-old Kingston resident..."   │ │
│ │                                                           │ │
│ │     [✅ Place Call]         [✏️ Edit First]                │ │
│ └───────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

        User taps [✅ Place Call] ↓

┌──────────────────────────────────────────────────────────────┐
│ 📞 CALLING... Municipal Fee Assistance Program                │
│                                                               │
│  🔴 Live Call in Progress                                     │
│  ● Connected · Duration: 0:23                                │
│  ● GoldenGuide is speaking on your behalf...                 │
│                                                               │
│  Live transcript:                                             │
│  🤖 "Hello, my name is GoldenGuide and I'm calling          │
│     on behalf of a Kingston resident..."                     │
│  👤 "Hi there, I can help with that..."                      │
│                                                               │
│     [🔇 Mute]  [🤚 Take Over Call]  [📴 End Call]            │
└──────────────────────────────────────────────────────────────┘
```

**Email Preview Card**: Full email with confirm/cancel flow
```
┌──────────────────────────────────────────────────────────────┐
│ 📧 EMAIL READY TO SEND                                        │
│                                                               │
│ To: housing@cityofkingston.ca                                 │
│ From: GoldenGuide (on your behalf)                            │
│ Subject: Homemaking Services Inquiry — Senior Resident        │
│                                                               │
│ Dear Housing and Social Services,                             │
│                                                               │
│ I am writing on behalf of a 73-year-old Kingston resident     │
│ who lives alone and would like to learn more about the        │
│ subsidized homemaking services program...                     │
│                                                               │
│    [✅ Send Now]    [✏️ Edit]    [❌ Cancel]                   │
└──────────────────────────────────────────────────────────────┘

        User taps [✅ Send Now] ↓

┌──────────────────────────────────────────────────────────────┐
│ ✅ Email sent successfully!                                    │
│                                                               │
│ Sent to housing@cityofkingston.ca.                            │
│ Expect a reply in 2-3 business days.                          │
│                                                               │
│ [🗓 Remind me to follow up in 5 days]    [No thanks]          │
└──────────────────────────────────────────────────────────────┘
```

**SMS Card**: With caregiver option
```
┌──────────────────────────────────────────────────────────────┐
│ 📱 TEXT YOUR ACTION PLAN                                      │
│                                                               │
│ Your number: [_______________] (e.g. 613-555-0123)           │
│                                                               │
│ ☐ Also send to a family member / caregiver:                   │
│   Their number: [_______________]                             │
│                                                               │
│ [📱 Send Text]                                                │
└──────────────────────────────────────────────────────────────┘
```

**Document Explainer Card**: Multimodal understanding
```
┌──────────────────────────────────────────────────────────────┐
│ 📄 DOCUMENT EXPLAINED                                         │
│                                                               │
│ [thumbnail of uploaded image]                                 │
│                                                               │
│ This is a: Property Tax Assessment                            │
│                                                               │
│ In plain English:                                             │
│ "Your home's assessed value went up to $285,000. This         │
│ might increase your property taxes slightly next year."       │
│                                                               │
│ ⚠️ Action needed:                                             │
│ File a Request for Reconsideration by March 31, 2026          │
│ if you disagree.                                              │
│                                                               │
│ 📞 Contact: MPAC 1-866-296-6722                              │
│ [🗓 Add March 31 deadline to calendar]                        │
└──────────────────────────────────────────────────────────────┘
```

**Service Info Card**: Clean display of a single service
```
┌──────────────────────────────────────────────────────┐
│ 🦷 Canadian Dental Care Program                       │
│                                                      │
│ Free routine dental services for seniors 65+         │
│ with adjusted family net income under $70,000.       │
│                                                      │
│ Covers: cleanings, fillings, dentures,               │
│ emergency dental work                                │
│                                                      │
│ 📞 1-833-537-4342 (tap to call)                      │
│ 🌐 canada.ca/dental                                  │
│                                                      │
│ [📧 Email for Me] [📋 Save to Plan]                   │
└──────────────────────────────────────────────────────┘
```

---

# PART 7: DATA SOURCES & KNOWLEDGE BASE

## 7.1 Sources to Scrape (All Publicly Available)

| Source | URL | What We Get |
|--------|-----|-------------|
| Kingston Older Adult Services | cityofkingston.ca/residents/community-services/older-adults | Service listings, phone numbers |
| Municipal Fee Assistance Program | cityofkingston.ca (search MFAP) | Eligibility criteria, application process |
| Homemaking Services | cityofkingston.ca | Provider info, eligibility, waitlist status |
| Community Centres | cityofkingston.ca/residents/recreation/facilities | Locations, programs, schedules |
| Housing Programs | cityofkingston.ca/residents/community-services/housing | Affordable housing, social housing info |
| Kingston Transit GTFS | api.cityofkingston.ca/gtfs/gtfs.zip | Routes, stops, schedules (real-time data) |
| Kingston Open Data | opendatakingston.cityofkingston.ca | Supplementary datasets |
| Accessibility Plan | cityofkingston.ca | Multi-year plan (shows city priorities) |
| CDCP (Federal) | canada.ca/dental | National dental program details |

## 7.2 Knowledge Base Strategy

**Pre-hackathon**: Scrape all pages to markdown/text files using a simple Python script with `requests` + `BeautifulSoup`. Store as structured JSON records:

```json
{
    "name": "Municipal Fee Assistance Program (MFAP)",
    "category": "financial",
    "description": "Provides discounted access to City recreation, transit, and childcare...",
    "eligibility": "Kingston residents with household income below LIM+15% threshold",
    "phone": "613-546-2695 ext 4906",
    "address": "362 Montreal Street, Kingston",
    "how_to_apply": "Visit Housing & Social Services office with proof of income...",
    "website": "https://www.cityofkingston.ca/...",
    "keywords": ["fee assistance", "low income", "discount", "recreation", "transit pass"]
}
```

**At hackathon**: Concatenate all records into the Gemini system prompt (~50K tokens). No vector database needed — Gemini 1.5 Pro's 1M token context window handles it easily.

## 7.3 GTFS Transit Data

Download and parse `gtfs.zip` which contains:
- `routes.txt` — All 45 Kingston Transit routes
- `stops.txt` — All 891 stops with lat/lng
- `stop_times.txt` — Arrival/departure times for every stop
- `calendar.txt` — Service schedules (weekday/weekend)
- `trips.txt` — Trip definitions

Parse with Python `csv` module into queryable data structures.

---

# PART 8: DEMO SCRIPT (3 MINUTES)

## 8.1 The Pitch (Timed to the Second)

### Hook — 15 seconds
> "What if your grandmother had a personal assistant who knew every Kingston city service, could check what she qualifies for, draft her emails, make phone calls on her behalf, and text her the plan — all from a single conversation?"

### Problem — 20 seconds
> "Kingston has dozens of programs for seniors — subsidized homemaking, fee assistance, dental care, transit discounts. But the information is scattered across the city website, buried in PDFs, and written in bureaucratic language. The real problem isn't awareness alone. It's that knowing about a service and actually *getting it* are two very different things."

### Solution — 20 seconds
> "GoldenGuide is a personal municipal agent for Kingston seniors. It doesn't just tell you about services — it takes action. It checks your eligibility across all programs simultaneously, generates a personalized step-by-step plan, drafts your emails, makes phone calls on your behalf, and texts the plan to your phone. It turns a maze of bureaucracy into a single conversation."

### Live Demo — 105 seconds

**Minute 1: Search + Plan (0:55–1:55)**
1. Open the app in browser — show the warm, accessible UI
2. Tap the big microphone button and speak: *"I'm 73, I live alone, and I can't afford the dentist"*
3. Show the agent thinking → calling tools → checking eligibility
4. Beautiful 3-step action plan appears with service cards

**Minute 2: Live Email (1:55–2:35)**
5. Tap "📧 Email for Me" on the MFAP step
6. Agent shows pre-written email draft with preview
7. "For this demo, let me send this to a real inbox..." → enter a judge's email (or your own)
8. Tap **Send** → pause 3 seconds → **"Check your inbox."**
9. Judge's phone buzzes. 🎤 **Drop moment #1.**

**Minute 3: Live Call + Text (2:35–3:25)**
10. Tap "📞 Call for Me" on the dental step
11. Agent shows call script preview → Tap **"Place Call"**
12. Teammate's phone rings on the demo table → They answer → Warm AI voice speaks the inquiry
13. **Drop moment #2.** While the call plays out...
14. Tap "📱 Text Plan to My Phone"
15. Your pocket buzzes. Pull out phone, show the SMS with the full action plan.
16. **Drop moment #3.**

### Close — 15 seconds
> "Margaret asked one question. GoldenGuide found 5 services she didn't know about, checked her eligibility, built a step-by-step plan, sent an email to the housing office, called the dental program on her behalf, and texted the plan to her daughter. That's not a chatbot. That's an AI agent that takes real action for Kingston's most vulnerable residents."

## 8.2 Demo Tips

- **Pre-load a scripted conversation** as a fallback — have the Gemini response cached in case of API latency
- **Test all 3 real actions** multiple times before presenting — verify phone numbers, email delivery, SMS
- **Teammate's phone should be visible** on the table — when it rings, the visual is powerful
- **Have the email pre-typed** in the send field so you don't fumble during the demo
- **Practice the timing** — 3 minutes goes fast, practice at least 5 times with a timer

---

# PART 9: ANTICIPATED JUDGE Q&A

| Question | Answer |
|----------|--------|
| **How do you ensure accuracy?** | All responses are grounded in real data scraped from cityofkingston.ca. The AI is instructed to only answer from its context and say "I'm not sure, let me help you contact the right department" rather than hallucinate. In production, we'd add citation links back to source pages. |
| **How is this different from ChatGPT?** | Three ways: (1) ChatGPT doesn't know Kingston-specific services — GoldenGuide does via curated knowledge base, (2) GoldenGuide takes real autonomous actions (calls, emails, texts) that ChatGPT cannot, (3) The UI is purpose-built for elderly users with large text, voice-first interaction, and one-tap actions. |
| **What about privacy?** | No conversation storage, no personal data collection, no login required. Sessions are ephemeral. In production, we'd add a privacy notice and MFIPPA compliance. The agent identifies itself as AI on every phone call — full transparency. |
| **How does it scale / stay updated?** | Knowledge base auto-updates by re-scraping the city website. GTFS is a live API. The city could host this as a digital service — it's built entirely on their own open data. Adding new services is just adding records to the knowledge base. |
| **Why voice?** | Our target users are 70–80 year old seniors with varying digital literacy and potentially declining vision. Voice is the most natural, accessible interface. Kingston's own accessibility plan identifies the need for better information access for seniors. |
| **Why autonomous actions instead of just providing info?** | Reduces friction to near-zero. Many seniors are intimidated by bureaucracy — knowing about a service and actually completing the phone call or email are two different things. The agent closes that gap. The confirm-before-acting pattern ensures the user stays in control. |
| **Is the AI making decisions for vulnerable people?** | No — it's reducing friction, not making decisions. Every action requires explicit user confirmation. It's the same as a helpful family member saying "Want me to call them for you?" |
| **How could Kingston actually deploy this?** | Embed on cityofkingston.ca, accessible from any browser. Could also be set up as a phone hotline (call a number → talk to GoldenGuide via Twilio). Maintenance is minimal — re-scrape city data periodically. Could reduce call centre load significantly. |

---

# PART 9.5: FEATURE PRIORITY LIST

## Must-Have (Core Demo Features) — Build These First
1. **Chat interface** — text input with message bubbles, large accessible font
2. **AI responses grounded in Kingston data** — Gemini + context injection (all data in system prompt)
3. **Voice output** — ElevenLabs reads every response aloud
4. **Service result cards** — visual cards with name, phone, address, "how to apply"
5. **Voice input** — microphone button using Web Speech API
6. **Agentic tool use** — Gemini function calling with at least search_services + check_eligibility + generate_action_plan
7. **At least ONE real action** — send_email via SendGrid is the most reliable

## Nice-to-Have (Polish Features) — Build If Time Permits
8. **All 3 real actions** — phone call + email + SMS (huge demo impact if all work)
9. **Quick-topic buttons** — pre-set categories (Transit, Health, Housing, Recreation, Financial Help)
10. **Transit feature** — "When is my next bus?" with real GTFS data
11. **Document upload + explain** — multimodal understanding of city letters
12. **Font size / contrast toggle** — let users increase text size
13. **Action plan "Text to Phone" and "Share with Caregiver"** buttons

## Stretch Goals (Only If Ahead of Schedule)
14. **Multilingual support** — French (Kingston has francophone seniors), using Gemini's multilingual ability + ElevenLabs multilingual voices
15. **Map integration** — show community centre or bus stop on an embedded map
16. **Conversation memory** — remember what user asked earlier in session
17. **Print action plan** — browser print-friendly CSS for action plan cards

---

# PART 9.6: ALTERNATE PITCH HOOK (STORY VERSION)

If you prefer a narrative opening instead of a question, use this:

> "Margaret is 78, lives alone in Kingston, and just got a letter about a property tax change she doesn't understand. She goes to cityofkingston.ca and is met with dozens of menus, tiny text, and PDF forms. She gives up and calls City Hall — 20 minutes on hold. This is the reality for thousands of Kingston seniors."

This version works better if you're presenting to the City of Kingston judges specifically, because it grounds the problem in a relatable Kingston scenario.

---

# PART 9.7: EMAIL FALLBACK — GMAIL SMTP

If Twilio SendGrid setup fails or takes too long during the hackathon, you can fall back to Gmail SMTP in 5 minutes:

**Setup**:
1. Create `goldenguide.kingston@gmail.com`
2. Enable 2FA on the account
3. Generate an App Password (Google Account → Security → App Passwords)

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

async def send_email_gmail_fallback(to_email: str, subject: str, body_html: str):
    """Fallback: Send email via Gmail SMTP if SendGrid is down."""
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"GoldenGuide Kingston <{os.environ['GMAIL_ADDRESS']}>"
    msg["To"] = to_email
    msg.attach(MIMEText(body_html, "html"))
    
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(
            os.environ["GMAIL_ADDRESS"],
            os.environ["GMAIL_APP_PASSWORD"]
        )
        server.send_message(msg)
    
    return {"status": "sent", "to": to_email, "method": "gmail_smtp"}
```

**Extra env vars for fallback**:
```
GMAIL_ADDRESS=goldenguide.kingston@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

---

# PART 10: PRIZE TRACK ALIGNMENT (DETAILED)

## Main Track — "The Golden Age"

**Alignment: A+**
- "Golden Age" → golden years → empowering seniors (the wordplay is intentional and powerful)
- Directly "improves future quality of life" for vulnerable communities
- Revitalizes how municipal services are delivered to aging populations
- Focus on long-term sustainability — built on open data, minimal maintenance
- Goes FAR beyond basic LLM implementation: function calling with 10 tools, agentic loops, multimodal input, autonomous real-world actions, structured output, voice synthesis

## City of Kingston — $10,000

**Alignment: A+**
- Directly enhances municipal service delivery for Kingston residents
- Uses Kingston open data (GTFS, service listings)
- Aligned with the city's Multi-Year Accessibility Plan
- Reduces call centre load (every GoldenGuide interaction is one fewer phone call to 613-546-0000)
- Improves equity — helps low-income seniors access programs they're eligible for but don't know about
- **This is the prize we're building for.** The entire project is Kingston-specific by design.

## Best Use of Gemini API — Google Swag

**Alignment: A**
- Gemini 1.5 Pro is the core LLM powering all conversations
- Uses Gemini function calling with 10 registered tool declarations
- Agentic multi-step tool use (Gemini decides when to call tools and chains calls together)
- Multimodal understanding (document photo → explanation via Gemini vision)
- Structured output generation (JSON for service cards, action plans)
- 1M token context window used for knowledge base injection

## Best Use of ElevenLabs — Wireless Earbuds

**Alignment: A**
- Voice output is a CORE feature, not a bolt-on — essential for elderly accessibility
- ElevenLabs TTS reads every response aloud with a warm, natural voice
- ElevenLabs Conversational AI powers the real phone call feature (the most impressive demo moment)
- Native Twilio integration — ElevenLabs manages the voice agent on phone calls

## Best Use of Vultr — Portable Screens

**Alignment: B+**
- Backend deployed on Vultr cloud compute instance
- Can discuss scalability, server specs, deployment architecture

## National Bank — $500/hacker

**Alignment: A-**
- Social impact for vulnerable population
- Financial inclusion — MFAP helps low-income seniors access fee reductions
- Reduces barriers to economic participation (transit passes, recreation, dental)

## Gradium — $300 + 1M Credits

**Alignment: B+**
- AI-powered application with sophisticated agentic architecture

---

# PART 11: 36-HOUR BUILD TIMELINE

## Team Split

- **Person A**: Backend / AI (FastAPI, Gemini integration, tool implementations, Twilio APIs)
- **Person B**: Frontend / Design (React, Tailwind, UI components, voice input/output, accessibility)

## Friday Evening — Hours 0–4: Foundation

### Person A (Backend)
- [ ] Set up FastAPI project structure with CORS middleware
- [ ] Configure all API keys as environment variables (Gemini, Twilio, SendGrid, ElevenLabs)
- [ ] Download and parse Kingston Transit GTFS data (`gtfs.zip` → Python dicts)
- [ ] Run web scraping script on Kingston city pages → store as JSON knowledge base
- [ ] Set up basic `/chat` endpoint that accepts message → returns response

### Person B (Frontend)
- [ ] Set up React + Next.js project with Tailwind CSS
- [ ] Define color palette variables and typography (Atkinson Hyperlegible font)
- [ ] Build the main chat layout: header, message area, input bar, mic button
- [ ] Style the basic message bubbles (user = right/brown, agent = left/gold)
- [ ] Create the landing screen with quick-topic buttons

## Friday Night / Saturday Morning — Hours 4–12: Core Features

### Person A (Backend)
- [ ] Build the full `/chat` endpoint: system prompt injection → Gemini API call → response
- [ ] Implement 7 information tools as Python functions:
  - `search_services` (keyword search over knowledge base)
  - `check_eligibility` (rule-based logic per program)
  - `get_transit_info` (GTFS query)
  - `generate_action_plan` (structured plan from service list)
  - `draft_communication` (email/call script generation)
  - `create_reminder` (.ics file generation)
  - `explain_document` (forward image to Gemini vision)
- [ ] Register all 7 as Gemini function declarations
- [ ] Implement the agentic loop (tool call → execute → feed results back → repeat or finalize)
- [ ] Add ElevenLabs TTS endpoint: `/api/tts` → accepts text, returns audio URL

### Person B (Frontend)
- [ ] Wire chat interface to backend `/chat` endpoint
- [ ] Build Service Card component (name, description, phone, action buttons)
- [ ] Build Action Plan Card component (numbered steps, icons, buttons)
- [ ] Integrate ElevenLabs voice playback (audio player on each agent message)
- [ ] Add quick-topic buttons on landing screen
- [ ] Add loading states ("GoldenGuide is thinking...")

### Both — Hours 10–12: SLEEP (2 hours minimum)

## Saturday — Hours 12–24: Agentic Features + Real Actions

### Person A (Backend)
- [ ] Implement `send_email` tool (Twilio SendGrid API)
- [ ] Implement `send_sms` tool (Twilio Programmable Messaging API)
- [ ] Implement `place_call` tool (Twilio Voice + ElevenLabs native integration)
- [ ] Register all 3 action tools as additional Gemini function declarations (now 10 total)
- [ ] Add confirm-before-acting pattern: action tools return previews, separate `/api/confirm` endpoints execute
- [ ] Test all 3 real actions end-to-end with verified phone numbers
- [ ] Set up Vultr deployment (Docker or direct deploy)
- [ ] Harden the agentic loop (error handling, timeout management, fallback responses)

### Person B (Frontend)
- [ ] Implement Web Speech API voice input (mic button → speech-to-text → send to chat)
- [ ] Build Email Preview component with Edit/Copy/Send buttons
- [ ] Build Call Preview component with call script and Place Call button
- [ ] Build Call Status component (ringing → connected → done)
- [ ] Build SMS confirmation component
- [ ] Add document upload UI (camera icon + file picker)
- [ ] Add accessibility toggle (even larger text option)
- [ ] Polish all cards, buttons, spacing — make everything feel warm and professional

## Sunday — Hours 24–36: Polish + Demo Prep

### Hours 24–28: Final Bug Fixes
- [ ] Fix any broken tool chains or UI rendering issues
- [ ] Ensure all 3 real actions work reliably
- [ ] Add graceful error handling for API failures
- [ ] Test the full demo flow end-to-end 3+ times

### Hours 28–30: Devpost Submission
- [ ] Write Devpost project description
- [ ] List all technologies used
- [ ] Take screenshots / screen recordings of key flows
- [ ] Record a 2-minute demo video (backup in case live demo fails)

### Hours 30–32: Pitch Preparation
- [ ] Write final pitch script (see Part 8)
- [ ] Practice pitch 5+ times with timer
- [ ] Prepare for Q&A (see Part 9)
- [ ] Set up the demo environment (browser open, phone numbers verified, email ready)

### Hours 32–34: Final Polish
- [ ] One more end-to-end test of all 3 real actions
- [ ] Verify deployment on Vultr is working
- [ ] Clean up any console errors, loading issues
- [ ] Prepare backup plans (cached responses, pre-recorded demo video)

### Hours 34–36: Submit + Relax
- [ ] Submit on Devpost
- [ ] Final pitch rehearsal
- [ ] Deep breath

---

# PART 12: PRE-HACKATHON SETUP CHECKLIST

**Do ALL of this before the hackathon starts. None of this is building the project — it's just account setup and API key generation.**

## Accounts to Create

- [ ] **Twilio**: Sign up at twilio.com → get phone number (Canadian +1 613 if available) → copy Account SID + Auth Token
- [ ] **Twilio SendGrid**: Sign up at sendgrid.com → enable 2FA → create API Key (Full Access) → complete Single Sender Verification
- [ ] **ElevenLabs**: Sign up → create Conversational AI agent with warm voice → import Twilio number → assign agent → test outbound call
- [ ] **Google AI Studio**: Get Gemini API key
- [ ] **Vultr**: Set up account (use hackathon credits if available)

## Phone Numbers to Verify in Twilio

- [ ] Your personal phone number (for SMS demo)
- [ ] Your teammate's phone number (for call demo — their phone rings on stage)
- [ ] One backup number (friend, family, second device)

## ElevenLabs Agent to Configure

- [ ] Create agent named "GoldenGuide Caller"
- [ ] Select warm, mature voice (not peppy — think reassuring grandparent's helper)
- [ ] Set system prompt (see Part 5.2)
- [ ] Import Twilio number → assign agent
- [ ] Test outbound call to your verified number

## Data to Pre-Scrape

- [ ] Scrape Kingston city service pages to markdown/JSON
- [ ] Download GTFS transit data from `api.cityofkingston.ca/gtfs/gtfs.zip`
- [ ] Compile all scraped data into a single knowledge base file
- [ ] Prepare the Gemini system prompt with Kingston context

## Code Templates to Prepare

- [ ] FastAPI project boilerplate with CORS, environment variables
- [ ] React + Next.js + Tailwind project boilerplate
- [ ] Basic `/chat` endpoint structure (ready to plug in Gemini)
- [ ] Twilio client initialization code
- [ ] SendGrid client initialization code

## Environment Variables File (.env)

```
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+16131234567
SENDGRID_API_KEY=SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_agent_id
ELEVENLABS_PHONE_ID=your_phone_number_id
GEMINI_API_KEY=your_gemini_api_key
SERVER_URL=https://your-server.com
```

---

# PART 13: WHY WE WIN

1. **Theme alignment is A+**: "Golden Age" → golden years → empowering Kingston's seniors
2. **City of Kingston prize is purpose-built for us**: $10K for improving municipal service delivery — that's literally what GoldenGuide does
3. **Goes far beyond basic LLM**: Gemini function calling with 10 tools, agentic multi-step reasoning, multimodal input, voice I/O, and three real-world autonomous actions
4. **Demo is emotional AND technical**: A 73-year-old getting instant help is emotionally powerful. A judge's phone actually ringing is technically impressive. Both at once is unforgettable.
5. **All real actions are unified on Twilio**: One platform for calls, email, and SMS — clean architecture, reliable execution, impressive to judges
6. **Polished, accessible UI**: Warm golden colors, large fonts, voice-first design — will visually stand out from the typical hackathon terminal-aesthetic project
7. **Real data, real impact**: Built on actual Kingston municipal data, actual GTFS transit feeds, actual service eligibility criteria
8. **Scoped for 2 people in 36 hours**: 10 tools sounds ambitious but each one is 20–50 lines of Python. The real complexity is the Gemini orchestration, and that's just one well-structured endpoint.
9. **Stacks 4+ prize tracks simultaneously**: Main, City of Kingston, Gemini, ElevenLabs, Vultr, National Bank — all with genuine alignment
10. **The "done" moment**: Other teams will demo chatbots that *tell* you things. We demo an agent that *does* things. The phone call is the moment judges remember.

---

*Built with: Google Gemini 1.5 Pro • Twilio Voice + SendGrid + Programmable Messaging • ElevenLabs Conversational AI • React + Next.js + Tailwind CSS • FastAPI • Kingston Open Data • Vultr Cloud • And a lot of ❤️ for Kingston's seniors*
