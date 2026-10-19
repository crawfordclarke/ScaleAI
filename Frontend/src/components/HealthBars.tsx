import { useEffect } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import type { Character, Health, Hit, Side } from "../types";

// Full class names so Tailwind can find them when it scans the source
const ACCENTS: Record<Side, { bar: string; border: string }> = {
  fighter1: { bar: "bg-scale-red", border: "border-scale-red" },
  fighter2: { bar: "bg-scale-blue", border: "border-scale-blue" },
};

interface HealthBarsProps {
  fighter1?: Character;
  fighter2?: Character;
  currentHealth: Health;
  maxHealth: Health;
  lastHit: Hit | null;
}

function HealthBars({ fighter1, fighter2, currentHealth, maxHealth, lastHit }: HealthBarsProps) {
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();

  // Clash on every hit: the attacker lunges toward the middle, then the defender recoils and flashes
  useEffect(() => {
    if (!lastHit || reduceMotion) return;
    const defender = lastHit.defender;
    const attacker: Side = defender === "fighter1" ? "fighter2" : "fighter1";
    // fighter1 sits on the left so it lunges right; fighter2 lunges left.
    // A percentage of the panel's own width keeps the lunge small on phones.
    const lunge = attacker === "fighter1" ? "12%" : "-12%";

    animate(`[data-side=${attacker}]`, { x: ["0%", lunge, "0%"] }, { duration: 0.35, ease: "easeOut" });
    animate(`[data-side=${defender}]`, { x: [0, -8, 8, -4, 0] }, { duration: 0.35, delay: 0.15 });
    animate(`[data-side=${defender}] [data-flash]`, { opacity: [0, 0.5, 0] }, { duration: 0.35, delay: 0.15 });
  }, [lastHit, reduceMotion, animate]);

  return (
    <div ref={scope} className="sticky top-0 z-10 bg-scale-paper/90 backdrop-blur-sm py-2 flex gap-4">
      <FighterHealth side="fighter1" fighter={fighter1} health={currentHealth.fighter1} max={maxHealth.fighter1} />
      <FighterHealth side="fighter2" fighter={fighter2} health={currentHealth.fighter2} max={maxHealth.fighter2} />
    </div>
  );
}

interface FighterHealthProps {
  side: Side;
  fighter?: Character;
  health: number;
  max: number;
}

function FighterHealth({ side, fighter, health, max }: FighterHealthProps) {
  const percent = max > 0 ? Math.max(0, (health / max) * 100) : 0;
  const accent = ACCENTS[side];

  return (
    <div data-side={side} className="relative flex-1 min-w-0">
      <div className="flex items-center gap-2 justify-center">
        {fighter?.image_url && (
          <img
            src={fighter.image_url}
            alt={fighter.name}
            className={`h-10 w-10 sm:h-12 sm:w-12 shrink-0 object-cover object-top rounded-full border-2 ${accent.border}`}
          />
        )}
        <span className="truncate">{fighter?.name}</span>
      </div>
      <div className="relative w-full h-[6px] bg-gray-700 rounded overflow-hidden">
        {/* Ghost bar drains after the real one, so you can see how much the last hit took */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-scale-amber"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        <motion.div
          className={`absolute inset-y-0 left-0 ${accent.bar}`}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <div data-flash className="pointer-events-none absolute inset-0 rounded-lg bg-white opacity-0" />
    </div>
  );
}

export default HealthBars;
