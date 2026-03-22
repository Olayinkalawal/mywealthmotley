"use client";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useRef } from "react";

export function useEnsureUser() {
  const { isAuthenticated } = useConvexAuth();
  const ensureUser = useMutation(api.users.ensureUser);
  const hasRun = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasRun.current) {
      hasRun.current = true;
      ensureUser().catch(console.error);
    }
  }, [isAuthenticated, ensureUser]);
}
