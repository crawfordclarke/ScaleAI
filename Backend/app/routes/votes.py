from fastapi import APIRouter
from pydantic import BaseModel
from app.services.database import cast_vote, get_votes
from app.models.voting import VoteCreate

router = APIRouter()




@router.post("/vote")
def submit_vote(vote: VoteCreate):
    cast_vote(vote.character_a_id, vote.character_b_id, vote.accurate)
    return {"status": "recorded"}


@router.get("/vote/{character_a_id}/{character_b_id}")
def read_votes(character_a_id: int, character_b_id: int):
    return get_votes(character_a_id, character_b_id)