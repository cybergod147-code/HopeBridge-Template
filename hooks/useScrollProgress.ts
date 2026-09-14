"use client";

import { useEffect, useState } from "react";

export function useScrollProgress(targetId: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const update = () => {
      const rect = target.getBoundingClientRect();
      const viewport = window.innerHeight;
      const value = ((viewport - rect.top) / (viewport + rect.height)) * 100;
      setProgress(Math.min(100, Math.max(0, value)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [targetId]);

  return progress;
}
