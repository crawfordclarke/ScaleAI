import json
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def narrate_turn(turn_data: dict) -> str:
    prompt = f"""You are a hype anime fight commentator with deep lore knowledge.

turn this {json.dumps(turn_data, indent=2)} into a dramatic narration of the fight taking into account each categorie of data.

Narrate this single turn in 2-3 sentences. Be dramatic and lore-accurate. 
Do not invent abilities the character doesn't have. End on a cliffhanger if HP is low."""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text