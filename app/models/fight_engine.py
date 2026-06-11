from Backend.app.models import character


def simulate_turn(attacker: character, defender: character) -> dict:
    damage = max(0, attacker.strength - defender.durability)
    
    health_after_attack = max(0, defender.health - damage)
    is_finishing_blow = health_after_attack == 0

    return {
        "attacker": attacker.name,
        "defender": defender.name,
        "damage_dealt": damage,  # Placeholder for damage calculation
        "defender_health": health_after_attack,  # Placeholder for health update
        "hax_used": [],
        "is_finishing_blow": is_finishing_blow  #  Placeholder for damage calculation
    }

def simulate_fight(character1: character, character2: character) -> dict:
    turns = []
    
    while character1.health > 0 and character2.health > 0:
        turn_result = simulate_turn(character1, character2)
        character2.health = turn_result["defender_health"]
        turns.append(turn_result)
        
        if character2.health <= 0:
            return {
                "winner": character1.name,
                "turns": turns
            }
        
        turn_result = simulate_turn(character2, character1)
        character1.health = turn_result["defender_health"]
        turns.append(turn_result)
        
        if character1.health <= 0:
            return {
                "winner": character2.name,
                "turns": turns
            }
    return None