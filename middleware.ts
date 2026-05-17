import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// x402 payment verification is handled inside each API route via withX402
// (keeps middleware bundle under Vercel's 1 MB Edge Function limit)
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
