"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Utensils, Droplets, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

export function ImpactCalculator() {
  const [amount, setAmount] = useState(50);
  const spring = useSpring(amount, { stiffness: 120, damping: 18 });
  const display = useTransform(spring, (value) => Math.round(value));
  useEffect(() => spring.set(amount), [amount, spring]);
  const impact = amount < 50 ? { value: Math.max(4, Math.round(amount * .4)), label: "nutritious meals", icon: Utensils } : amount < 150 ? { value: Math.round(amount * .4), label: "nutritious meals for a family", icon: Utensils } : amount < 300 ? { value: Math.round(amount / 3), label: "days of clean water", icon: Droplets } : { value: Math.round(amount / 15), label: "school days supported", icon: BookOpen };
  const Icon = impact.icon;
  return <section id="impact" className="bg-amber-400 px-5 py-20 lg:px-10"><div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><div className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-emerald-900/60">The ripple effect</div><h2 className="max-w-md font-display text-4xl leading-tight tracking-[-.03em] text-emerald-950 sm:text-5xl">See what your generosity makes possible.</h2><p className="mt-5 max-w-md leading-7 text-emerald-950/70">No gift is too small to start a ripple. Move the slider and find the change your gift can create today.</p><a href="#donate" className="mt-7 inline-flex items-center gap-2 font-semibold text-emerald-950 underline decoration-emerald-950/30 underline-offset-4">Explore all impact areas <ArrowUpRight size={17} /></a></div><div className="rounded-[2rem] bg-emerald-950 p-7 text-white shadow-2xl sm:p-10"><div className="flex items-end justify-between gap-4"><div><div className="text-sm text-white/60">I can give</div><div className="mt-2 flex items-start font-display text-6xl tracking-[-.05em] text-amber-300"><span className="text-3xl">$</span><motion.span>{display}</motion.span></div></div><div className="grid size-16 place-items-center rounded-2xl bg-white/10 text-amber-300"><Icon size={30} strokeWidth={1.5} /></div></div><input aria-label="Donation amount" type="range" min="10" max="500" step="5" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-8 h-1.5 w-full cursor-pointer accent-amber-400" /><div className="mt-2 flex justify-between text-xs text-white/45"><span>$10</span><span>$500</span></div><div className="mt-8 border-t border-white/10 pt-7"><div className="text-sm text-white/55">Your gift provides</div><div className="mt-2 font-display text-2xl text-white"><span className="text-amber-300">{impact.value}</span> {impact.label}.</div></div></div></div></section>;
}
