from fastapi import FastAPI
from app.routes.fight import fight, router as fight_router
from app.routes.characters import router as character_router
from app.routes.votes import router as vote
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(fight_router)
app.include_router(character_router)
app.include_router(vote)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://scale-ai-delta.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)