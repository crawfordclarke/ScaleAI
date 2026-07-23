from app.models.character import Character
from app.engine.fight_engine import simulate_fight

goku = Character(
    character_id=1,
    franchise="Dragon Ball Z",
    name="Goku",
    description="Saiyan warrior who has pushed beyond mortal limits through constant training and battle.",
    image_url="",
    strength=95,
    speed=97,
    intelligence=60,
    durability=90,
    hax=["ki manipulation", "instant transmission", "ultra instinct"],
    health=100,
    max_health=100
)

naruto = Character(
    character_id=2,
    franchise="Naruto",
    name="Naruto Uzumaki",
    description="Jinchuriki of the Nine Tails, Seventh Hokage, and the strongest shinobi in history.",
    image_url="",
    strength=88,
    speed=89,
    intelligence=65,
    durability=85,
    hax=["six paths sage mode", "truth seeking orbs", "kurama chakra"],
    health=100,
    max_health=100
)

if __name__ == "__main__":
    fight_result = simulate_fight(goku, naruto)
    print(fight_result)