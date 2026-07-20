from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from Backend.app.engine.fight_engine import simulate_fight

app = FastAPI()

@app.post("/fight")
def fight(...):
    return StreamingResponse(simulate_fight(c1, c2), media_type="application/x-ndjson")