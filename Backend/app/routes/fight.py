from app.models.character import FightRequest
from app.services.database import get_character
from fastapi import APIRouter ,HTTPException
from fastapi.responses import StreamingResponse
from app.engine.fight_engine import simulate_fight


router = APIRouter()

@router.post("/fight")
def fight(request: FightRequest):
    c1 = get_character(request.character1_id)
    c2 = get_character(request.character2_id)

    if c1 is None or c2 is None:
        raise HTTPException(status_code=404, detail="One or both characters not found")

    return StreamingResponse(simulate_fight(c1,c2), media_type="application/x-ndjson")