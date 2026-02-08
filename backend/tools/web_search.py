"""Tool 11: Search the web for current information using Tavily."""

import os
from tavily import TavilyClient


def web_search_impl(query: str, max_results: int = 5) -> dict:
    """
    Search the web using Tavily and return structured results.
    Requires TAVILY_API_KEY environment variable.
    """
    # Clamp max_results to a reasonable range
    max_results = max(1, min(int(max_results), 10))

    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        return {
            "success": False,
            "error": "TAVILY_API_KEY environment variable is not set.",
            "results": [],
            "query": query,
        }

    try:
        client = TavilyClient(api_key=api_key)
        response = client.search(query=query, max_results=max_results)
    except Exception as e:
        return {
            "success": False,
            "error": f"Web search failed: {str(e)}",
            "results": [],
            "query": query,
        }

    raw_results = response.get("results", [])

    if not raw_results:
        return {
            "success": True,
            "results": [],
            "query": query,
            "summary": "No results found. Try rephrasing your search query.",
        }

    results = [
        {
            "title": r.get("title", ""),
            "url": r.get("url", ""),
            "snippet": r.get("content", ""),
        }
        for r in raw_results
    ]

    return {
        "success": True,
        "results": results,
        "query": query,
        "result_count": len(results),
    }
