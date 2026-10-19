import { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import VoteWidget from "./components/VoteWidget.tsx";
import FighterSelect from "./components/FighterSelect.tsx";
import HealthBars from "./components/HealthBars.tsx";
import FightLog from "./components/FightLog.tsx";
import InkBackground from "./components/InkBackground.tsx";
import Title from "./components/Title.tsx";
import { useFight } from "./hooks/useFight.ts";
import type { Character } from "./types.ts";

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [fighter1Id, setFighter1Id] = useState<number | null>(null);
  const [fighter2Id, setFighter2Id] = useState<number | null>(null);
  const { turns, maxHealth, currentHealth, fighter1, fighter2, lastHit, isFighting, startFight } =
    useFight();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/characters`)
      .then((response) => response.json())
      .then((data) => setCharacters(data));
  }, []);

  const handleFight = () => {
    const found1 = characters.find((c) => c.character_id === fighter1Id);
    const found2 = characters.find((c) => c.character_id === fighter2Id);
    if (found1 && found2) startFight(found1, found2);
  };

  const fightOver = turns.some((t) => t.event === "fight_over");

  return (
    <div className="min-h-screen px-4">
      <InkBackground fighter1={fighter1} fighter2={fighter2} lastHit={lastHit} />
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
        <Title lastHit={lastHit} />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <FighterSelect characters={characters} value={fighter1Id} onChange={setFighter1Id} />
          <span className="font-display text-3xl -rotate-6">VS</span>
          <FighterSelect characters={characters} value={fighter2Id} onChange={setFighter2Id} />
        </div>
        <div>
          <button
            className="border-2 border-scale-ink rounded-lg px-4 py-2 font-body bg-scale-paper text-scale-ink hover:bg-gray-200 hover:text-scale-paper transition-colors disabled:opacity-50 disabled:pointer-events-none"
            disabled={fighter1Id == null || fighter2Id == null || isFighting}
            onClick={handleFight}
          >
            {isFighting ? "Fighting…" : "Fight!"}
          </button>
        </div>
        {currentHealth && maxHealth && (
          <HealthBars
            fighter1={fighter1}
            fighter2={fighter2}
            currentHealth={currentHealth}
            maxHealth={maxHealth}
            lastHit={lastHit}
          />
        )}
        <FightLog turns={turns} />
        {/* Vote on the fighters that actually fought, even if the dropdowns changed since */}
        {fightOver && fighter1 && fighter2 && (
          <VoteWidget characterAId={fighter1.character_id} characterBId={fighter2.character_id} />
        )}
      </div>
    </div>
  );
}

export default App;
