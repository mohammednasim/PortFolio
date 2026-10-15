import React, { useEffect, useRef, useState } from "react";

/**
 * Hero character visual.
 *
 * Currently renders the supplied portrait (/assets/nasim.jpg) with a radial
 * mask so it never appears inside a square frame, plus gentle floating,
 * pointer-based parallax, and an ambient glow.
 *
 * To swap in a true rigged 3D character:
 *   1. Place a .glb/.gltf model at public/assets/character.glb
 *   2. Set USE_3D_MODEL = true below
 *   3. Replace the <img> block with a Drei <useGLTF> mesh inside a
 *      <Canvas> (see Scene.jsx for the pattern). Keep the parallax
 *      transform on the wrapping div.
 */
const USE_3D_MODEL = false;

export default function Character() {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const px = (e.clientX - cx) / rect.width;
      const py = (e.clientY - cy) / rect.height;
      setTilt({ x: px, y: py });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={ref}
      className="character-wrap"
      style={{
        transform: `perspective(1000px) rotateY(${tilt.x * 8}deg) rotateX(${-tilt.y * 6}deg)`,
      }}
    >
      <div className="character-glow" />
      <div className="character-ring" />
      {USE_3D_MODEL ? (
        <div className="character-model-slot">
          {/* <Canvas><Suspense fallback={null}><Model /></Suspense></Canvas> */}
        </div>
      ) : (
        <div className={`character-image ${loaded ? "is-loaded" : ""}`}>
          <img
            src="/assets/nasim.jpg"
            alt="Mohammed Nasim P"
            onLoad={() => setLoaded(true)}
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
