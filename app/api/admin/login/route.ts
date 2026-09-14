import { NextResponse } from "next/server";
import { adminCookieName, createAdminSession, isAdminConfigured, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) return NextResponse.json({ error: "Admin authentication is not configured." }, { status: 503 });
  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");
  if (!verifyAdminCredentials(username, password)) return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  const session = createAdminSession();
  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set(adminCookieName, session.value, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: session.maxAge });
  return response;
}
