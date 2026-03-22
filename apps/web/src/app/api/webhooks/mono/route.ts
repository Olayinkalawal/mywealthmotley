import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // TODO: Implement Mono webhook handler
  return NextResponse.json({ received: true });
}
