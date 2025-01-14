import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/login",
  "/sign-in",
  "/register",
  "/forgot-password",
  "/products",
  "/cart",
];
const protectedPaths = ["/admin", "/profile", "/checkout", "/orders"];

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const access_token =
    authHeader?.split(" ")[1] || request.cookies.get("access_token")?.value;

  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    if (
      access_token &&
      (pathname === "/login" ||
        pathname === "/sign-in" ||
        pathname === "/register")
    ) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
    return NextResponse.next();
  }

  // Protect routes
  if (!access_token) {
    console.log("Access token not found, redirecting to sign-in");
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(
        new URL(`/sign-in?redirect=${pathname}`, request.url)
      );
    }
  }

  // Add access_token to request headers
  if (access_token) {
    request.headers.set("Authorization", `Bearer ${access_token}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/sign-in",
    "/register",
  ],
};
