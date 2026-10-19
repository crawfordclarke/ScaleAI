import { useEffect, useRef } from "react";
import type { Turn } from "../types";

interface FightLogProps {
  turns: Turn[];
}

function FightLog({ turns }: FightLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  // Keep the newest turn in view
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [turns]);

  return (
    <div ref={logRef} className="max-h-[400px] overflow-y-auto flex flex-col gap-2">
      {turns.map((turn, i) => (
        <div
          key={i}
          className="border-2 border-scale-ink rounded-2xl px-4 py-3 flex items-center justify-between gap-2 font-body bg-scale-paper/85 animate-slide-in"
        >
          {turn.event === "fight_over" ? (
            <span className="w-full text-center">
              Winner: {turn.winner ?? "Draw"}
            </span>
          ) : (
            <>
              <span className="min-w-0 break-words">
                {turn.narration ?? `${turn.attacker} hits ${turn.defender}`}
              </span>
              <span className="shrink-0 font-display text-2xl text-scale-amber">
                -{turn.damage_dealt}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default FightLog;
