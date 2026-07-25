import json

from Backend.app.models.character import Character
from Backend.app.engine.fight_engine import simulate_fight
from Backend.app.services.database import get_character

c1 = get_character(1)
c2 = get_character(2)

for line in simulate_fight(c1, c2):
    data = json.loads(line)

    if data["event"] == "turn":
        print(f"[{data['attacker']} -> {data['defender']}] "
              f"dmg {data['damage_dealt']}, "
              f"{data['defender']} at {data['defender_health']}")
        print(data["narration"])
        print()
    elif data["event"] == "fight_over":
        winner = data["winner"]
        print("=" * 40)
        print(f"Winner: {winner}" if winner else "Draw — turn cap reached")