"""
GoldenGuide Agentic Loop.
Gemini function calling with 10 tools.
"""

import os
import json
from google import genai
from google.genai import types

from knowledge.system_prompt import build_system_prompt
from tools.search_services import search_services_impl
from tools.check_eligibility import check_eligibility_impl
from tools.get_transit import get_transit_info_impl
from tools.action_plan import generate_action_plan_impl
from tools.draft_comms import draft_communication_impl
from tools.create_reminder import create_reminder_impl
from tools.explain_document import explain_document_impl

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
    # NOTE: place_call, send_email, send_sms are NOT auto-executed.
    # They return preview data. The frontend shows a confirmation card.
    # Actual execution happens via separate /api/call, /api/email, /api/sms endpoints.
    "place_call": lambda **kwargs: {
        "action": "place_call",
        "preview": kwargs,
        "requires_confirmation": True,
    },
    "send_email": lambda **kwargs: {
        "action": "send_email",
        "preview": kwargs,
        "requires_confirmation": True,
    },
    "send_sms": lambda **kwargs: {
        "action": "send_sms",
        "preview": kwargs,
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
]


async def agent_chat(
    user_message: str, history: list, image_data: str = None, image_mime: str = None
) -> dict:
    """
    The core agentic loop.
    1. Inject system prompt + Kingston knowledge
    2. Send to Gemini with 10 tool declarations
    3. If Gemini returns tool calls -> execute them -> feed results back
    4. Repeat until Gemini gives a final text response
    5. Return text + structured data for frontend rendering
    """
    client = genai.Client(api_key=GEMINI_API_KEY)

    system_prompt = build_system_prompt()

    tools = types.Tool(function_declarations=tool_declarations)
    config = types.GenerateContentConfig(
        tools=[tools],
        system_instruction=system_prompt,
        temperature=1.0,
    )

    # Build user message parts
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
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config=config,
            contents=history,
        )

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
            history.append({"role": "model", "parts": [{"text": text_response}]})
            return {
                "text": text_response,
                "history": history,
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
                {"function_response": {"name": func_name, "response": result}}
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
            elif func_name in ("place_call", "send_email", "send_sms"):
                structured_data.setdefault("pending_actions", []).append(result)

        # Add tool calls + results to history, then loop
        history.append(
            {
                "role": "model",
                "parts": [
                    {
                        "function_call": {
                            "name": tc.name,
                            "args": dict(tc.args) if tc.args else {},
                        }
                    }
                    for tc in tool_calls
                ],
            }
        )
        history.append({"role": "user", "parts": tool_results})

    # If we hit max iterations, return whatever we have
    return {
        "text": text_response
        or "I'm still working on that — let me know if you'd like me to try again.",
        "history": history,
        "structured_data": structured_data,
        "tool_calls_made": tool_calls_made,
    }
