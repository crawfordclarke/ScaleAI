import { motion, useReducedMotion } from "motion/react";

interface FightButtonProps {
  ready: boolean;
  isFighting: boolean;
  onClick: () => void;
}

function FightButton({ ready, isFighting, onClick }: FightButtonProps) {
  const reduceMotion = useReducedMotion();

  // Flicker while the fight streams, pulse when both fighters are picked, otherwise sit dimmed.
  // Opacity lives here rather than in a class because Motion's inline styles would override it.
  const looping = !reduceMotion && (isFighting || ready);
  const animate =
    isFighting ? { opacity: reduceMotion ? 0.7 : [1, 0.4, 1], scale: 1 }
    : ready ? { opacity: 1, scale: reduceMotion ? 1 : [1, 1.08, 1] }
    : { opacity: 0.4, scale: 1 };

  return (
    <div className="flex justify-center">
      <motion.button
        type="button"
        disabled={!ready || isFighting}
        onClick={onClick}
        animate={animate}
        transition={looping ? { duration: isFighting ? 0.8 : 1.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        whileTap={{ scale: 0.85 }}
        // Shrinks to a small status line mid-fight so the narration gets the space
        className={`font-title text-scale-red disabled:cursor-not-allowed ${
          isFighting
            ? "px-2 text-sm sm:text-base tracking-[1px]"
            : "px-6 py-2 text-4xl sm:text-5xl tracking-[2px] [-webkit-text-stroke:1.5px_black]"
        }`}
      >
        {/* Skew on an inner span so it doesn't clash with Motion's scale on the button */}
        <span className="inline-block -skew-x-12">{isFighting ? "FIGHTING…" : "FIGHT!"}</span>
      </motion.button>
    </div>
  );
}

export default FightButton;
