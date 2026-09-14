"use client";

import { ArrowUpRight, HeartHandshake, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { defaultFounders, FounderProfile } from "./AdminFounderSettings";

export function FoundersSection() {
  const [founders, setFounders] = useState<FounderProfile[]>(defaultFounders);
  useEffect(() => {
    const stored = localStorage.getItem("hopebridge-founder-profiles");
    if (stored) setFounders(JSON.parse(stored));
    const update = (event: Event) => setFounders((event as CustomEvent<FounderProfile[]>).detail);
    window.addEventListener("hopebridge-founders-updated", update);
    return () => window.removeEventListener("hopebridge-founders-updated", update);
  }, []);
  return <section id="founders" className="overflow-hidden bg-emerald-900 px-5 py-20 text-white lg:px-10"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-amber-300"><HeartHandshake size={16} /> The people behind the bridge</div><h2 className="max-w-xl font-display text-4xl leading-tight tracking-[-.03em] sm:text-5xl">A shared belief in the dignity of every person.</h2><p className="mt-6 max-w-lg leading-7 text-white/65">Across the United States, Israel, Europe, and Africa, HopeBridge supports communities in need and strengthens charitable homes and nonprofit initiatives through responsible giving. Our founding circle believes help should never depend on a person&apos;s religion, nationality, background, or circumstance.</p><div className="mt-8 flex items-start gap-3 border-l-2 border-amber-400 pl-5"><Quote size={22} className="shrink-0 text-amber-300" /><p className="font-display text-xl leading-7 text-white/90">“The goal is to make generosity a bridge, never a boundary.”</p></div><a href="#top" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-amber-300">Read our founding principles <ArrowUpRight size={16} /></a></div><div className="grid gap-4 sm:grid-cols-3">{founders.map((founder) => <article key={founder.name} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/10"><div className="aspect-[4/5] overflow-hidden"><img src={founder.image} alt={founder.name} className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" /></div><div className="p-4"><h3 className="font-display text-lg">{founder.name}</h3><p className="mt-1 text-xs text-amber-300">{founder.role}</p></div></article>)}</div></div></section>;
}
