import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Basic auth credentials from environment variables
// We need to use raw process.env here because middleware runs before the app
const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME || "admin";
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD || "password";

// Isolated webhook exclusion logic - can be easily removed in the future
function isWebhookEndpoint(pathname: string): boolean {
  // Only exclude Clerk webhook endpoints from authentication
  return pathname.startsWith("/api/webhooks/clerk");
}

// Core basic authentication logic
function performBasicAuth(request: NextRequest): NextResponse | null {
  if (isWebhookEndpoint(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    // Verify credentials
    const authValue = authHeader.split(" ")[1];
    const [user, pwd] = atob(authValue || "").split(":");

    if (user === BASIC_AUTH_USERNAME && pwd === BASIC_AUTH_PASSWORD) {
      return NextResponse.next();
    }
  }

  // Auth failed or not provided, respond with 401 and authenticate header
  return new NextResponse("Authentication Required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/reset-password(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  const response = await performBasicAuth(req);

  if (response) {
    return response;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
