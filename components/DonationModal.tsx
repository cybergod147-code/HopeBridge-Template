"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bitcoin, Check, Clipboard, Landmark, LockKeyhole, Mail, ShieldCheck, UserRound, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";
import { paymentConfig } from "@/config/payment";

type PaymentMethodId = "bank" | "paypal" | "bitcoin";

type PaymentDetails = {
  bitcoinAddress: string;
  paypalEmail: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  swift: string;
};

type PaymentMethodsState = Record<PaymentMethodId, boolean>;
type PaymentSettings = { details: PaymentDetails; methods: PaymentMethodsState };

const steps = ["Gift", "Details", "Payment", "Done"];
const storageKey = "hopebridge-payment-settings";

const paymentMeta = {
  bank: { label: "Bank transfer", Icon: Landmark, description: "Direct transfer into our mission account." },
  paypal: { label: "PayPal", Icon: Mail, description: "Send with PayPal and share your generosity." },
  bitcoin: { label: "Bitcoin", Icon: Bitcoin, description: "Support with cryptocurrency from a secure wallet." }
} as const;

export function DonationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState("50");
  const [frequency, setFrequency] = useState("once");
  const [method, setMethod] = useState<PaymentMethodId>("bank");
  const [copied, setCopied] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    bitcoinAddress: paymentConfig.bitcoinAddress,
    paypalEmail: paymentConfig.paypalEmail,
    bankName: paymentConfig.bankDetails.bankName,
    accountName: paymentConfig.bankDetails.accountName,
    accountNumber: paymentConfig.bankDetails.accountNumber,
    swift: paymentConfig.bankDetails.swift
  });
  const [methods, setMethods] = useState<PaymentMethodsState>({
    bank: paymentConfig.methods.bank.enabled,
    paypal: paymentConfig.methods.paypal.enabled,
    bitcoin: paymentConfig.methods.bitcoin.enabled
  });

  useEffect(() => {
    const applySettings = (settings?: Partial<PaymentSettings>) => {
      if (!settings) return;

      const nextDetails = { ...paymentDetails, ...settings.details };
      const nextMethods = {
        bank: paymentConfig.methods.bank.enabled,
        paypal: paymentConfig.methods.paypal.enabled,
        bitcoin: paymentConfig.methods.bitcoin.enabled,
        ...settings.methods
      };

      setPaymentDetails(nextDetails);
      setMethods(nextMethods);

      const enabledMethods = (Object.keys(nextMethods) as PaymentMethodId[]).filter((key) => nextMethods[key]);
      if (enabledMethods.length > 0) {
        setMethod((current) => (enabledMethods.includes(current) ? current : enabledMethods[0]));
      }
    };

    try {
      const storedSettings = localStorage.getItem(storageKey);
      if (storedSettings) {
        applySettings(JSON.parse(storedSettings) as PaymentSettings);
      } else {
        const legacy = localStorage.getItem("hopebridge-payment-details");
        if (legacy) {
          applySettings({ details: JSON.parse(legacy) as PaymentDetails, methods: { bank: true, paypal: true, bitcoin: true } });
        }
      }
    } catch {
      // Ignore malformed local storage values and keep defaults.
    }

    const updatePaymentDetails = (event: Event) => {
      const customEvent = event as CustomEvent<PaymentSettings>;
      applySettings(customEvent.detail);
    };

    window.addEventListener("hopebridge-payment-updated", updatePaymentDetails);
    return () => window.removeEventListener("hopebridge-payment-updated", updatePaymentDetails);
  }, []);

  const availableMethods = useMemo(
    () => (Object.keys(methods) as PaymentMethodId[]).filter((key) => methods[key]),
    [methods]
  );

  useEffect(() => {
    if (availableMethods.length === 0) return;
    if (!availableMethods.includes(method)) setMethod(availableMethods[0]);
  }, [availableMethods, method]);

  const copy = (value: string, key: string) => {
    if (!value) return;
    navigator.clipboard?.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1600);
  };

  const showSummary = step === 3;
  const selectedMethodMeta = paymentMeta[method] ?? paymentMeta.bank;
  const selectedMethodLabel = selectedMethodMeta.label;

  const next = () => {
    if (step === 2) {
      setStep(3);
      return;
    }
    setStep((value) => Math.min(3, value + 1));
  };

  const back = () => setStep((value) => Math.max(0, value - 1));

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-emerald-950/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24 }} className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl dark:bg-emerald-950">
            <div className="sticky top-0 z-10 border-b border-emerald-900/10 bg-white/90 px-6 py-5 backdrop-blur dark:border-white/10 dark:bg-emerald-950/90">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-2xl">Make an impact</div>
                  <div className="mt-1 text-xs text-ink-500">Your generosity builds a bridge to possibility.</div>
                </div>
                <button onClick={onClose} aria-label="Close donation dialog" className="grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-900 hover:bg-amber-100 dark:bg-white/10 dark:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 flex items-center gap-2">
                {steps.map((label, index) => (
                  <div key={label} className="flex flex-1 items-center gap-2">
                    <span className={`grid size-6 place-items-center rounded-full text-xs font-bold ${index <= step ? "bg-amber-400 text-emerald-950" : "bg-emerald-100 text-emerald-700 dark:bg-white/10 dark:text-white/50"}`}>
                      {index < step ? <Check size={13} /> : index + 1}
                    </span>
                    <span className={`hidden text-xs font-semibold sm:block ${index <= step ? "text-emerald-900 dark:text-white" : "text-ink-500"}`}>{label}</span>
                    {index < 3 && <span className="h-px flex-1 bg-emerald-900/10 dark:bg-white/10" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {step === 0 && (
                <div>
                  <div className="flex rounded-xl bg-emerald-50 p-1 dark:bg-white/10">
                    {["once", "month"].map((value) => (
                      <button
                        key={value}
                        onClick={() => setFrequency(value)}
                        className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${frequency === value ? "bg-white text-emerald-900 shadow-sm dark:bg-emerald-900 dark:text-white" : "text-emerald-700 dark:text-white/70"}`}
                      >
                        {value === "once" ? "One-time" : "Monthly"}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 space-y-2">
                    {[25, 50, 100, 250, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setAmount(String(preset))}
                        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${amount === String(preset) ? "border-emerald-700 bg-emerald-50 text-emerald-950 dark:border-amber-300 dark:bg-white/5 dark:text-white" : "border-emerald-900/10 bg-white text-ink-600 dark:border-white/10 dark:bg-white/5 dark:text-white/80"}`}
                      >
                        <span className="font-semibold">${preset}</span>
                        <span className="text-xs text-ink-500 dark:text-white/55">Impact gift</span>
                      </button>
                    ))}
                  </div>

                  <label className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-900/10 bg-emerald-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <span className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-white">
                      <UserRound size={15} /> Custom amount
                    </span>
                    <input value={amount} onChange={(event) => setAmount(event.target.value)} className="w-28 rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-right text-sm font-bold text-emerald-950 outline-none dark:border-white/10 dark:bg-emerald-900" />
                  </label>

                  <div className="mt-6 flex items-center gap-2 rounded-2xl bg-amber-50 p-3 text-sm text-emerald-950 dark:bg-amber-400/10 dark:text-white/80">
                    <ShieldCheck size={16} className="text-emerald-700" />
                    Secure giving. No payment data is stored on our public website.
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-emerald-900 dark:text-white">
                      First name
                      <input className="mt-2 w-full rounded-xl border border-emerald-900/10 bg-emerald-50 px-3 py-3 outline-none dark:border-white/10 dark:bg-white/5" defaultValue="Kind donor" />
                    </label>
                    <label className="text-sm font-semibold text-emerald-900 dark:text-white">
                      Last name
                      <input className="mt-2 w-full rounded-xl border border-emerald-900/10 bg-emerald-50 px-3 py-3 outline-none dark:border-white/10 dark:bg-white/5" defaultValue="Supporter" />
                    </label>
                    <label className="sm:col-span-2 text-sm font-semibold text-emerald-900 dark:text-white">
                      Email address
                      <input className="mt-2 w-full rounded-xl border border-emerald-900/10 bg-emerald-50 px-3 py-3 outline-none dark:border-white/10 dark:bg-white/5" defaultValue="you@example.org" />
                    </label>
                  </div>

                  <label className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-emerald-50 px-3 py-3 text-sm text-emerald-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
                    <input type="checkbox" className="size-4 accent-emerald-700" defaultChecked />
                    Dedicate this donation to someone special
                  </label>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl bg-emerald-50 p-3 dark:bg-white/5">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700 dark:text-amber-300">Amount</div>
                      <div className="mt-1 text-2xl font-black text-emerald-950 dark:text-white">${Number(amount || 0).toLocaleString()}</div>
                    </div>
                    <div className="rounded-full border border-emerald-900/10 px-3 py-1 text-xs font-semibold uppercase tracking-[.18em] text-emerald-700 dark:border-white/10 dark:text-amber-300">
                      {frequency === "once" ? "One-time" : "Monthly"}
                    </div>
                  </div>

                  {availableMethods.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-emerald-900/20 bg-emerald-50 p-6 text-center dark:border-white/15 dark:bg-white/5">
                      <div className="text-lg font-black text-emerald-950 dark:text-white">Donation methods are being configured</div>
                      <p className="mt-2 text-sm text-ink-500 dark:text-white/60">Please check back soon or contact the team directly for giving support.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(Object.keys(paymentMeta) as PaymentMethodId[]).filter((key) => methods[key]).map((key) => {
                        const item = paymentMeta[key];
                        const Icon = item.Icon;
                        const active = method === key;

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setMethod(key)}
                            className={`rounded-2xl border p-4 text-left transition ${active ? "border-emerald-700 bg-emerald-50 dark:border-amber-300 dark:bg-white/5" : "border-emerald-900/10 bg-white dark:border-white/10 dark:bg-white/5"}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-900 dark:bg-white/10 dark:text-white">
                                <Icon size={18} />
                              </span>
                              {active && <Check size={16} className="text-emerald-700 dark:text-amber-300" />}
                            </div>
                            <div className="mt-4 font-display text-xl text-emerald-950 dark:text-white">{item.label}</div>
                            <div className="mt-1 text-xs leading-5 text-ink-500 dark:text-white/60">{item.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {method === "bank" && methods.bank && (
                    <div className="mt-6 space-y-4 rounded-2xl bg-emerald-50 p-5 dark:bg-white/5">
                      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.18em] text-emerald-700 dark:text-amber-300"><Landmark size={16} />Bank transfer</div>
                      <div className="grid gap-3">
                        <div className="rounded-xl bg-white/80 p-3 text-sm dark:bg-emerald-900/40">
                          <div className="text-xs uppercase tracking-[.12em] text-ink-500 dark:text-white/50">Bank</div>
                          <div className="mt-2 font-semibold text-emerald-950 dark:text-white">{paymentDetails.bankName}</div>
                        </div>
                        <div className="rounded-xl bg-white/80 p-3 text-sm dark:bg-emerald-900/40">
                          <div className="text-xs uppercase tracking-[.12em] text-ink-500 dark:text-white/50">Account name</div>
                          <div className="mt-2 font-semibold text-emerald-950 dark:text-white">{paymentDetails.accountName}</div>
                        </div>
                        <div className="rounded-xl bg-white/80 p-3 text-sm dark:bg-emerald-900/40">
                          <div className="text-xs uppercase tracking-[.12em] text-ink-500 dark:text-white/50">Account number</div>
                          <div className="mt-2 flex items-center justify-between gap-4 font-semibold text-emerald-950 dark:text-white">
                            <span>{paymentDetails.accountNumber || "Not configured"}</span>
                            {paymentDetails.accountNumber && <button onClick={() => copy(paymentDetails.accountNumber, "bank-account")} className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-900 dark:bg-white/10 dark:text-white">{copied === "bank-account" ? <Check size={12} /> : <Clipboard size={12} />} {copied === "bank-account" ? "Copied" : "Copy"}</button>}
                          </div>
                        </div>
                        <div className="rounded-xl bg-white/80 p-3 text-sm dark:bg-emerald-900/40">
                          <div className="text-xs uppercase tracking-[.12em] text-ink-500 dark:text-white/50">SWIFT / BIC</div>
                          <div className="mt-2 flex items-center justify-between gap-4 font-semibold text-emerald-950 dark:text-white">
                            <span>{paymentDetails.swift || "Not configured"}</span>
                            {paymentDetails.swift && <button onClick={() => copy(paymentDetails.swift, "bank-swift")} className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-900 dark:bg-white/10 dark:text-white">{copied === "bank-swift" ? <Check size={12} /> : <Clipboard size={12} />} {copied === "bank-swift" ? "Copied" : "Copy"}</button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {method === "paypal" && methods.paypal && (
                    <div className="mt-6 rounded-2xl bg-emerald-50 p-5 dark:bg-white/5">
                      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.18em] text-emerald-700 dark:text-amber-300"><Mail size={16} /> PayPal</div>
                      <div className="mt-4 rounded-xl bg-white/80 p-4 text-sm dark:bg-emerald-900/40">
                        <div className="text-xs uppercase tracking-[.12em] text-ink-500 dark:text-white/50">Receiving email</div>
                        <div className="mt-2 flex items-center justify-between gap-4 font-semibold text-emerald-950 dark:text-white">
                          <span>{paymentDetails.paypalEmail || "Not configured"}</span>
                          {paymentDetails.paypalEmail && <button onClick={() => copy(paymentDetails.paypalEmail, "paypal-email")} className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-900 dark:bg-white/10 dark:text-white">{copied === "paypal-email" ? <Check size={12} /> : <Clipboard size={12} />} {copied === "paypal-email" ? "Copied" : "Copy"}</button>}
                        </div>
                      </div>
                    </div>
                  )}

                  {method === "bitcoin" && methods.bitcoin && (
                    <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl bg-emerald-50 p-5 dark:bg-white/5">
                      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.18em] text-emerald-700 dark:text-amber-300"><Bitcoin size={16} /> Bitcoin</div>
                      {paymentDetails.bitcoinAddress ? (
                        <>
                          <QRCodeSVG value={paymentDetails.bitcoinAddress} size={128} bgColor="transparent" fgColor="#0b4235" />
                          <div className="w-full rounded-xl bg-white/80 p-3 text-sm dark:bg-emerald-900/40">
                            <div className="text-xs uppercase tracking-[.12em] text-ink-500 dark:text-white/50">Wallet address</div>
                            <div className="mt-2 flex items-center justify-between gap-4 font-semibold text-emerald-950 dark:text-white">
                              <span className="break-all">{paymentDetails.bitcoinAddress}</span>
                              <button onClick={() => copy(paymentDetails.bitcoinAddress, "bitcoin-address")} className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-900 dark:bg-white/10 dark:text-white">{copied === "bitcoin-address" ? <Check size={12} /> : <Clipboard size={12} />} {copied === "bitcoin-address" ? "Copied" : "Copy"}</button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-ink-500 dark:text-white/60">Bitcoin wallet details are not configured yet.</div>
                      )}
                    </div>
                  )}

                  {availableMethods.length > 0 && (
                    <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-white/5 dark:text-white">
                      <LockKeyhole size={16} className="text-emerald-700 dark:text-amber-300" />
                      {selectedMethodLabel} is enabled and ready for secure giving.
                    </div>
                  )}
                </div>
              )}

              {showSummary && (
                <div className="space-y-5">
                  <div className="rounded-2xl bg-emerald-50 p-5 text-center dark:bg-white/5">
                    <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-700 text-white">
                      <Check size={26} />
                    </div>
                    <div className="mt-4 font-display text-3xl text-emerald-950 dark:text-white">Thank you</div>
                    <p className="mt-2 text-sm leading-6 text-ink-500 dark:text-white/60">Your ${Number(amount || 0).toLocaleString()} {frequency === "once" ? "one-time" : "monthly"} gift is ready to be sent through {selectedMethodLabel.toLowerCase()}.</p>
                  </div>

                  <div className="rounded-2xl border border-emerald-900/10 p-4 dark:border-white/10">
                    <div className="flex items-center justify-between text-sm text-ink-500 dark:text-white/60">
                      <span>Donation</span>
                      <span className="font-bold text-emerald-950 dark:text-white">${Number(amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-ink-500 dark:text-white/60">
                      <span>Method</span>
                      <span className="font-bold text-emerald-950 dark:text-white">{selectedMethodLabel}</span>
                    </div>
                  </div>
                </div>
              )}

              {!showSummary && (
                <div className="mt-8 flex items-center justify-between gap-3">
                  <button onClick={back} disabled={step === 0} className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 px-4 py-2.5 text-sm font-semibold text-emerald-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-white">
                    <ArrowLeft size={16} /> Back
                  </button>

                  <button onClick={next} className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 dark:bg-amber-400 dark:text-emerald-950">
                    {step === 2 ? "Finish" : "Continue"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
