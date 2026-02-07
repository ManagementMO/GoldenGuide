"""Tool 6: Generate .ics calendar reminder file."""

import os
import uuid
from datetime import datetime


def create_reminder_impl(
    title: str, date: str, description: str, time: str = "10:00"
) -> dict:
    """Create a calendar reminder and return download info."""
    return {
        "title": title,
        "date": date,
        "time": time,
        "description": description,
        "download_url": "/api/reminder",
    }


def generate_ics_file(title: str, date: str, time: str, description: str) -> str:
    """Generate an actual .ics file and return its path."""
    dt_str = date.replace("-", "") + "T" + time.replace(":", "") + "00"
    uid = str(uuid.uuid4())

    ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GoldenGuide//EN
BEGIN:VEVENT
UID:{uid}
DTSTART:{dt_str}
SUMMARY:{title}
DESCRIPTION:{description.replace(chr(10), "\\n")}
END:VEVENT
END:VCALENDAR"""

    filepath = f"/tmp/goldenguide_reminder_{uid[:8]}.ics"
    with open(filepath, "w") as f:
        f.write(ics_content)

    return filepath
