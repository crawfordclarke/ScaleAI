import type { RefObject } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";

interface ScrollToVoteProps {
  target: RefObject<HTMLElement | null>;
  show: boolean;
}

// Floating fist that appears once the fight is over and scrolls down to the vote section.
// It hides itself once the vote section is on screen.
function ScrollToVote({ target, show }: ScrollToVoteProps) {
  const targetInView = useInView(target, { amount: 0.6 });
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {show && !targetInView && (
        <motion.button
          type="button"
          aria-label="Scroll to vote"
          onClick={() => target.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
          className="fixed bottom-6 left-1/2 z-20 -ml-7 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-scale-red text-2xl shadow-lg"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, y: reduceMotion ? 0 : [0, 8, 0] }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } }}
          whileTap={{ scale: 0.85 }}
        >
          👊
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default ScrollToVote;
