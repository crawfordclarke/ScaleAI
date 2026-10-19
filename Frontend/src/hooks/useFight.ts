import { useRef, useState } from "react";
import type { Character, Health, Hit, Side, Turn } from "../types";

// Pause after each hit so its clash animation finishes before the next turn shows,
// even when the stream delivers several turns at once.
const TURN_GAP_MS = 900;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useFight() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [maxHealth, setMaxHealth] = useState<Health | null>(null);
  const [currentHealth, setCurrentHealth] = useState<Health | null>(null);
  const [fighter1, setFighter1] = useState<Character>();
  const [fighter2, setFighter2] = useState<Character>();
  const [lastHit, setLastHit] = useState<Hit | null>(null);
  const [isFighting, setIsFighting] = useState(false);
  // Lets a new fight cancel one that is still streaming
  const abortRef = useRef<AbortController | null>(null);

  const startFight = async (f1: Character, f2: Character) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFighter1(f1);
    setFighter2(f2);
    setTurns([]);
    setMaxHealth(null);
    setCurrentHealth(null);
    setLastHit(null);
    setIsFighting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character1_id: f1.character_id,
          character2_id: f2.character_id,
        }),
        signal: controller.signal,
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop()!;

        for (const line of lines) {
          if (!line.trim()) continue;
          const turn: Turn = JSON.parse(line);

          if (turn.event === "fight_start") {
            const health = {
              fighter1: turn.fighter1_max_health ?? 0,
              fighter2: turn.fighter2_max_health ?? 0,
            };
            setMaxHealth(health);
            setCurrentHealth(health);
            continue;
          }

          setTurns((prev) => [...prev, turn]);

          const defender: Side | null =
            turn.defender === f1.name ? "fighter1"
            : turn.defender === f2.name ? "fighter2"
            : null;
          if (defender) {
            setCurrentHealth((prev) =>
              prev && { ...prev, [defender]: turn.defender_health ?? prev[defender] },
            );
            setLastHit({ defender });
            await wait(TURN_GAP_MS);
            if (controller.signal.aborted) return;
          }
        }
      }
    } catch (err) {
      if (!controller.signal.aborted) console.error("Fight stream failed", err);
    } finally {
      if (abortRef.current === controller) setIsFighting(false);
    }
  };

  return {
    turns,
    maxHealth,
    currentHealth,
    fighter1,
    fighter2,
    lastHit,
    isFighting,
    startFight,
  };
}
