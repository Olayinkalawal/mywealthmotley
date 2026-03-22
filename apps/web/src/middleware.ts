import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Content Security Policy — defence-in-depth header.
 * Uses 'unsafe-inline' for scripts because nonce-based CSP with Next.js
 * App Router requires significant middleware complexity. Still much better
 * than no CSP at all.
 */
const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.clerk.com https://*.cloudflare.com https://img.clerk.com https://hatscripts.github.io",
  "connect-src 'self' https://*.convex.cloud https://*.clerk.accounts.dev https://api.openai.com https://*.mono.co wss://*.convex.cloud",
  "frame-src 'self' https://*.clerk.accounts.dev https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
].join("; ");

/**
 * Public routes that do not require authentication.
 * Matches all (marketing) and (auth) route groups plus static/API paths.
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/about(.*)",
  "/pricing(.*)",
  "/blog(.*)",
  "/contact(.*)",
  "/terms(.*)",
  "/privacy(.*)",
  "/how-we-make-money(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/api/webhooks(.*)",
]);

/**
 * All app routes that require authentication (but NOT necessarily onboarding).
 * Users can explore the app after signing in even if onboarding isn't done yet.
 */
const isAppRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/all-my-money(.*)",
  "/transactions(.*)",
  "/budget(.*)",
  "/savings(.*)",
  "/black-tax(.*)",
  "/japa(.*)",
  "/portfolio(.*)",
  "/learn(.*)",
  "/money-story(.*)",
  "/sholz(.*)",
  "/settings(.*)",
  "/admin(.*)",
  "/onboarding(.*)",
]);

/**
 * Attach the CSP header to a NextResponse.
 */
function withCsp(response: NextResponse): NextResponse {
  response.headers.set("Content-Security-Policy", CSP_HEADER);
  return response;
}

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Allow public routes through without any checks
  if (isPublicRoute(req)) {
    return withCsp(NextResponse.next());
  }

  // If the user is not signed in and trying to access an app route,
  // redirect them to sign-in.
  if (!userId && isAppRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // All authenticated users can access all app routes.
  // Onboarding is encouraged but NOT forced -- users can skip and explore.
  return withCsp(NextResponse.next());
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
