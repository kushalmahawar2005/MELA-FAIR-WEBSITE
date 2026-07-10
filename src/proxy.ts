import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAdminToken, verifyUserToken } from "@/lib/auth-token";

const ADMIN_COOKIE = "naaz-admin";
const USER_COOKIE = "naaz-user";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Public reads — the homepage and detail pages need these without auth.
  const isPublicRead =
    method === "GET" &&
    (pathname.startsWith("/api/content") ||
      pathname.startsWith("/api/rides"));

  // Public booking creation — guests submit bookings from the /book page.
  const isPublicBookingCreate =
    method === "POST" && pathname === "/api/bookings";

  if (isPublicRead || isPublicBookingCreate) {
    return NextResponse.next();
  }

  const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;
  const isAdmin = await verifyAdminToken(adminToken);

  if (isAdmin) {
    return NextResponse.next();
  }

  const userToken = request.cookies.get(USER_COOKIE)?.value;
  const isUser = await verifyUserToken(userToken);

  if (isUser) {
    const allowedUserPaths = [
      "/api/bookings",
      "/api/auth/profile",
      "/api/auth/logout"
    ];

    if (allowedUserPaths.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/content/:path*",
    "/api/rides/:path*",
    "/api/bookings/:path*",
    "/api/auth/profile",
    "/api/db-reset/:path*",
  ],
};
