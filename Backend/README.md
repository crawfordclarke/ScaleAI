# ScaleAI

An anime/manga fight simulator that **stages fan arguments instead of settling them**. Pick two characters from any series, and a deterministic fight engine runs the mechanics while Gemini narrates each turn — grounded in real character lore pulled via a RAG pipeline from scraped wiki data. Stats are hand-tuned into a 70–95 band on purpose, so fights stay close and debatable rather than "obviously" correct.

**Live app:** https://scale-ai-delta.vercel.app
**API:** https://scaleai.up.railway.app

---

## How it works

1. Pick two fighters from the dropdowns and hit **Fight!**
2. The backend streams the fight turn-by-turn over NDJSON
3. Each turn, a deterministic engine (`fight_engine.py`) rolls hit chance, damage, and health based on character stats
4. Gemini narrates the turn's *mechanical* outcome using each character's real lore (retrieved via pgvector similarity search), so the story stays flavorful without inventing abilities a character doesn't have
5. The frontend renders narration, damage numbers, live health bars, and fighter portraits as turns stream in

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS v4 (Vite) |
| Backend | FastAPI (Python 3.14), `uv` for dependency management |
| AI narration | Gemini API (`google-genai`) |
| Vector DB / RAG | pgvector (PostgreSQL extension) |
| Database | PostgreSQL |
| Scraping | BeautifulSoup, `nltk` for chunking |
| Hosting | Railway (backend + Postgres) · Vercel (frontend) |

---

## Project structure

Monorepo with `Backend/` and `Frontend/` as siblings at the repo root.

```
ScaleAI/
├── Backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── db/
│   │   │   ├── schema.sql
│   │   │   └── seed_characters.sql
│   │   ├── engine/
│   │   │   └── fight_engine.py        # deterministic turn mechanics
│   │   ├── models/
│   │   │   └── character.py
│   │   ├── routes/
│   │   │   ├── characters.py
│   │   │   └── fight.py
│   │   ├── services/
│   │   │   ├── chunker.py             # lore chunking for RAG
│   │   │   ├── database.py
│   │   │   ├── embeddings.py          # RAG retrieval
│   │   │   ├── narrator.py            # Gemini narration
│   │   │   └── scraper.py             # wiki scraping
│   │   └── scripts/                   # ingestion / test scripts
│   ├── pyproject.toml
│   └── uv.lock
└── Frontend/
    ├── src/
    │   └── App.tsx
    ├── public/
    ├── package.json
    └── vite.config.ts
```

---

## Running locally

**Backend**
```bash
cd Backend
uv run python -m uvicorn app.main:app --reload
```
Requires a `.env` with `GEMINI_API_KEY`, `DATABASE_URL`, and `VECTOR_DATABASE_URL` pointing at a local Postgres instance with the `vector` extension enabled.

**Frontend**
```bash
cd Frontend
npm install
npm run dev
```
Requires a `.env.local` with `VITE_API_URL=http://localhost:8000`.

---

## Roadmap / TODO

### New features
- [ ] **Community voting layer** — the core original pitch: let users vote/argue on whether a fight's outcome was lore-accurate
- [ ] **`hax` stat + choice system** — let users pick from a character's actual hax/abilities before a fight, rather than the engine picking automatically
- [ ] **Bloodlust character option** — a toggle/variant for a more ruthless/unrestrained version of a character's stats or narration tone
- [ ] **Past fight viewing** — save completed fights and let users revisit/replay the log afterward
- [ ] **Verse vs. Verse / Group vs. Group** — team battles instead of strict 1v1
- [ ] **Alternate visual themes** — beyond the current dark VS-screen theme

### In progress / near-term
- [ ] Narrate misses too, not just landed hits (currently misses get a generic fallback line)
- [ ] Ingest the remaining un-ingested characters (free-tier embedding quota limited this)

### Done since last pass
- [x] Tightened narration prompt (less "hype commentator," fewer exclamation points) — verified against real output

### Known bugs / cleanup
- [ ] "Pirate King" title hallucination recurring in Whitebeard narration
- [ ] `rag_text` foreign key drift between `schema.sql` and the live DB table
- [ ] No deliberate pacing between Gemini calls — retry handles 429s but fights stutter in bursts under load
- [ ] `AbortController` cancellation missing on the fetch/reader loop (closing a tab mid-fight leaves a hanging request)
- [ ] Mid-stream errors are invisible to the client once headers are sent

---

## Notes on data / attribution

Character images are hotlinked from Fandom wiki CDN (`static.wikia.nocookie.net`) for a small set of test characters. Fine for a personal/portfolio project; would need reconsideration for anything commercial.