"""
GoldenGuide Agentic Loop.
Gemini 3 Flash function calling with 11 tools.
"""

import os
import json
from typing import Any
from google import genai
from google.genai import types

GEMINI_MODEL = "gemini-3-flash-preview"

from knowledge.system_prompt import build_system_prompt
from knowledge.demo_profile import DEMO_PROFILE
from tools.search_services import search_services_impl
from tools.check_eligibility import check_eligibility_impl
from tools.get_transit import get_transit_info_impl
from tools.action_plan import generate_action_plan_impl
from tools.draft_comms import draft_communication_impl
from tools.create_reminder import create_reminder_impl
from tools.explain_document import explain_document_impl
from tools.web_search import web_search_impl

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Map tool names to implementation functions
TOOL_FUNCTIONS = {
    "search_services": search_services_impl,
    "check_eligibility": check_eligibility_impl,
    "get_transit_info": get_transit_info_impl,
    "generate_action_plan": generate_action_plan_impl,
    "draft_communication": draft_communication_impl,
    "create_reminder": create_reminder_impl,
    "explain_document": explain_document_impl,
    "web_search": web_search_impl,
    # NOTE: place_call, send_email, send_sms are NOT auto-executed.
    # They return preview data. The frontend shows a confirmation card.
    # Actual execution happens via separate /api/call, /api/email, /api/sms endpoints.
    "place_call": lambda **kwargs: {
        "action": "place_call",
        "recipient_name": kwargs.get("recipient_name", ""),
        "phone_number": kwargs.get("target_number", ""),
        "script": kwargs.get("message_script", ""),
        "purpose": kwargs.get("user_context", kwargs.get("recipient_name", "")),
        "service_name": kwargs.get("recipient_name", ""),
        "requires_confirmation": True,
    },
    "send_email": lambda **kwargs: {
        "action": "send_email",
        "to_email": kwargs.get("to_email", ""),
        "subject": kwargs.get("subject", ""),
        "body": kwargs.get("body", ""),
        "body_html": kwargs.get("body", ""),
        "recipient_name": kwargs.get("recipient_name", ""),
        "requires_confirmation": True,
    },
    "send_sms": lambda **kwargs: {
        "action": "send_sms",
        "phone_number": kwargs.get("phone_number", ""),
        "message": kwargs.get("message", ""),
        "caregiver_number": kwargs.get("caregiver_number") or DEMO_PROFILE["family"]["daughter_phone"],
        "requires_confirmation": True,
    },
}

