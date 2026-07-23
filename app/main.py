from fastapi import FastAPI
from Backend.app.routes.fight import fight, router as fight_router

app = FastAPI()
app.include_router(fight_router)



