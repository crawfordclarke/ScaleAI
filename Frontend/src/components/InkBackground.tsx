import { useEffect } from "react";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import type { Character, Hit, Side } from "../types";

// Manga speed lines: thin wedges pointing at the centre, leaving the middle clear for the UI.
// Generated once at load so they stay put between renders.
const SPEED_LINES = Array.from({ length: 110 }, () => {
  const angle = Math.random() * Math.PI * 2;
  const spread = 0.004 + Math.random() * 0.012; // wedge thickness, in radians
  const inner = 38 + Math.random() * 30; // where the line stops short of the centre
  const outer = 160;
  const point = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  return `${point(inner, angle)} ${point(outer, angle - spread)} ${point(outer, angle + spread)}`;
});

// Each fighter gets half the screen, split on a slant to match the title
const HALVES: Record<Side, { clip: string; tint: string }> = {
  fighter1: { clip: "polygon(0 0, 56% 0, 44% 100%, 0 100%)", tint: "bg-scale-red" },
  fighter2: { clip: "polygon(56% 0, 100% 0, 100% 100%, 44% 100%)", tint: "bg-scale-blue" },
};

interface InkBackgroundProps {
  fighter1?: Character;
  fighter2?: Character;
  lastHit: Hit | null;
}

function InkBackground({ fighter1, fighter2, lastHit }: InkBackgroundProps) {
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();
  const fighters = { fighter1, fighter2 };
  const showFighters = Boolean(fighter1?.image_url && fighter2?.image_url);

  // On every hit the speed lines burst outward and the defender's side flashes
  useEffect(() => {
    if (!lastHit || reduceMotion) return;
    animate("[data-lines]", { scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }, { duration: 0.4, delay: 0.15 });
    if (showFighters) {
      animate(`[data-half=${lastHit.defender}] [data-flash]`, { opacity: [0, 0.6, 0] }, { duration: 0.35, delay: 0.15 });
    }
  }, [lastHit, reduceMotion, showFighters, animate]);

  return (
    <div ref={scope} aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-scale-paper">
      {/* The matchup fades in when a fight starts; keyed so a new pair replaces the old one */}
      <AnimatePresence>
        {showFighters && (
          <motion.div
            key={`${fighter1!.character_id}-${fighter2!.character_id}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            {(["fighter1", "fighter2"] as const).map((side) => (
              <div
                key={side}
                data-half={side}
                className="absolute inset-0 isolate"
                style={{ clipPath: HALVES[side].clip }}
              >
                <img
                  src={fighters[side]!.image_url}
                  alt=""
                  className={`absolute inset-y-0 h-full w-[56%] object-cover object-top grayscale contrast-150 brightness-75 ${side === "fighter1" ? "left-0" : "right-0"}`}
                />
                {/* Ink tint in the fighter's own colour */}
                <div className={`absolute inset-0 ${HALVES[side].tint} mix-blend-multiply`} />
                <div data-flash className="absolute inset-0 bg-white opacity-0" />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Darken so the UI stays readable on top */}
      <div className="absolute inset-0 bg-scale-paper/60" />

      {/* Two layers so the idle breathing (outer) and the hit burst (inner) don't overwrite each other */}
      <motion.div
        className="absolute inset-0"
        animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div data-lines className="absolute inset-0 opacity-50">
          <svg className="h-full w-full" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid slice">
            {SPEED_LINES.map((points, i) => (
              <polygon key={i} points={points} className="fill-scale-ink/30" />
            ))}
          </svg>
        </div>
      </motion.div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85))]" />
    </div>
  );
}

export default InkBackground;
