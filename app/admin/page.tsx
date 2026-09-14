import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, HeartHandshake } from "lucide-react";
import { AdminPaymentSettings } from "@/components/AdminPaymentSettings";
import { AdminFounderSettings } from "@/components/AdminFounderSettings";
import { AdminCredentialSettings } from "@/components/AdminCredentialSettings";
import { AdminChatSettings } from "@/components/AdminChatSettings";
import { adminCookieName, isAdminConfigured, isValidAdminSession } from "@/lib/admin-auth";

export default function AdminPage() {
  const session = cookies().get(adminCookieName)?.value;
  if (!isAdminConfigured() || !isValidAdminSession(session)) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-[#f7faf8] px-5 py-8 text-emerald-950 dark:bg-emerald-950 dark:text-white sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-400 text-emerald-950">
              <HeartHandshake size={21} />
            </span>
            <span className="font-display text-xl">HopeBridge<span className="text-amber-500">.</span></span>
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            <form action="/api/admin/logout" method="post">
              <button className="text-sm font-semibold text-ink-500 hover:text-emerald-800 dark:hover:text-amber-300">
                Sign out
              </button>
            </form>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500">
              <ArrowLeft size={16} /> Back to site
            </Link>
          </div>
        </div>

        <div className="mt-16 rounded-[2rem] bg-emerald-900 p-7 text-white shadow-soft sm:p-10">
          <div className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">Owner workspace</div>
          <h1 className="mt-4 font-display text-4xl">Site administration</h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/65">
            Manage payment destinations, live chat, and the approved founder profiles shown in the public experience.
          </p>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <AdminPaymentSettings />
              <AdminFounderSettings />
            </div>
            <div className="space-y-6">
              <AdminCredentialSettings />
              <AdminChatSettings />
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-ink-500 dark:text-white/45">
          Settings are stored in this browser for the current demo. Credentials are stored as a salted server-side hash. Move content settings to an authenticated database before production.
        </p>
      </div>
    </main>
  );
}
