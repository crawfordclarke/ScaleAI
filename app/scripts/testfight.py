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

result = simulate_fight(c1, c2)
print(f"Winner: {result['winner']}\n")
for i, turn in enumerate(result["turns"], 1):
    print(f"--- Turn {i} ---")
    print(turn.get("narration", "(miss — no narration)"))
    print()