# === Gemini Tool Declarations ===
tool_declarations = [
    {
        "name": "search_services",
        "description": "Search Kingston municipal services database for seniors. Use when user asks about any city service, program, or support. Returns matching services with details.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "What to search for, e.g. 'dental help seniors' or 'affordable housing'",
                },
                "category": {
                    "type": "string",
                    "enum": [
                        "health",
                        "housing",
                        "transit",
                        "recreation",
                        "financial",
                        "accessibility",
                        "food",
                        "all",
                    ],
                    "description": "Category to filter",
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "check_eligibility",
        "description": "Check if user is eligible for Kingston programs. ALWAYS check multiple programs proactively.",
        "parameters": {
            "type": "object",
            "properties": {
                "age": {"type": "integer", "description": "User's age"},
                "income_level": {
                    "type": "string",
                    "enum": ["low", "moderate", "high", "unknown"],
                    "description": "Approximate income level",
                },
                "household_size": {
                    "type": "integer",
                    "description": "Number of people in household",
                },
                "is_kingston_resident": {
                    "type": "boolean",
                    "description": "Whether user lives in Kingston",
                },
                "has_disability": {
                    "type": "boolean",
                    "description": "Whether user has a disability",
                },
                "programs_to_check": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Program IDs to check: CDCP, MFAP, homemaking, SPARK, transit_discount, housing, low_income_health",
                },
            },
            "required": ["programs_to_check"],
        },
    },
    {
        "name": "get_transit_info",
        "description": "Get Kingston Transit bus route info, schedules, and next departures using real GTFS data.",
        "parameters": {
            "type": "object",
            "properties": {
                "destination": {
                    "type": "string",
                    "description": "Where the user wants to go",
                },
                "origin": {
                    "type": "string",
                    "description": "Where the user is coming from",
                },
                "time": {
                    "type": "string",
                    "description": "When to travel, e.g. 'now', '2:00 PM', 'tomorrow morning'",
                },
            },
            "required": ["destination"],
        },
    },
    {
        "name": "generate_action_plan",
        "description": "Generate a structured, prioritized action plan for the user. Use AFTER finding services and checking eligibility.",
        "parameters": {
            "type": "object",
            "properties": {
                "user_situation": {
                    "type": "string",
                    "description": "Summary of user's needs and situation",
                },
                "eligible_services": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Services the user qualifies for",
                },
            },
            "required": ["user_situation", "eligible_services"],
        },
    },
    {
        "name": "draft_communication",
        "description": "Draft an email or phone call script to a Kingston service provider on behalf of the user.",
        "parameters": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": ["email", "phone_script", "both"],
                    "description": "Type of communication to draft",
                },
                "recipient": {
                    "type": "string",
                    "description": "Who to contact (service name)",
                },
                "recipient_email": {
                    "type": "string",
                    "description": "Email address if known",
                },
                "purpose": {
                    "type": "string",
                    "description": "Why the user is reaching out",
                },
                "user_details": {
                    "type": "string",
                    "description": "Relevant details about the user's situation",
                },
            },
            "required": ["type", "recipient", "purpose"],
        },
    },
    {
        "name": "create_reminder",
        "description": "Create a downloadable calendar reminder (.ics) for an important follow-up action.",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "date": {"type": "string", "description": "Date in YYYY-MM-DD format"},
                "time": {"type": "string", "description": "Time in HH:MM format"},
                "description": {
                    "type": "string",
                    "description": "What the user needs to do and bring",
                },
            },
            "required": ["title", "date", "description"],
        },
    },
    {
        "name": "explain_document",
        "description": "When user uploads a photo of a letter, form, or document from the city, explain it in simple plain English and identify required actions.",
        "parameters": {
            "type": "object",
            "properties": {
                "document_context": {
                    "type": "string",
                    "description": "Any context the user provided about the document",
                }
            },
        },
    },
    {
        "name": "place_call",
        "description": "Place a real phone call to a Kingston service office on behalf of the user. ALWAYS show preview and get confirmation first.",
        "parameters": {
            "type": "object",
            "properties": {
                "target_number": {
                    "type": "string",
                    "description": "Phone number to call",
                },
                "recipient_name": {
                    "type": "string",
                    "description": "Who is being called",
                },
                "message_script": {
                    "type": "string",
                    "description": "What the AI voice will say on the call",
                },
                "user_context": {
                    "type": "string",
                    "description": "Brief context about the user",
                },
            },
            "required": ["target_number", "recipient_name", "message_script"],
        },
    },
    {
        "name": "send_email",
        "description": "Send a real email to a Kingston service provider on behalf of the user. ALWAYS show draft and get confirmation first.",
        "parameters": {
            "type": "object",
            "properties": {
                "to_email": {
                    "type": "string",
                    "description": "Recipient email address",
                },
                "subject": {"type": "string", "description": "Email subject line"},
                "body": {"type": "string", "description": "Email body text"},
                "recipient_name": {
                    "type": "string",
                    "description": "Name of the department",
                },
            },
            "required": ["to_email", "subject", "body"],
        },
    },
    {
        "name": "send_sms",
        "description": "Text the user's action plan or key information to their phone.",
        "parameters": {
            "type": "object",
            "properties": {
                "phone_number": {
                    "type": "string",
                    "description": "User's phone number",
                },
                "caregiver_number": {
                    "type": "string",
                    "description": "Optional: family member's phone number",
                },
                "message": {"type": "string", "description": "Text message content"},
            },
            "required": ["phone_number", "message"],
        },
    },
    {
        "name": "web_search",
        "description": "Search the web for current information about Kingston services, government programs, eligibility criteria, or any topic the user asks about. Use this to verify facts, find up-to-date details, or answer questions beyond the knowledge base.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query. Be specific and include relevant context like 'Kingston Ontario' for local queries.",
                },
                "max_results": {
                    "type": "integer",
                    "description": "Number of results to return (default 5, max 10)",
                },
            },
            "required": ["query"],
        },
    },
]


def _normalize_function_response_payload(result: Any) -> dict:
    """
    Gemini function_response.response must be a JSON object.
    Wrap scalar/list outputs in {"output": ...} to keep schema valid.
    """
    if isinstance(result, dict):
        return result
    return {"output": result}


