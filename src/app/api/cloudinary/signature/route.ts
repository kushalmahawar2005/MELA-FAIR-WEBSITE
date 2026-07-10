import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "naaz-admin";
const DEFAULT_FOLDER = "naaz-amusement";

export const runtime = "nodejs";

function getCloudinaryConfig() {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;

  if ((!cloudName || !apiKey || !apiSecret) && process.env.CLOUDINARY_URL) {
    try {
      const cloudinaryUrl = new URL(process.env.CLOUDINARY_URL);
      apiKey = apiKey || decodeURIComponent(cloudinaryUrl.username);
      apiSecret = apiSecret || decodeURIComponent(cloudinaryUrl.password);
      cloudName = cloudName || cloudinaryUrl.hostname;
    } catch {
      return null;
    }
  }

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

function sanitizeFolder(folder?: unknown) {
  if (typeof folder !== "string") return DEFAULT_FOLDER;

  const cleaned = folder
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/_-]/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");

  return cleaned || DEFAULT_FOLDER;
}

function signParams(params: Record<string, string>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${payload}${apiSecret}`)
    .digest("hex");
}

import { verifyAdminToken } from "@/lib/auth-token";

export async function POST(request: NextRequest) {
  const adminCookie = request.cookies.get(ADMIN_COOKIE)?.value;
  const isAdmin = await verifyAdminToken(adminCookie);

  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const config = getCloudinaryConfig();
  if (!config) {
    return NextResponse.json(
      { message: "Cloudinary environment variables are missing" },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const timestamp = Math.round(Date.now() / 1000).toString();
  const folder = sanitizeFolder(body.folder);
  const paramsToSign = { folder, timestamp };

  return NextResponse.json({
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    folder,
    timestamp,
    signature: signParams(paramsToSign, config.apiSecret),
  });
}
