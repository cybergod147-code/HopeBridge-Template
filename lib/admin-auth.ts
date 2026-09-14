import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const adminCookieName = "hopebridge_admin";
const sessionLifetimeSeconds = 60 * 60 * 8;
const credentialsPath = join(process.cwd(), "data", "admin-credentials.json");

type AdminCredentials = { username: string; salt: string; hash: string };

function getSecret() {
  const secret = process.env.HOPEBRIDGE_ADMIN_SECRET;
  if (!secret) throw new Error("HOPEBRIDGE_ADMIN_SECRET is not configured");
  return secret;
}

function makeCredentials(username: string, password: string): AdminCredentials {
  const salt = randomBytes(16).toString("hex");
  return { username, salt, hash: scryptSync(password, salt, 64).toString("hex") };
}

function isPasswordValidForCredentials(credentials: AdminCredentials, password: string) {
  const hash = scryptSync(password, credentials.salt, 64);
  const expected = Buffer.from(credentials.hash, "hex");
  return hash.length === expected.length && timingSafeEqual(hash, expected);
}

export function isAdminConfigured() {
  return Boolean((existsSync(credentialsPath) || (process.env.HOPEBRIDGE_ADMIN_USERNAME && process.env.HOPEBRIDGE_ADMIN_PASSWORD)) && process.env.HOPEBRIDGE_ADMIN_SECRET);
}

function getStoredCredentials(): AdminCredentials | null {
  if (!existsSync(credentialsPath)) return null;
  try {
    return JSON.parse(readFileSync(credentialsPath, "utf8")) as AdminCredentials;
  } catch {
    return null;
  }
}

function getEnvCredentials(): AdminCredentials | null {
  const username = process.env.HOPEBRIDGE_ADMIN_USERNAME;
  const password = process.env.HOPEBRIDGE_ADMIN_PASSWORD;
  if (!username || !password) return null;
  return makeCredentials(username, password);
}

function getCredentials(): AdminCredentials | null {
  const envCredentials = getEnvCredentials();
  if (envCredentials) {
    mkdirSync(join(process.cwd(), "data"), { recursive: true });
    const storedCredentials = getStoredCredentials();
    const shouldSyncFromEnv = !storedCredentials || storedCredentials.username !== envCredentials.username || !isPasswordValidForCredentials(storedCredentials, process.env.HOPEBRIDGE_ADMIN_PASSWORD!);
    if (shouldSyncFromEnv) {
      writeFileSync(credentialsPath, JSON.stringify(envCredentials, null, 2), { encoding: "utf8", mode: 0o600 });
    }
    return envCredentials;
  }

  return getStoredCredentials();
}

export function verifyAdminCredentials(username: string, password: string) {
  const credentials = getCredentials();
  if (!credentials || username !== credentials.username) return false;
  return isPasswordValidForCredentials(credentials, password);
}

export function changeAdminCredentials(currentPassword: string, username: string, password: string) {
  const credentials = getCredentials();
  if (!credentials || !verifyAdminCredentials(credentials.username, currentPassword) || !username || password.length < 12) return false;
  const salt = randomBytes(16).toString("hex");
  const updatedCredentials = { username, salt, hash: scryptSync(password, salt, 64).toString("hex") };
  mkdirSync(join(process.cwd(), "data"), { recursive: true });
  writeFileSync(credentialsPath, JSON.stringify(updatedCredentials, null, 2), { encoding: "utf8", mode: 0o600 });
  process.env.HOPEBRIDGE_ADMIN_USERNAME = username;
  process.env.HOPEBRIDGE_ADMIN_PASSWORD = password;
  return true;
}

export function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + sessionLifetimeSeconds;
  const payload = String(expiresAt);
  const signature = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return { value: `${payload}.${signature}`, maxAge: sessionLifetimeSeconds };
}

export function isValidAdminSession(value?: string) {
  if (!value) return false;
  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature || Number(expiresAt) < Math.floor(Date.now() / 1000)) return false;
  const expected = createHmac("sha256", getSecret()).update(expiresAt).digest("hex");
  if (signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
