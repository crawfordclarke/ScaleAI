import json
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

    prompt = f"""You are a hype anime fight commentator with deep lore knowledge.

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

    Narrate this single turn in 2-3 sentences. Be dramatic and lore-accurate.
    End on a cliffhanger if HP is low."""
        
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text