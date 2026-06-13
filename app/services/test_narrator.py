from narrator import narrate_turn
from narrator import client

turn_data = {
    "attacker": "Goku",
    "defender": "Naruto Uzumaki",
    "damage_dealt": 23.5,
    "defender_health": 76.5,
    "hax_used": ["ki manipulation"],
    "is_finishing_blow": False,
    "missed": False
}

print(narrate_turn(turn_data))