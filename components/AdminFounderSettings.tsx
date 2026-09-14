"use client";

import { Check, Image, Save, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

export type FounderProfile = { name: string; role: string; image: string };

export const defaultFounders: FounderProfile[] = [
  { name: "Mosab Hassan Yusuf", role: "Founding vision", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85" },
  { name: "Lucy Robson", role: "Founding partner", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=85" },
  { name: "Our global circle", role: "Community, charity & cultural leaders", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=85" }
];

const storageKey = "hopebridge-founder-profiles";

export function AdminFounderSettings() {
  const [founders, setFounders] = useState<FounderProfile[]>(defaultFounders);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setFounders(JSON.parse(stored));
  }, []);

  const update = (index: number, field: keyof FounderProfile, value: string) => setFounders((current) => current.map((founder, founderIndex) => founderIndex === index ? { ...founder, [field]: value } : founder));
  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify(founders));
    window.dispatchEvent(new CustomEvent("hopebridge-founders-updated", { detail: founders }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-inner shadow-white/5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-amber-300">
        <UserRound size={15} /> Founder profiles
      </div>
      <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
        Replace the placeholder profiles with approved funder names, roles, and hosted portrait URLs. Confirm identity and image rights before publishing.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {founders.map((founder, index) => (
          <div key={index} className="rounded-2xl bg-white/10 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/10">
                {founder.image ? <img src={founder.image} alt="" className="h-full w-full object-cover" /> : <Image size={18} className="text-white/50" />}
              </div>
              <span className="text-xs font-bold text-white/60">Profile {index + 1}</span>
            </div>
            <input value={founder.name} onChange={(event) => update(index, "name", event.target.value)} aria-label={`Founder ${index + 1} name`} className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40" placeholder="Full name" />
            <input value={founder.role} onChange={(event) => update(index, "role", event.target.value)} aria-label={`Founder ${index + 1} role`} className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40" placeholder="Role" />
            <input value={founder.image} onChange={(event) => update(index, "image", event.target.value)} aria-label={`Founder ${index + 1} image URL`} className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40" placeholder="Approved image URL" />
          </div>
        ))}
      </div>

      <button onClick={save} className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-emerald-950">
        {saved ? <Check size={16} /> : <Save size={16} />}
        {saved ? "Saved" : "Save founder profiles"}
      </button>
    </section>
  );
}
