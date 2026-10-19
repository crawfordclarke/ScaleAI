import json
import time
from google.genai import errors, types
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
    # ms; one call now narrates the whole fight, so allow longer than a single turn needed
    http_options=types.HttpOptions(timeout=45_000),
)

def narrate_fight(turns: list[dict], lore: dict) -> list[str | None]:
    '''Narrates every turn of a fight in a single Gemini request (the free tier caps requests
    per day, not tokens). Returns one narration per turn, in order. A None entry means that
    turn goes out without narration and the frontend shows a plain "X hits Y" line instead.'''
    no_narration = [None] * len(turns)
    if not turns:
        return no_narration

    lore_sections = "\n\n".join(
        f"<{name}_lore>\n{text}\n</{name}_lore>" for name, text in lore.items()
    )
    numbered_turns = json.dumps(
        [{"turn": i + 1, **turn} for i, turn in enumerate(turns)], indent=2
    )

    prompt = f"""You write tight, cinematic narration for an anime/manga fight — think manga narration
    captions or a well-written light novel fight scene, not a ringside announcer.

    {lore_sections}

    <turn_results>
    {numbered_turns}
    </turn_results>

    Use the lore sections ONLY for voice, flavor, and each character's real abilities.
    Use <turn_results> as the factual outcome of each turn — narrate exactly what each one says
    happened, never more. If a turn has "missed": true, the attack misses and deals no damage.
    Do not invent abilities a character doesn't have.

    Narrate every turn in 2-3 sentences, as one continuous fight: later turns can build on
    earlier ones, but each narration must still describe its own turn.
    Return a JSON array of exactly {len(turns)} strings, one per turn, in order.

    Style rules:
    - Prioritize precision and specific physical detail over intensity words. Let the action itself
    carry the drama, not adjectives like "colossal," "devastating," or "monstrous."
    - Use exclamation points rarely — at most one per turn, and only for a genuine turning point.
    - Do not open with an exclamation ("WHOA!", "INCREDIBLE!") or a stock phrase. Vary sentence
    structure and openings turn to turn.
    - Do not end on a rhetorical question ("Can he survive this?!"). If HP is critically low, convey
    that through what's described, not by asking the reader.
    - Write like the outcome already matters, not like you're trying to convince the reader it does."""

    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=list[str],
    )

    for attempt in range(2):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=config,
            )
            narrations = response.parsed
            if not isinstance(narrations, list):
                print(f"Narration skipped: unexpected response {response.text[:200]!r}", flush=True)
                return no_narration
            if len(narrations) != len(turns):
                print(f"Narration count mismatch: got {len(narrations)} for {len(turns)} turns", flush=True)
            # Pad or trim so every turn lines up with its own narration
            return (list(narrations) + no_narration)[: len(turns)]
        except errors.ClientError as e:
            print(f"Narration skipped ({e.code} {e.status}): {e.message}", flush=True)
            return no_narration  # 429 quota etc. — fail fast, retrying won't help
        except Exception as e:
            print(f"Narration attempt {attempt + 1} failed: {e!r}", flush=True)
            if attempt == 0:
                time.sleep(1)
    return no_narration
