import json
import time
from google.genai import errors
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def narrate_turn(turn_data: dict, lore: dict) -> str:
    
    attacker = turn_data["attacker"]
    defender = turn_data["defender"]
    attacker_lore = lore[attacker]
    defender_lore = lore[defender]

    prompt = f"""You write tight, cinematic narration for an anime/manga fight — think manga narration
    captions or a well-written light novel fight scene, not a ringside announcer.

    <{attacker}_lore>
    {attacker_lore}
    </{attacker}_lore>

    <{defender}_lore>
    {defender_lore}
    </{defender}_lore>

    <turn_result>
    {json.dumps(turn_data, indent=2)}
    </turn_result>

    Use the lore sections ONLY for voice, flavor, and each character's real abilities.
    Use <turn_result> as the factual outcome — narrate exactly what it says happened, never more.
    Do not invent abilities a character doesn't have.

    Narrate this single turn in 2-3 sentences.

    Style rules:
    - Prioritize precision and specific physical detail over intensity words. Let the action itself
    carry the drama, not adjectives like "colossal," "devastating," or "monstrous."
    - Use exclamation points rarely — at most one per turn, and only for a genuine turning point.
    - Do not open with an exclamation ("WHOA!", "INCREDIBLE!") or a stock phrase. Vary sentence
    structure and openings turn to turn.
    - Do not end on a rhetorical question ("Can he survive this?!"). If HP is critically low, convey
    that through what's described, not by asking the reader.
    - Write like the outcome already matters, not like you're trying to convince the reader it does."""
        
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            return response.text
        except errors.APIError:
            time.sleep(15)
    raise Exception("narration failed after 3 attempts")
