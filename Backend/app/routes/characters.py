from fastapi import APIRouter
from Backend.app.models.character import CharacterSummary
from Backend.app.services.database import get_all_characters

router = APIRouter()


@router.get("/characters")
def get_characters() -> list[CharacterSummary]:
    return get_all_characters()