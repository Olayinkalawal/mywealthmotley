import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // TODO: Implement Clerk webhook handler
  return NextResponse.json({ received: true });
}
