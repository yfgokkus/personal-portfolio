import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis (only if you have Upstash credentials)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// General API rate limit: 100 requests per 10 minutes
const apiRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "10 m"),
    })
  : null;

// Strict login rate limit: 5 attempts per 15 minutes
const loginRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
    })
  : null;

export async function proxy(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  // Rate limit API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    if (apiRatelimit) {
      const { success } = await apiRatelimit.limit(`api:${ip}`);
      if (!success) {
        return new Response("Too Many Requests", { status: 429 });
      }
    }
  }

  // Rate limit login attempts
  if (
    request.nextUrl.pathname === "/admin/login" &&
    request.method === "POST"
  ) {
    if (loginRatelimit) {
      const { success } = await loginRatelimit.limit(`login:${ip}`);
      if (!success) {
        return NextResponse.json(
          { error: "Too many login attempts. Try again later." },
          { status: 429 },
        );
      }
    }
  }

  // Admin authentication
  const token = request.cookies.get("admin-token")?.value;

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
