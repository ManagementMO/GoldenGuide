"""Tool 7: Multimodal document explanation."""


def explain_document_impl(document_context: str = "") -> dict:
    """
    This tool is invoked by Gemini when a user uploads a document image.
    The actual image is already in the conversation (sent as inline_data).
    Gemini uses its vision capabilities to read and explain the document.
    This function just returns a signal that the explanation was requested.
    """
    return {
        "status": "analyzing",
        "context": document_context,
        "instruction": "The document image is in the conversation. Please read it and explain in plain English what it says, what action the user needs to take, and any important deadlines. Be warm and reassuring.",
    }
