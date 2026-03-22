"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";

export default function DebugPage() {
  const { isSignedIn, userId: clerkUserId, getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const { isAuthenticated: convexAuth, isLoading: convexLoading } = useConvexAuth();
  const [token, setToken] = useState<string | null>(null);
  const [ensureResult, setEnsureResult] = useState<string>("not run");

  const ensureUser = useMutation(api.users.ensureUser);

  const handleCheckToken = async () => {
    try {
      const t = await getToken({ template: "convex" });
      setToken(t ? `${t.slice(0, 50)}...` : "NULL - no token!");
    } catch (e: any) {
      setToken(`ERROR: ${e.message}`);
    }
  };

  const handleEnsureUser = async () => {
    try {
      setEnsureResult("running...");
      const result = await ensureUser();
      setEnsureResult(`Success: ${JSON.stringify(result)}`);
    } catch (e: any) {
      setEnsureResult(`ERROR: ${e.message}`);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Auth Debug Page</h1>

      <div className="space-y-3 rounded-lg border p-4">
        <h2 className="font-bold text-lg">Clerk Status</h2>
        <p>isSignedIn: <code className="font-bold">{String(isSignedIn)}</code></p>
        <p>clerkUserId: <code className="font-bold">{clerkUserId ?? "null"}</code></p>
        <p>email: <code className="font-bold">{clerkUser?.primaryEmailAddress?.emailAddress ?? "null"}</code></p>
        <p>name: <code className="font-bold">{clerkUser?.firstName ?? "null"} {clerkUser?.lastName ?? ""}</code></p>
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <h2 className="font-bold text-lg">Convex Auth Status</h2>
        <p>isAuthenticated: <code className="font-bold">{String(convexAuth)}</code></p>
        <p>isLoading: <code className="font-bold">{String(convexLoading)}</code></p>
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <h2 className="font-bold text-lg">JWT Token Check</h2>
        <button onClick={handleCheckToken} className="px-4 py-2 bg-blue-600 text-white rounded">
          Get Convex Token
        </button>
        <p>Token: <code className="font-bold text-sm break-all">{token ?? "click button"}</code></p>
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <h2 className="font-bold text-lg">Ensure User (Create in Convex)</h2>
        <button onClick={handleEnsureUser} className="px-4 py-2 bg-green-600 text-white rounded">
          Run ensureUser()
        </button>
        <p>Result: <code className="font-bold text-sm break-all">{ensureResult}</code></p>
      </div>

      <div className="space-y-3 rounded-lg border p-4 bg-yellow-50">
        <h2 className="font-bold text-lg">What should be true for pages to work:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Clerk isSignedIn = <code>true</code></li>
          <li>Convex isAuthenticated = <code>true</code></li>
          <li>Token should NOT be null</li>
          <li>ensureUser should return a user ID</li>
        </ul>
      </div>
    </div>
  );
}
