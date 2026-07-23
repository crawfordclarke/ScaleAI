from fastapi import FastAPI
from Backend.app.routes.fight import fight, router as fight_router
from Backend.app.routes.characters import router as character_router

app = FastAPI()
app.include_router(fight_router)
app.include_router(character_router)



