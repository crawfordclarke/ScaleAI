from Backend.app.models import character
import random
from Backend.app.services.narrator import narrate_turn
from Backend.app.services.embeddings import retrieve_character_chunks


def format_chunks(chunks):
    return "\n\n".join(chunk[0] for chunk in chunks)

def simulate_turn(attacker: character, defender: character, lore: dict) -> dict:
    hit_chance = attacker.speed / (attacker.speed + defender.speed)
    

    
    
    if random.random() > hit_chance:
        return  {
        "attacker": attacker.name,
        "defender": defender.name,
        "damage_dealt": 0,
        "defender_health": defender.health,
        "hax_used": [],
        "is_finishing_blow": False,
        "missed": True
    }

    
    
    base_damage = random.randint(attacker.strength - 10, attacker.strength + 10)
    damage_redection = defender.durability * 0.5
    final_damage = max(0, base_damage - damage_redection)
    

    health_after_attack = max(0, defender.health - final_damage)
    is_finishing_blow = health_after_attack == 0
    
    

    turn_outcome = {
        "attacker": attacker.name,
        "defender": defender.name,
        "damage_dealt": final_damage,  # damage calc
        "defender_health": health_after_attack,  # health update
        "hax_used": [], # will be filled in later with hax logic  
        "is_finishing_blow": is_finishing_blow, # boolean on if ending blow or not
        "missed": False 
    }
    
    turn_outcome["narration"] = narrate_turn(turn_outcome, lore)
    return turn_outcome

def simulate_fight(character1: character, character2: character) -> dict:
    
    QUERY_TEMPLATE = "{name} powers fighting style personality signature moves" 
    
    lore = {
        character1.name: format_chunks(retrieve_character_chunks(character1.name, QUERY_TEMPLATE.format(name=character1.name), k=5)),
        character2.name: format_chunks(retrieve_character_chunks(character2.name, QUERY_TEMPLATE.format(name=character2.name), k=5)),
    }
    
    
    turns = []
    
    while character1.health > 0 and character2.health > 0:
        turn_result = simulate_turn(character1, character2, lore)
        character2.health = turn_result["defender_health"]
        turns.append(turn_result)
        
        if character2.health <= 0:
            return {
                "winner": character1.name,
                "turns": turns
            }
        
        turn_result = simulate_turn(character2, character1, lore)
        character1.health = turn_result["defender_health"]
        turns.append(turn_result)
        
        if character1.health <= 0:
            return {
                "winner": character2.name,
                "turns": turns
            }
    return None