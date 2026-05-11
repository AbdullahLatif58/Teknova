// middleware.ts
// Next.js middleware to protect dashboard routes using JWT authentication.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ["/dashboard", "/products", "/categories", "/orders", "/users", "/templates", "/variants", "/promotions", "/logs"];
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  const token = request.cookies.get("accessToken")?.value;

  if (isProtectedRoute) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (isAuthRoute) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/categories/:path*",
    "/orders/:path*",
    "/users/:path*",
    "/templates/:path*",
    "/variants/:path*",
    "/promotions/:path*",
    "/logs/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ]
};
