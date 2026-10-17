import React, { useState } from "react";
import { portfolio } from "../data/portfolio";

/**
 * Hero character visual.
 *
 * Renders the transparent 2D character portrait (public/assets/nasim-character.png)
 * with an ambient glow, an orbiting ring system and a soft contact shadow.
 *
 * All pointer motion is driven by CSS custom properties written by
 * useHeroPointer() on the hero container, so this component stays purely
 * presentational:
 *   - the wrapper translates / rotates away from the cursor
 *   - the image itself keeps a slow idle float
 *
 * onFocusCharacter / onBlurCharacter let the hero know the pointer is on the
 * character so the whole layout can shift to the opposite side.
 */
export default function Character({ onFocusCharacter, onBlurCharacter }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="character-wrap"
      onPointerEnter={onFocusCharacter}
      onPointerLeave={onBlurCharacter}
      onFocus={onFocusCharacter}
      onBlur={onBlurCharacter}
      tabIndex={0}
      role="img"
      aria-label={`${portfolio.name} — illustrated portrait`}
    >
      <div className="character-glow" aria-hidden="true" />
      <div className="character-party" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="character-ring" aria-hidden="true" />
      <div className="character-ring ring-inner" aria-hidden="true" />

      <img
        className={`character-image ${loaded ? "is-loaded" : ""}`}
        src={portfolio.avatar}
        alt={portfolio.name}
        onLoad={() => setLoaded(true)}
        draggable={false}
      />

      <div className="character-floor" aria-hidden="true" />
      <div className="character-tag" aria-hidden="true">
        <b>Data Science · AI</b>
        <span>Trainer &amp; Developer</span>
      </div>
    </div>
  );
}