def _sanitize_history_for_genai(history: list) -> list:
    """
    Normalize incoming history to the structure expected by google-genai.
    This prevents crashes when prior turns stored non-dict function responses.
    """
    if not isinstance(history, list):
        return []

    normalized_history = []
    for message in history:
        if not isinstance(message, dict):
            continue

        role = message.get("role")
        if role not in ("user", "model"):
            role = "user"

        raw_parts = message.get("parts", [])
        if not isinstance(raw_parts, list):
            raw_parts = [{"text": str(raw_parts)}]

        parts = []
        for part in raw_parts:
            if isinstance(part, str):
                parts.append({"text": part})
                continue
            if not isinstance(part, dict):
                parts.append({"text": str(part)})
                continue

            normalized_part = dict(part)

            if "function_call" in normalized_part and isinstance(
                normalized_part["function_call"], dict
            ):
                function_call = dict(normalized_part["function_call"])
                if "args" in function_call and not isinstance(function_call["args"], dict):
                    function_call["args"] = {"value": function_call["args"]}
                normalized_part["function_call"] = function_call

            if "function_response" in normalized_part and isinstance(
                normalized_part["function_response"], dict
            ):
                function_response = dict(normalized_part["function_response"])
                function_response["response"] = _normalize_function_response_payload(
                    function_response.get("response")
                )
                normalized_part["function_response"] = function_response

            parts.append(normalized_part)

        normalized_history.append({"role": role, "parts": parts})

    return normalized_history


def _serialize_history(history: list) -> list:
    """
    Convert history entries to JSON-serializable dicts for frontend transport.
    Gemini 3 Content objects (with thought signatures) must be converted back
    to plain dicts. Thought signatures are only needed within a single agentic
    loop execution — they're regenerated on the next request.
    """
    serialized = []
    for entry in history:
        if isinstance(entry, dict):
            serialized.append(entry)
            continue
        # Handle google-genai Content objects from Gemini 3 responses
        if hasattr(entry, "role") and hasattr(entry, "parts"):
            parts = []
            for part in entry.parts:
                part_dict = {}
                if hasattr(part, "text") and part.text:
                    part_dict["text"] = part.text
                if hasattr(part, "function_call") and part.function_call:
                    part_dict["function_call"] = {
                        "name": part.function_call.name,
                        "args": dict(part.function_call.args) if part.function_call.args else {},
                    }
                if hasattr(part, "function_response") and part.function_response:
                    resp = part.function_response.response
                    part_dict["function_response"] = {
                        "name": part.function_response.name,
                        "response": resp if isinstance(resp, dict) else {"output": resp},
                    }
                if part_dict:
                    parts.append(part_dict)
            serialized.append({"role": entry.role, "parts": parts})
        else:
            serialized.append(entry)
    return serialized


async def agent_chat(
    user_message: str, history: list, language: str = "en", image_data: str = None, image_mime: str = None
) -> dict:
    """
    The core agentic loop.
    1. Inject system prompt + Kingston knowledge
    2. Send to Gemini with 11 tool declarations
    3. If Gemini returns tool calls -> execute them -> feed results back
    4. Repeat until Gemini gives a final text response
    5. Return text + structured data for frontend rendering
    """
    client = genai.Client(api_key=GEMINI_API_KEY)

    system_prompt = build_system_prompt(language=language)

    tools = types.Tool(function_declarations=tool_declarations)
    config = types.GenerateContentConfig(
        tools=[tools],
        system_instruction=system_prompt,
        temperature=1.0,
    )

    # Build user message parts
    history = _sanitize_history_for_genai(history)

    user_parts = []
    if image_data:
        user_parts.append(
            {
                "inline_data": {
                    "mime_type": image_mime or "image/jpeg",
                    "data": image_data,
                }
            }
        )
    user_parts.append({"text": user_message})

    # Add to history
    history.append({"role": "user", "parts": user_parts})

    structured_data = {}
    tool_calls_made = []
    max_iterations = 8  # Safety limit

    for _ in range(max_iterations):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                config=config,
                contents=history,
            )
        except Exception as e:
            return {
                "text": "I'm having trouble connecting right now. Please try again in a moment.",
                "history": _serialize_history(history),
                "structured_data": structured_data,
                "tool_calls_made": tool_calls_made,
            }

        # Parse response parts
        tool_calls = []
        text_response = ""

        for part in response.candidates[0].content.parts:
            if hasattr(part, "function_call") and part.function_call:
                tool_calls.append(part.function_call)
            if hasattr(part, "text") and part.text:
                text_response += part.text

        # If no tool calls, we have the final response
        if not tool_calls:
            # Preserve original Content object (includes Gemini 3 thought signatures)
            history.append(response.candidates[0].content)
            return {
                "text": text_response,
                "history": _serialize_history(history),
                "structured_data": structured_data,
                "tool_calls_made": tool_calls_made,
            }

        # Execute each tool call
        tool_results = []
        for call in tool_calls:
            func_name = call.name
            func_args = dict(call.args) if call.args else {}

            tool_calls_made.append(func_name)

            try:
                result = TOOL_FUNCTIONS[func_name](**func_args)
            except Exception as e:
                result = {"error": str(e)}

            tool_results.append(
                {
                    "function_response": {
                        "name": func_name,
                        "response": _normalize_function_response_payload(result),
                    }
                }
            )

            # Track structured outputs for frontend rendering
            if func_name == "generate_action_plan":
                structured_data["action_plan"] = result
            elif func_name == "draft_communication":
                structured_data["draft"] = result
            elif func_name == "create_reminder":
                structured_data["reminder"] = result
            elif func_name == "check_eligibility":
                structured_data["eligibility"] = result
            elif func_name == "explain_document":
                structured_data["document_explanation"] = result
            elif func_name in ("place_call", "send_email", "send_sms"):
                structured_data.setdefault("pending_actions", []).append(result)

        # Preserve original model Content (includes Gemini 3 thought signatures
        # needed for multi-turn function calling within this agentic loop)
        history.append(response.candidates[0].content)
        history.append({"role": "user", "parts": tool_results})

    # If we hit max iterations, return whatever we have
    return {
        "text": text_response
        or "I'm still working on that — let me know if you'd like me to try again.",
        "history": _serialize_history(history),
        "structured_data": structured_data,
        "tool_calls_made": tool_calls_made,
    }


