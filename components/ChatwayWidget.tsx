"use client";

import { useEffect, useState } from "react";

const storageKey = "hopebridge-live-chat-code";

export function ChatwayWidget() {
  const [script, setScript] = useState("");

  useEffect(() => {
    const load = () => {
      const saved = window.localStorage.getItem(storageKey) ?? "";
      setScript(saved);

      if (!saved) return;

      const existing = document.getElementById("hopebridge-chatway-widget");
      if (existing) existing.remove();

      const wrapper = document.createElement("div");
      wrapper.id = "hopebridge-chatway-widget";
      wrapper.innerHTML = saved;
      document.body.appendChild(wrapper);
    };

    load();
    const handler = () => load();
    window.addEventListener("hopebridge-chat-updated", handler);
    return () => window.removeEventListener("hopebridge-chat-updated", handler);
  }, []);

  if (!script) return null;

  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />;
}
