"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Smooth, weighted scrolling (Lenis) plus a global motion config that honours
 * the visitor's reduced-motion setting. Lenis is skipped entirely for those visitors.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {reduced ? null : (
        <ReactLenis
          root
          options={{ lerp: 0.1, anchors: { offset: -96 }, autoRaf: true }}
        />
      )}
      {children}
    </MotionConfig>
  );
}
