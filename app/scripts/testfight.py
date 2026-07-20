import json

from Backend.app.models.character import Character
from Backend.app.engine.fight_engine import simulate_fight

c1 = Character(
    character_id=1, franchise="One Piece", name="Edward Newgate",
    description="", image_url="", strength=95, speed=70,
    intelligence=80, durability=90, hax=[]
)
c2 = Character(
    character_id=2, franchise="Dragon Ball", name="Goku",
    description="", image_url="", strength=90, speed=95,
    intelligence=75, durability=85, hax=[]
)

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