"""Tool 3: Kingston Transit GTFS data lookup."""

import csv
import os
from datetime import datetime

GTFS_DIR = os.path.join(os.path.dirname(__file__), "..", "gtfs")


def _load_csv(filename):
    """Load a GTFS CSV file into a list of dicts."""
    filepath = os.path.join(GTFS_DIR, filename)
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


# Load GTFS data at module level (it's static)
try:
    ROUTES = _load_csv("routes.txt")
    STOPS = _load_csv("stops.txt")
    STOP_TIMES = _load_csv("stop_times.txt")
    TRIPS = _load_csv("trips.txt")
except Exception:
    ROUTES, STOPS, STOP_TIMES, TRIPS = [], [], [], []


def get_transit_info_impl(
    destination: str, origin: str = "", time: str = "now"
) -> dict:
    """
    Query Kingston Transit GTFS data for routes, stops, and schedules.
    Simple keyword matching on stop names.
    """
    if not STOPS:
        return {
            "error": "GTFS data not loaded. Kingston Transit info: call 613-546-0000 or visit kingstontransit.ca",
            "general_info": {
                "phone": "613-546-0000",
                "website": "kingstontransit.ca",
                "senior_fare": "$2.25",
                "regular_fare": "$3.25",
            },
        }

    # Find matching stops
    dest_lower = destination.lower()
    matching_stops = [s for s in STOPS if dest_lower in s.get("stop_name", "").lower()]

    if not matching_stops:
        return {
            "message": f"I couldn't find a stop matching '{destination}'. Try a street name or landmark.",
            "suggestion": "You can call Kingston Transit at 613-546-0000 for help planning your trip.",
            "all_info": {"phone": "613-546-0000", "website": "kingstontransit.ca"},
        }

    # Get routes serving those stops
    stop_ids = {s["stop_id"] for s in matching_stops[:5]}

    # Find trips that serve these stops
    serving_trips = set()
    relevant_stop_times = []
    for st in STOP_TIMES:
        if st.get("stop_id") in stop_ids:
            serving_trips.add(st.get("trip_id"))
            relevant_stop_times.append(st)

    # Find route info for those trips
    trip_route_map = {
        t["trip_id"]: t["route_id"] for t in TRIPS if t["trip_id"] in serving_trips
    }
    route_ids = set(trip_route_map.values())
    route_info = [r for r in ROUTES if r["route_id"] in route_ids]

    return {
        "destination": destination,
        "matching_stops": [
            {
                "name": s["stop_name"],
                "id": s["stop_id"],
                "lat": s.get("stop_lat"),
                "lon": s.get("stop_lon"),
            }
            for s in matching_stops[:3]
        ],
        "serving_routes": [
            {
                "route_id": r["route_id"],
                "name": r.get("route_long_name", r.get("route_short_name", "")),
            }
            for r in route_info[:5]
        ],
        "sample_times": [
            {
                "stop": st["stop_id"],
                "arrival": st.get("arrival_time"),
                "departure": st.get("departure_time"),
            }
            for st in sorted(
                relevant_stop_times, key=lambda x: x.get("departure_time", "")
            )[:5]
        ],
        "general_info": {
            "phone": "613-546-0000",
            "website": "kingstontransit.ca",
            "senior_fare": "$2.25",
            "regular_fare": "$3.25",
            "mfap_pass": "Discounted monthly pass with MFAP card",
        },
    }
