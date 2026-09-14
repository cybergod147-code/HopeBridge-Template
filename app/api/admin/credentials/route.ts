import { NextResponse } from "next/server";
import { adminCookieName, changeAdminCredentials, isValidAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie")?.match(new RegExp(`${adminCookieName}=([^;]+)`))?.[1];
  if (!isValidAdminSession(cookie)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { currentPassword?: string; username?: string; password?: string };
  if (!body.currentPassword || !body.username || !body.password) return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  if (body.password.length < 12) return NextResponse.json({ error: "New password must be at least 12 characters." }, { status: 400 });
  if (!changeAdminCredentials(body.currentPassword, body.username.trim(), body.password)) return NextResponse.json({ error: "Current password was not accepted." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
