import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Character, Side } from "../types";

// Past this many characters a search box appears above the grid
const SEARCH_THRESHOLD = 12;

const SLOT_STYLES: Record<Side, { label: string; border: string; text: string; bg: string }> = {
  fighter1: { label: "P1", border: "border-scale-red", text: "text-scale-red", bg: "bg-scale-red" },
  fighter2: { label: "P2", border: "border-scale-blue", text: "text-scale-blue", bg: "bg-scale-blue" },
};

interface CharacterSelectProps {
  characters: Character[];
  selected: Record<Side, number | null>;
  onSelect: (side: Side, characterId: number) => void;
  open: boolean;
  onOpen: () => void;
}

// Fighting-game style select screen: two player slots above a grid of portraits.
// Picking a portrait fills the active slot; P1 picks first, then it hands over to P2.
function CharacterSelect({ characters, selected, onSelect, open, onOpen }: CharacterSelectProps) {
  const [activeSide, setActiveSide] = useState<Side>("fighter1");
  const [search, setSearch] = useState("");

  const byId = (id: number | null) => characters.find((c) => c.character_id === id);
  const query = search.trim().toLowerCase();
  const visible = query
    ? characters.filter((c) => `${c.name} ${c.franchise}`.toLowerCase().includes(query))
    : characters;

  const pick = (characterId: number) => {
    onSelect(activeSide, characterId);
    if (activeSide === "fighter1" && selected.fighter2 === null) setActiveSide("fighter2");
  };

  const openSlot = (side: Side) => {
    setActiveSide(side);
    onOpen();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        <Slot side="fighter1" character={byId(selected.fighter1)} active={open && activeSide === "fighter1"} onClick={() => openSlot("fighter1")} />
        <span className="font-display text-3xl -rotate-6">VS</span>
        <Slot side="fighter2" character={byId(selected.fighter2)} active={open && activeSide === "fighter2"} onClick={() => openSlot("fighter2")} />
      </div>

      {/* The grid tucks away once a fight starts; tapping a slot brings it back */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-2 rounded-2xl border-2 border-scale-ink/30 bg-scale-paper/85 p-3">
              <p className="font-body text-sm text-scale-grey">
                Choose{" "}
                <span className={`font-bold ${SLOT_STYLES[activeSide].text}`}>{SLOT_STYLES[activeSide].label}</span>
              </p>
              {characters.length > SEARCH_THRESHOLD && (
                <input
                  type="search"
                  placeholder="Search fighters or series…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border-2 border-scale-ink/40 bg-scale-paper px-3 py-1.5 font-body text-sm text-scale-ink"
                />
              )}
              <div className="grid max-h-72 grid-cols-4 gap-2 overflow-y-auto p-1 sm:grid-cols-6">
                {visible.map((character) => (
                  <Tile
                    key={character.character_id}
                    character={character}
                    pickedBy={(["fighter1", "fighter2"] as const).filter((side) => selected[side] === character.character_id)}
                    onClick={() => pick(character.character_id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SlotProps {
  side: Side;
  character?: Character;
  active: boolean;
  onClick: () => void;
}

// A player's current pick, shown large. Clicking it makes that player the one choosing.
function Slot({ side, character, active, onClick }: SlotProps) {
  const style = SLOT_STYLES[side];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${style.label}: ${character?.name ?? "no fighter chosen"}. Change fighter`}
      className="flex w-32 flex-col items-center gap-1 sm:w-40"
    >
      <div
        className={`relative h-20 w-20 overflow-hidden rounded-xl border-4 bg-scale-paper sm:h-24 sm:w-24 ${style.border} ${active ? "animate-pulse" : ""}`}
      >
        {character?.image_url ? (
          <img src={character.image_url} alt="" className="h-full w-full object-cover object-top" />
        ) : (
          <span className={`flex h-full items-center justify-center font-title text-2xl ${style.text}`}>?</span>
        )}
        <span className={`absolute left-0 top-0 rounded-br-md px-1.5 font-title text-xs text-white ${style.bg}`}>
          {style.label}
        </span>
      </div>
      <span className="w-full truncate font-body text-sm">{character?.name ?? "—"}</span>
    </button>
  );
}

interface TileProps {
  character: Character;
  pickedBy: Side[];
  onClick: () => void;
}

function Tile({ character, pickedBy, onClick }: TileProps) {
  // Mirror matches are allowed, so a tile can carry both players' markers
  const border =
    pickedBy.length === 2 ? "border-scale-amber"
    : pickedBy.length === 1 ? SLOT_STYLES[pickedBy[0]].border
    : "border-transparent hover:border-scale-ink/60";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative aspect-square overflow-hidden rounded-lg border-[3px] bg-gray-800 ${border}`}
      title={`${character.name} (${character.franchise})`}
    >
      {character.image_url && (
        <img src={character.image_url} alt="" className="h-full w-full object-cover object-top" />
      )}
      <span className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-1 font-body text-[10px] sm:text-xs">
        {character.name}
      </span>
      <span className="absolute right-0.5 top-0.5 flex gap-0.5">
        {pickedBy.map((side) => (
          <span key={side} className={`rounded px-1 font-title text-[10px] text-white ${SLOT_STYLES[side].bg}`}>
            {SLOT_STYLES[side].label}
          </span>
        ))}
      </span>
    </motion.button>
  );
}

export default CharacterSelect;
