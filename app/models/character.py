from pydantic import BaseModel
from typing import List

class Character(BaseModel):
    character_id: int
    franchise: str
    name: str
    description: str
    image_url: str
    strength: int
    speed: int
    intelligence: int
    durability: int
    hax: List[str]
    health: int  = 100
    max_health: int = 100
    
    
    
    