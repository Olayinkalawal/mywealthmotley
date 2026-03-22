import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Allow public routes through without any checks
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If the user is not signed in and trying to access an app route,
  // redirect them to sign-in.
  if (!userId && isAppRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // All authenticated users can access all app routes.
  // Onboarding is encouraged but NOT forced -- users can skip and explore.
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
