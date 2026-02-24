import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Block UI routes: only allow home (/) and API routes.
 * All other paths redirect to / so the frontend is not used (APIs only for mobile).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow home page and privacy policy page
  if (pathname === "/" || pathname === "/privacypolicy") {
    return NextResponse.next();
  }

  // Allow all API routes
  if (pathname.startsWith("/api")) return NextResponse.next();

  // Allow Next.js internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Block all other UI routes → redirect to home
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
