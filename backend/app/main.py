"""
GoldenGuide Backend — FastAPI application.
Serves the chat API endpoint and action execution endpoints.
"""

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
import os
import json

load_dotenv()

app = FastAPI(title="GoldenGuide API")

_frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
_allowed_origins = ["*"] if "localhost" in _frontend_url else [_frontend_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import after env is loaded
from app.agent import agent_chat
from tools.send_email import execute_send_email
from tools.send_sms import execute_send_sms
from tools.place_call import execute_place_call
from tools.create_reminder import generate_ics_file


# === Request/Response Models ===


class ChatRequest(BaseModel):
    message: str
    history: list = []


class ChatResponse(BaseModel):
    text: str
    history: list
    structured_data: dict = {}
    tool_calls_made: list = []


class EmailRequest(BaseModel):
    to_email: str
    subject: str
    body_html: str


class SmsRequest(BaseModel):
    to_number: str
    message: str
    caregiver_number: Optional[str] = None


class CallRequest(BaseModel):
    to_number: str
    purpose: str
    service_name: str
    message_script: str


class ReminderRequest(BaseModel):
    title: str
    date: str
    time: str = "10:00"
    description: str


# === Endpoints ===


@app.get("/health")
async def health():
    return {"status": "ok", "service": "goldenguide"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint. Sends user message through the Gemini agentic loop.
    """
    result = await agent_chat(request.message, request.history)
    return ChatResponse(
        text=result["text"],
        history=result["history"],
        structured_data=result.get("structured_data", {}),
        tool_calls_made=result.get("tool_calls_made", []),
    )


@app.post("/api/chat/image")
async def chat_with_image(
    message: str = Form(...),
    history: str = Form(default="[]"),
    image: UploadFile = File(...),
):
    """Chat endpoint that accepts an uploaded document image for explanation."""
    import base64

    image_bytes = await image.read()
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    history_parsed = json.loads(history)

    result = await agent_chat(
        message, history_parsed, image_data=image_b64, image_mime=image.content_type
    )
    return {
        "text": result["text"],
        "history": result["history"],
        "structured_data": result.get("structured_data", {}),
        "tool_calls_made": result.get("tool_calls_made", []),
    }


@app.post("/api/email")
async def send_email(request: EmailRequest):
    """Execute a confirmed email send via SendGrid."""
    return execute_send_email(request.to_email, request.subject, request.body_html)


@app.post("/api/sms")
async def send_sms(request: SmsRequest):
    """Execute a confirmed SMS send via Twilio."""
    return execute_send_sms(
        request.to_number, request.message, request.caregiver_number
    )


@app.post("/api/call")
async def place_call(request: CallRequest):
    """Execute a confirmed phone call via ElevenLabs + Twilio."""
    return execute_place_call(
        request.to_number, request.purpose, request.service_name, request.message_script
    )


@app.post("/api/reminder")
async def create_reminder(request: ReminderRequest):
    """Generate and return a downloadable .ics calendar file."""
    filepath = generate_ics_file(
        request.title, request.date, request.time, request.description
    )
    return FileResponse(
        filepath, media_type="text/calendar", filename="goldenguide-reminder.ics"
    )


@app.post("/api/tts")
async def text_to_speech(text: str = Form(...)):
    """Generate speech audio from text using ElevenLabs TTS."""
    try:
        from elevenlabs import ElevenLabs

        client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

        audio_generator = client.text_to_speech.convert(
            text=text,
            voice_id="21m00Tcm4TlvDq8ikWAM",
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )

        audio_bytes = b"".join(audio_generator)

        filepath = "/tmp/goldenguide_tts.mp3"
        with open(filepath, "wb") as f:
            f.write(audio_bytes)

        return FileResponse(filepath, media_type="audio/mpeg")
    except Exception as e:
        return {"status": "error", "message": "Text-to-speech is temporarily unavailable."}