async def agent_chat_stream(user_message: str, history: list, language: str = "en", image_data: str = None, image_mime: str = None):
    """Streaming version of agent_chat that yields SSE events."""
    client = genai.Client(api_key=GEMINI_API_KEY)
    system_prompt = build_system_prompt(language=language)
    tools = types.Tool(function_declarations=tool_declarations)
    config = types.GenerateContentConfig(tools=[tools], system_instruction=system_prompt, temperature=1.0)

    history = _sanitize_history_for_genai(history)
    user_parts = []
    if image_data:
        user_parts.append({"inline_data": {"mime_type": image_mime or "image/jpeg", "data": image_data}})
    user_parts.append({"text": user_message})
    history.append({"role": "user", "parts": user_parts})

    structured_data = {}
    tool_calls_made = []
    max_iterations = 8
    text_response = ""

    for iteration in range(max_iterations):
        yield {"event": "thinking", "data": {"iteration": iteration + 1}}

        try:
            response = client.models.generate_content(model=GEMINI_MODEL, config=config, contents=history)
        except Exception as e:
            yield {"event": "complete", "data": {"text": "I'm having trouble connecting right now. Please try again in a moment.", "history": _serialize_history(history), "structured_data": structured_data, "tool_calls_made": tool_calls_made}}
            return

        tool_calls = []
        text_response = ""
        for part in response.candidates[0].content.parts:
            if hasattr(part, "function_call") and part.function_call:
                tool_calls.append(part.function_call)
            if hasattr(part, "text") and part.text:
                text_response += part.text

        if not tool_calls:
            history.append(response.candidates[0].content)
            yield {"event": "complete", "data": {"text": text_response, "history": _serialize_history(history), "structured_data": structured_data, "tool_calls_made": tool_calls_made}}
            return

        tool_results = []
        for call in tool_calls:
            func_name = call.name
            func_args = dict(call.args) if call.args else {}
            tool_calls_made.append(func_name)

            yield {"event": "tool_start", "data": {"tool": func_name}}

            try:
                result = TOOL_FUNCTIONS[func_name](**func_args)
            except Exception as e:
                result = {"error": str(e)}

            yield {"event": "tool_done", "data": {"tool": func_name}}

            tool_results.append({"function_response": {"name": func_name, "response": _normalize_function_response_payload(result)}})

            # Track structured outputs
            if func_name == "generate_action_plan":
                structured_data["action_plan"] = result
            elif func_name == "draft_communication":
                structured_data["draft"] = result
            elif func_name == "create_reminder":
                structured_data["reminder"] = result
            elif func_name == "check_eligibility":
                structured_data["eligibility"] = result
            elif func_name == "explain_document":
                structured_data["document_explanation"] = result
            elif func_name in ("place_call", "send_email", "send_sms"):
                structured_data.setdefault("pending_actions", []).append(result)

        history.append(response.candidates[0].content)
        history.append({"role": "user", "parts": tool_results})

    yield {"event": "complete", "data": {"text": text_response or "I'm still working on that — let me know if you'd like me to try again.", "history": _serialize_history(history), "structured_data": structured_data, "tool_calls_made": tool_calls_made}}
