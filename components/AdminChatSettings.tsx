"use client";

import { Check, MessageSquareText, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const storageKey = "hopebridge-live-chat-code";

export function AdminChatSettings() {
  const [code, setCode] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) setCode(stored);
  }, []);

  const save = () => {
    const trimmed = code.trim();
    window.localStorage.setItem(storageKey, trimmed);
    window.dispatchEvent(new CustomEvent("hopebridge-chat-updated", { detail: { code: trimmed } }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const clear = () => {
    setCode("");
    window.localStorage.removeItem(storageKey);
    window.dispatchEvent(new CustomEvent("hopebridge-chat-updated", { detail: { code: "" } }));
  };

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-inner shadow-white/5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-amber-300">
        <MessageSquareText size={15} /> Live chat
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
        Paste the full Chatway script snippet from your dashboard. This code is injected on the public website, and it can be changed any time from this admin panel.
      </p>

      <textarea
        value={code}
        onChange={(event) => setCode(event.target.value)}
        rows={8}
        placeholder={`<script>\n  (function(d, t) {\n    var g = d.createElement(t), s = d.getElementsByTagName(t)[0];\n    g.src = "https://app.chatway.app/widget.js?id=YOUR_CHATWAY_ID";\n    s.parentNode.insertBefore(g, s);\n  }(document, "script"));\n</script>`}
        className="mt-5 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button onClick={save} className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-emerald-950">
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? "Saved" : "Save chat widget"}
        </button>

        <button onClick={clear} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white/70">
          <Sparkles size={16} /> Clear widget
        </button>
      </div>
    </section>
  );
}
