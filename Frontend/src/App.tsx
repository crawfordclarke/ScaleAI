import { useState, useEffect, useRef } from "react";
import "./App.css";
import "./index.css";
import VoteWidget from "./components/VoteWidget.tsx";
import CharacterSelect from "./components/CharacterSelect.tsx";
import FightButton from "./components/FightButton.tsx";
import HealthBars from "./components/HealthBars.tsx";
import FightLog from "./components/FightLog.tsx";
import InkBackground from "./components/InkBackground.tsx";
import ScrollToVote from "./components/ScrollToVote.tsx";
import Title from "./components/Title.tsx";
import { useFight } from "./hooks/useFight.ts";
import type { Character, Side } from "./types.ts";

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<Record<Side, number | null>>({ fighter1: null, fighter2: null });
  const [pickerOpen, setPickerOpen] = useState(true);
  const voteRef = useRef<HTMLDivElement>(null);
  const { turns, maxHealth, currentHealth, fighter1, fighter2, lastHit, isFighting, error, startFight } =
    useFight();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/characters`)
      .then((response) => response.json())
      .then((data) => setCharacters(data));
  }, []);

  const handleFight = () => {
    const found1 = characters.find((c) => c.character_id === selected.fighter1);
    const found2 = characters.find((c) => c.character_id === selected.fighter2);
    if (!found1 || !found2) return;
    setPickerOpen(false);
    startFight(found1, found2);
  };

  const fightOver = turns.some((t) => t.event === "fight_over");

  return (
    <div className="min-h-screen px-4 pb-24">
      <InkBackground fighter1={fighter1} fighter2={fighter2} lastHit={lastHit} isFighting={isFighting} />
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
        <Title lastHit={lastHit} />

        <CharacterSelect
          characters={characters}
          selected={selected}
          onSelect={(side, id) => setSelected((prev) => ({ ...prev, [side]: id }))}
          open={pickerOpen}
          onOpen={() => setPickerOpen(true)}
        />
        <FightButton
          ready={selected.fighter1 !== null && selected.fighter2 !== null}
          isFighting={isFighting}
          onClick={handleFight}
        />
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
        {error && (
          <div role="alert" className="flex flex-col items-center gap-2 rounded-2xl border-2 border-scale-red bg-scale-paper/90 px-4 py-3 font-body">
            <span>{error}</span>
            <button
              type="button"
              onClick={handleFight}
              className="rounded-lg border-2 border-scale-ink px-4 py-1 text-sm hover:bg-scale-ink hover:text-scale-paper transition-colors"
            >
              Try again
            </button>
          </div>
        )}
        {/* Vote on the fighters that actually fought, even if the picks changed since */}
        <div ref={voteRef}>
          {fightOver && fighter1 && fighter2 && (
            <VoteWidget characterAId={fighter1.character_id} characterBId={fighter2.character_id} />
          )}
        </div>
      </div>
      <ScrollToVote target={voteRef} show={fightOver} />
    </div>
  );
}

export default App;
