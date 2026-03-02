import { NextRequest, NextResponse } from "next/server";

// Simple JWT token check without importing Prisma-dependent auth
// (PrismaAdapter can't run in Edge Runtime)
export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  const { pathname } = req.nextUrl;

  // Protected routes
  const protectedPaths = ["/dashboard", "/course", "/admin"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from auth pages
  const authPaths = ["/auth/login", "/auth/register"];
  if (authPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.paypal.com https://www.sandbox.paypal.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://www.paypal.com https://www.sandbox.paypal.com; frame-src https://www.paypal.com https://www.sandbox.paypal.com;"
  );

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/course/:path*", "/auth/:path*", "/admin/:path*"],
};
