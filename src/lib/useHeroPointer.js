import { useCallback, useEffect, useRef } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Smooth pointer tracking for the hero section.
 *
 * Writes three CSS custom properties on the container element every animation
 * frame (no React re-renders, fully GPU composited):
 *   --px    pointer x, normalised to -1 .. 1 around the container centre
 *   --py    pointer y, normalised to -1 .. 1
 *   --pull  0 when the pointer is elsewhere, 1 while it is over the character
 *
 * The stylesheet turns those into the "content slides to the opposite side"
 * motion, so the interaction stays declarative and cheap.
 */
export function useHeroPointer(containerRef) {
  const pullValue = useRef(0);

  const setPull = useCallback((value) => {
    pullValue.current = value;
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof window === "undefined") return undefined;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !finePointer) return undefined;

    const current = { px: 0, py: 0, pull: 0 };
    const target = { px: 0, py: 0, pull: 0 };
    let frame = 0;
    let running = false;

    const render = () => {
      current.px += (target.px - current.px) * 0.09;
      current.py += (target.py - current.py) * 0.09;
      current.pull += (target.pull - current.pull) * 0.12;

      element.style.setProperty("--px", current.px.toFixed(4));
      element.style.setProperty("--py", current.py.toFixed(4));
      element.style.setProperty("--pull", current.pull.toFixed(4));

      const settled =
        Math.abs(target.px - current.px) < 0.0015 &&
        Math.abs(target.py - current.py) < 0.0015 &&
        Math.abs(target.pull - current.pull) < 0.0015;

      if (settled) {
        running = false;
        return;
      }
      frame = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event) => {
      const rect = element.getBoundingClientRect();
      target.px = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      target.py = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
      target.pull = pullValue.current;
      start();
    };

    const onPointerLeave = () => {
      target.px = 0;
      target.py = 0;
      target.pull = 0;
      start();
    };

    // Keep the escape animation responsive even without pointer movement.
    const syncPull = () => {
      target.pull = pullValue.current;
      start();
    };
    const interval = window.setInterval(syncPull, 120);

    element.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      window.clearInterval(interval);
      window.cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [containerRef]);

  return { setPull };
}

export default useHeroPointer;
