"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, HeartHandshake, Play, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { DonationModal } from "./DonationModal";
import { ThemeToggle } from "./ThemeToggle";

export function Hero() {
  const [open, setOpen] = useState(false);
  return <>
    <section className="relative min-h-[720px] overflow-hidden bg-emerald-950 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,36,28,.94)_0%,rgba(5,36,28,.72)_42%,rgba(5,36,28,.12)_100%)]" />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-10">
        <a href="#top" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-amber-400 text-emerald-950"><HeartHandshake size={22} /></span><span className="font-display text-xl tracking-tight">HopeBridge<span className="text-amber-400">.</span></span></a>
        <div className="hidden items-center gap-8 text-sm text-white/75 md:flex"><a href="#work" className="hover:text-white">Our work</a><a href="#impact" className="hover:text-white">Your impact</a><a href="#stories" className="hover:text-white">Stories</a><a href="#transparency" className="hover:text-white">Transparency</a></div>
        <div className="flex items-center gap-3"><ThemeToggle /><button onClick={() => setOpen(true)} className="hidden rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-amber-300 sm:block">Donate now</button></div>
      </nav>
      <div className="relative z-10 mx-auto flex max-w-7xl items-end px-5 pb-28 pt-24 lg:px-10 lg:pt-28"><div className="max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.2em] text-amber-300 backdrop-blur"><span className="size-1.5 rounded-full bg-amber-400" /> Global action, local trust</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} className="text-balance font-display text-5xl leading-[.98] tracking-[-.04em] sm:text-7xl">Transforming generosity into <span className="text-amber-300">global impact.</span></motion.h1>
        <p className="mt-7 max-w-lg text-base leading-7 text-white/75 sm:text-lg">Across the United States, Israel, Europe, and Africa, we connect your generosity with people, communities, charitable homes, and nonprofit initiatives that need support.</p>
        <div className="mt-9 flex flex-wrap items-center gap-4"><button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 font-bold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-amber-300">Make an impact <ArrowUpRight size={18} /></button><a href="#work" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">See our work <ArrowDownRight size={18} /></a></div>
      </div></div>
      <div className="absolute bottom-7 right-5 z-10 hidden w-72 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl lg:block"><div className="mb-4 flex items-center justify-between"><span className="text-xs uppercase tracking-[.18em] text-white/60">Live impact</span><span className="flex items-center gap-1.5 text-xs text-amber-300"><span className="size-1.5 animate-pulse rounded-full bg-amber-300" /> Updating</span></div><div className="grid grid-cols-2 gap-5"><div><div className="font-display text-3xl">48,291</div><div className="mt-1 text-xs text-white/60">lives reached</div></div><div><div className="font-display text-3xl">$2.4m</div><div className="mt-1 text-xs text-white/60">funds deployed</div></div></div><div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/70"><ShieldCheck size={15} className="text-amber-300" /> 94% reaches the field</div></div>
    </section>
    <DonationModal open={open} onClose={() => setOpen(false)} />
  </>;
}
