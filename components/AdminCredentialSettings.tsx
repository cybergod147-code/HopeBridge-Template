"use client";

import { KeyRound, Save } from "lucide-react";
import { FormEvent, useState } from "react";

export function AdminCredentialSettings() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("Saving...");
    const response = await fetch("/api/admin/credentials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, currentPassword, password }) });
    const result = await response.json();
    setStatus(response.ok ? "Credentials updated. Sign in again next time with the new account." : result.error);
    if (response.ok) { setCurrentPassword(""); setPassword(""); }
  };
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-inner shadow-white/5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-amber-300">
        <KeyRound size={15} /> Change admin credentials
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-3 md:grid-cols-2">
        <input required value={username} onChange={(event) => setUsername(event.target.value)} aria-label="New admin username" placeholder="New username" className="rounded-xl bg-white/10 px-3 py-3 text-sm text-white outline-none placeholder:text-white/40" />
        <input required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} aria-label="Current admin password" type="password" placeholder="Current password" className="rounded-xl bg-white/10 px-3 py-3 text-sm text-white outline-none placeholder:text-white/40" />
        <input required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} aria-label="New admin password" type="password" placeholder="New password (12+ chars)" className="md:col-span-2 rounded-xl bg-white/10 px-3 py-3 text-sm text-white outline-none placeholder:text-white/40" />

        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-emerald-950 md:col-span-2 md:justify-self-start">
          <Save size={16} /> Update credentials
        </button>
      </form>

      {status && <p className="mt-3 text-xs text-white/70">{status}</p>}
    </section>
  );
}
