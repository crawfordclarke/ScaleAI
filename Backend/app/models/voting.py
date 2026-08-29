from pydantic import BaseModel



class VoteCreate(BaseModel):
    character_a_id: int
    character_b_id: int
    accurate: bool