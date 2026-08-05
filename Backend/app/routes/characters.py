from fastapi import APIRouter
from app.models.character import CharacterSummary
from app.services.database import get_all_characters

router = APIRouter()


@router.get("/characters")
def get_characters() -> list[CharacterSummary]:
    return get_all_characters()