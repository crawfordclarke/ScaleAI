import type { Character } from "../types";

interface FighterSelectProps {
  characters: Character[];
  value: number | null;
  onChange: (characterId: number) => void;
}

function FighterSelect({ characters, value, onChange }: FighterSelectProps) {
  return (
    <select
      className="w-full sm:w-auto border-2 border-scale-ink rounded-lg px-4 py-2 font-body bg-scale-paper text-scale-ink"
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value="" disabled>
        — Select a fighter —
      </option>
      {characters.map((character) => (
        <option key={character.character_id} value={character.character_id}>
          {character.name}
        </option>
      ))}
    </select>
  );
}

export default FighterSelect;
