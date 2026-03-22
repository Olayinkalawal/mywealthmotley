"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { type ReactNode, useRef } from "react";

export function MarketingProviders({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const clientRef = useRef<ConvexReactClient | null>(null);

  if (convexUrl && !clientRef.current) {
    clientRef.current = new ConvexReactClient(convexUrl);
  }

  if (!clientRef.current) {
    return <>{children}</>;
  }

  return (
    <ConvexProvider client={clientRef.current}>{children}</ConvexProvider>
  );
}
