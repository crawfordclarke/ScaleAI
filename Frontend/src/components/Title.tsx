import { useEffect } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import type { Hit } from "../types";

interface TitleProps {
  lastHit: Hit | null;
}

function Title({ lastHit }: TitleProps) {
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();

  // Jolt the title on every landed hit, timed with the health bar impact
  useEffect(() => {
    if (!lastHit || reduceMotion) return;
    animate(scope.current, { x: [0, -6, 6, -3, 0], scale: [1, 1.06, 1] }, { duration: 0.35, delay: 0.15 });
  }, [lastHit, reduceMotion, animate, scope]);

  // Three layers so each transform stays independent: float (outer), jolt (middle), skew (inner)
  return (
    <motion.div
      className="pt-4 pb-2"
      animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <div ref={scope}>
        <div className="-skew-x-20">
          <h1 className="font-title text-scale-red text-3xl sm:text-5xl tracking-[3px] [-webkit-text-stroke:1.5px_black]">
            ScaleAI
          </h1>
          {/* "ScaleAI" written in katakana */}
          <p lang="ja" aria-hidden className="mt-1 pl-[0.5em] font-title text-scale-ink/70 text-sm sm:text-base tracking-[0.5em]">
            スケールAI
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Title;
