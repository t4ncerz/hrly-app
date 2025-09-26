import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Isolated webhook exclusion logic - can be easily removed in the future
function isWebhookEndpoint(pathname: string): boolean {
  // Only exclude Clerk webhook endpoints from authentication
  return pathname.startsWith("/api/webhooks/clerk");
}

// Core middleware logic (no auth)
function passthrough(request: NextRequest): NextResponse | null {
  if (isWebhookEndpoint(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return NextResponse.next();
}

export default function middleware(req: NextRequest) {
  const response = passthrough(req);
  return response ?? NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
