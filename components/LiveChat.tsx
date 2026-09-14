"use client";

import { Bot, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useState } from "react";

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(["Hello. How can we help you make an informed impact today?"]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    setMessages((current) => [...current, message.trim(), "Thanks for reaching out. A HopeBridge support specialist will reply shortly."]);
    setMessage("");
  };
  return <div className="fixed bottom-5 right-5 z-40"><button onClick={() => setOpen((value) => !value)} aria-label="Open live chat" className="grid size-14 place-items-center rounded-full bg-amber-400 text-emerald-950 shadow-glow transition hover:-translate-y-1">{open ? <X size={22} /> : <MessageCircle size={23} />}</button>{open && <div className="absolute bottom-16 right-0 w-[min(92vw,360px)] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-emerald-900/10 dark:bg-emerald-950"><div className="flex items-center gap-3 bg-emerald-900 p-5 text-white"><span className="grid size-10 place-items-center rounded-full bg-amber-400 text-emerald-950"><Bot size={19} /></span><div><div className="font-bold">HopeBridge support</div><div className="mt-1 flex items-center gap-1.5 text-xs text-white/60"><span className="size-1.5 rounded-full bg-emerald-300" /> Usually replies in a few minutes</div></div></div><div className="h-64 space-y-3 overflow-y-auto bg-[#f7faf8] p-4 text-sm dark:bg-emerald-950/80">{messages.map((item, index) => <div key={`${item}-${index}`} className={`max-w-[85%] rounded-2xl px-3 py-2.5 leading-5 ${index % 2 === 0 ? "bg-white text-emerald-950 shadow-sm dark:bg-white/10 dark:text-white" : "ml-auto bg-emerald-800 text-white"}`}>{item}</div>)}</div><form onSubmit={submit} className="flex gap-2 border-t border-emerald-900/10 p-3 dark:border-white/10"><input value={message} onChange={(event) => setMessage(event.target.value)} aria-label="Chat message" placeholder="Write a message..." className="min-w-0 flex-1 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm outline-none dark:bg-white/10" /><button aria-label="Send message" className="grid size-10 place-items-center rounded-xl bg-amber-400 text-emerald-950"><Send size={16} /></button></form></div>}</div>;
}
