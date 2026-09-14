"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("hopebridge-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }, []);
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("hopebridge-theme", next ? "dark" : "light");
    setDark(next);
  };
  return <button onClick={toggle} aria-label="Toggle dark mode" className="grid size-10 place-items-center rounded-full border border-emerald-900/10 bg-white/70 text-emerald-900 transition hover:border-amber-500 hover:text-amber-600 dark:bg-emerald-950/60 dark:text-emerald-100">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>;
}
