"use client";

import { Check, Eye, EyeOff, Save, Settings, WalletCards, X } from "lucide-react";
import { useEffect, useState } from "react";
import { paymentConfig } from "@/config/payment";

type PaymentMethodKey = "bank" | "paypal" | "bitcoin";

type PaymentDetails = {
  bitcoinAddress: string;
  paypalEmail: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  swift: string;
};

type PaymentMethodsState = Record<PaymentMethodKey, boolean>;
type PaymentSettings = { details: PaymentDetails; methods: PaymentMethodsState };

const storageKey = "hopebridge-payment-settings";
const initialDetails: PaymentDetails = {
  bitcoinAddress: paymentConfig.bitcoinAddress,
  paypalEmail: paymentConfig.paypalEmail,
  bankName: paymentConfig.bankDetails.bankName,
  accountName: paymentConfig.bankDetails.accountName,
  accountNumber: paymentConfig.bankDetails.accountNumber,
  swift: paymentConfig.bankDetails.swift
};
const initialMethods: PaymentMethodsState = {
  bank: paymentConfig.methods.bank.enabled,
  paypal: paymentConfig.methods.paypal.enabled,
  bitcoin: paymentConfig.methods.bitcoin.enabled
};

export function AdminPaymentSettings() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState<PaymentDetails>(initialDetails);
  const [methods, setMethods] = useState<PaymentMethodsState>(initialMethods);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as PaymentSettings;
      setDetails({ ...initialDetails, ...parsed.details });
      setMethods({ ...initialMethods, ...parsed.methods });
      return;
    }

    const legacy = localStorage.getItem("hopebridge-payment-details");
    if (legacy) {
      const parsed = JSON.parse(legacy) as PaymentDetails;
      setDetails({ ...initialDetails, ...parsed });
    }
  }, []);

  const update = (field: keyof PaymentDetails, value: string) => setDetails((current) => ({ ...current, [field]: value }));
  const save = () => {
    const settings: PaymentSettings = { details, methods };
    localStorage.setItem(storageKey, JSON.stringify(settings));
    localStorage.setItem("hopebridge-payment-details", JSON.stringify(details));
    window.dispatchEvent(new CustomEvent("hopebridge-payment-updated", { detail: settings }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const fields: [keyof PaymentDetails, string, string][] = [
    ["bitcoinAddress", "Bitcoin wallet address", "bc1q..."],
    ["paypalEmail", "PayPal receiving email", "giving@example.org"],
    ["bankName", "Bank name", "Civic Trust Bank"],
    ["accountName", "Account name", "HopeBridge International"],
    ["accountNumber", "Account number", "0048 0192 7736"],
    ["swift", "SWIFT / BIC", "CTBKGHAC"]
  ];

  return <>
    <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white/75 transition hover:border-amber-300 hover:text-amber-300"><Settings size={14} /> Admin payment settings</button>
    {open && <div className="fixed inset-0 z-[60] grid place-items-center bg-emerald-950/75 p-4 backdrop-blur-sm"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 text-emerald-950 shadow-2xl dark:bg-emerald-950 dark:text-white sm:p-8"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-emerald-700 dark:text-amber-300"><WalletCards size={15} /> Admin console</div><h2 className="mt-3 font-display text-3xl">Payment destinations</h2><p className="mt-2 max-w-lg text-sm leading-6 text-ink-500 dark:text-white/55">Update where donor payments should be directed. These browser-only settings are a preview of the future secured admin API.</p></div><button onClick={() => setOpen(false)} aria-label="Close admin settings" className="grid size-9 place-items-center rounded-full bg-emerald-50 dark:bg-white/10"><X size={18} /></button></div><div className="mt-7 grid gap-4 sm:grid-cols-2">{fields.map(([field, label, placeholder]) => <label key={field} className="text-sm font-semibold">{label}<div className="mt-2 flex items-center rounded-xl border border-emerald-900/15 px-3 dark:border-white/15"><input type={field === "bitcoinAddress" && !visible ? "password" : "text"} value={details[field]} onChange={(event) => update(field, event.target.value)} placeholder={placeholder} className="w-full bg-transparent py-3 outline-none" />{field === "bitcoinAddress" && <button type="button" onClick={() => setVisible((value) => !value)} aria-label="Toggle wallet visibility">{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button>}</div></label>)}</div><div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-900/10 pt-6 dark:border-white/10"><span className="text-xs text-ink-500 dark:text-white/50">Changes apply to the donation modal on this device.</span><button onClick={save} className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 dark:bg-amber-400 dark:text-emerald-950">{saved ? <Check size={16} /> : <Save size={16} />} {saved ? "Saved" : "Save changes"}</button></div><div className="mt-8 rounded-2xl border border-emerald-900/10 bg-emerald-50 p-4 dark:border-white/10 dark:bg-white/5"><div className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-emerald-700 dark:text-amber-300">Payment methods</div><div className="flex flex-wrap gap-2">{(Object.keys(initialMethods) as PaymentMethodKey[]).map((methodKey) => <button key={methodKey} type="button" onClick={() => setMethods((current) => ({ ...current, [methodKey]: !current[methodKey] }))} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${methods[methodKey] ? "border-emerald-700 bg-emerald-700 text-white" : "border-emerald-900/15 bg-white text-emerald-950 dark:border-white/15 dark:bg-white/5 dark:text-white"}`}><span className={`size-2 rounded-full ${methods[methodKey] ? "bg-amber-300" : "bg-emerald-900/25 dark:bg-white/25"}`} /> {methodKey === "bank" ? "Bank transfer" : methodKey === "paypal" ? "PayPal" : "Bitcoin"} {methods[methodKey] ? "enabled" : "disabled"}</button>)}</div></div></div></div>}</>;
}
