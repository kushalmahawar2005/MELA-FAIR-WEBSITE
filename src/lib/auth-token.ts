// Signed admin session token using HMAC-SHA256 via the Web Crypto API.
// Works in both the Node.js runtime (API routes) and the Edge runtime (proxy/middleware).

const encoder = new TextEncoder();
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return process.env.ADMIN_SECRET || "naaz-dev-secret-change-me-in-production";
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toHex(signature);
}

/** Create a signed `<base64(email|exp)>.<hmac>` token. */
export async function createAdminToken(
  email: string,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<string> {
  const payload = `${email}|${Date.now() + ttlMs}`;
  const signature = await hmac(payload);
  return `${btoa(payload)}.${signature}`;
}

/** Verify the signature and expiry of an admin token. */
export async function verifyAdminToken(
  token?: string | null
): Promise<boolean> {
  if (!token) return false;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  let payload: string;
  try {
    payload = atob(payloadB64);
  } catch {
    return false;
  }

  const expected = await hmac(payload);
  if (expected !== signature) return false;

  const exp = Number(payload.split("|")[1]);
  return Boolean(exp) && Date.now() <= exp;
}

function getUserSecret(): string {
  return process.env.USER_SECRET || process.env.ADMIN_SECRET || "naaz-user-dev-secret-change-me";
}

async function hmacUser(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getUserSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toHex(signature);
}

export async function createUserToken(
  email: string,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<string> {
  const payload = `${email}|${Date.now() + ttlMs}`;
  const signature = await hmacUser(payload);
  return `${btoa(payload)}.${signature}`;
}

export async function verifyUserToken(
  token?: string | null
): Promise<boolean> {
  if (!token) return false;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  let payload: string;
  try {
    payload = atob(payloadB64);
  } catch {
    return false;
  }

  const expected = await hmacUser(payload);
  if (expected !== signature) return false;

  const exp = Number(payload.split("|")[1]);
  return Boolean(exp) && Date.now() <= exp;
}

export function decodeUserEmail(token?: string | null): string | null {
  if (!token) return null;
  const [payloadB64] = token.split(".");
  if (!payloadB64) return null;
  try {
    const payload = atob(payloadB64);
    return payload.split("|")[0];
  } catch {
    return null;
  }
}
