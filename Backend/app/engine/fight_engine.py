from typing import Iterator

from app.models import character
import random
from app.services.narrator import narrate_fight
from app.services.embeddings import retrieve_character_chunks
import json



def event(payload): return json.dumps(payload) + "\n"


def format_chunks(chunks):
    return "\n\n".join(chunk[0] for chunk in chunks)

def simulate_turn(attacker: character, defender: character) -> dict:
    hit_chance = 0.5 + (attacker.speed / (attacker.speed + defender.speed)) * 0.4
    

    
    
    if random.random() > hit_chance:
        turn_outcome = {
        "event": "turn",    
        "attacker": attacker.name,
        "defender": defender.name,
        "damage_dealt": 0,
        "defender_health": defender.health,
        "hax_used": [],
        "is_finishing_blow": False,
        "missed": True
        }
        return turn_outcome

    
    
    base_damage = random.randint(attacker.strength - 10, attacker.strength + 10)
    damage_redection = defender.durability * 0.5
    final_damage =round(max(0, base_damage - damage_redection))
    

    health_after_attack = max(0, defender.health - final_damage)
    is_finishing_blow = health_after_attack == 0
    
    

    turn_outcome = {
        "event": "turn",
        "attacker": attacker.name,
        "defender": defender.name,
        "damage_dealt": final_damage,  # damage calc
        "defender_health": health_after_attack,  # health update
        "hax_used": [], # will be filled in later with hax logic  
        "is_finishing_blow": is_finishing_blow, # boolean on if ending blow or not
        "missed": False 
    }
    
    return turn_outcome

def simulate_fight(character1: character, character2: character) -> Iterator[str]:
    yield event({"event": "fight_start", "fighter1": character1.name, "fighter1_max_health": character1.max_health, "fighter2": character2.name, "fighter2_max_health": character2.max_health})

    # The response status is already sent once streaming starts, so failures have to go out as an event
    try:
        yield from fight_turns(character1, character2)
    except Exception as e:
        print(f"Fight interrupted: {e!r}", flush=True)
        yield event({"event": "error", "message": "The fight was interrupted. Please try again in a minute."})


def fight_turns(character1: character, character2: character) -> Iterator[str]:

    
    
    MAX_TURNS = 50  # Prevent infinite loops in case of a bug
    turn_counter = 0
    
    QUERY_TEMPLATE = "{name} powers fighting style personality signature moves" 
    
    lore = {
        character1.name: format_chunks(retrieve_character_chunks(character1.name, QUERY_TEMPLATE.format(name=character1.name), k=5)),
        character2.name: format_chunks(retrieve_character_chunks(character2.name, QUERY_TEMPLATE.format(name=character2.name), k=5)),
    }
    
    
    # Work out the whole fight first so it can be narrated in one Gemini request
    turns = []
    
    while character1.health > 0 and character2.health > 0 and turn_counter < MAX_TURNS:
        turn_result = simulate_turn(character1, character2)
        character2.health = turn_result["defender_health"]
        turns.append(turn_result)
        turn_counter += 1

        if character2.health <= 0:
            break
        
        turn_result = simulate_turn(character2, character1)
        character1.health = turn_result["defender_health"]
        turns.append(turn_result)
        turn_counter += 1
    
    for turn_result, narration in zip(turns, narrate_fight(turns, lore)):
        turn_result["narration"] = narration
        yield event(turn_result)

    if character1.health <= 0:
        winner = character2.name
    elif character2.health <= 0:
        winner = character1.name
    else:
        winner = None 
        
    yield event({"event": "fight_over", "winner": winner})