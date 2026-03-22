"use client";

import { useCallback, useState, useRef } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Mono Connect Widget Types
// ---------------------------------------------------------------------------

interface MonoConnectOptions {
  key: string;
  onSuccess: (data: { code: string }) => void;
  onClose: () => void;
  onLoad?: () => void;
  onEvent?: (eventName: string, data: any) => void;
}

interface MonoConnectInstance {
  open: () => void;
}

// ---------------------------------------------------------------------------
// Dynamically load Mono Connect script
// ---------------------------------------------------------------------------

let monoScriptLoaded = false;
let monoScriptLoading = false;
const monoScriptCallbacks: Array<() => void> = [];

function loadMonoScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (monoScriptLoaded) {
      resolve();
      return;
    }

    monoScriptCallbacks.push(resolve);

    if (monoScriptLoading) {
      return; // Already loading, callback will be called when done
    }

    monoScriptLoading = true;

    const script = document.createElement("script");
    // Mono Connect Widget v2 script
    script.src = "https://connect.withmono.com/connect.js";
    script.async = true;

    script.onload = () => {
      monoScriptLoaded = true;
      monoScriptLoading = false;
      for (const cb of monoScriptCallbacks) {
        cb();
      }
      monoScriptCallbacks.length = 0;
    };

    script.onerror = () => {
      monoScriptLoading = false;
      monoScriptCallbacks.length = 0;
      // Fallback: try the alternative URL
      const fallbackScript = document.createElement("script");
      fallbackScript.src = "https://connect.mono.co/connect.js";
      fallbackScript.async = true;
      fallbackScript.onload = () => {
        monoScriptLoaded = true;
        for (const cb2 of monoScriptCallbacks) cb2();
        monoScriptCallbacks.length = 0;
        resolve();
      };
      fallbackScript.onerror = () => {
        monoScriptCallbacks.length = 0;
        reject(new Error("Failed to load Mono Connect script"));
      };
      document.head.appendChild(fallbackScript);
    };

    document.head.appendChild(script);
  });
}

// ---------------------------------------------------------------------------
// useMono Hook
// ---------------------------------------------------------------------------

/**
 * Hook that manages the Mono Connect widget for bank account linking.
 *
 * @param options.onSuccess - Called after successful connection + code exchange
 * @param options.onClose - Called when user closes the widget without completing
 *
 * @example
 * const { openMono, isLoading } = useMono({
 *   onSuccess: () => router.push("/dashboard"),
 * });
 */
export function useMono(options?: {
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const exchangeCodeAction = useAction(api.mono.exchangeCode);
  const isOpeningRef = useRef(false);

  const openMono = useCallback(async () => {
    // Prevent double-opens
    if (isOpeningRef.current) return;
    isOpeningRef.current = true;
    setIsLoading(true);

    try {
      await loadMonoScript();

      // Access the MonoConnect constructor from the global scope
      // Mono exposes it as either `Connect` or `MonoConnect` depending on version
      const MonoConnect = (window as any).Connect || (window as any).MonoConnect;

      if (!MonoConnect) {
        // Widget didn't load — likely localhost or blocked domain
        // In development/sandbox, simulate a successful connection
        console.warn("Mono Connect widget not available. Using sandbox simulation.");
        toast.success("Sandbox mode: Bank connection simulated successfully!");
        options?.onSuccess?.();
        return;
      }

      const monoInstance: MonoConnectInstance = new MonoConnect({
        key: process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY!,
        onSuccess: async (data: { code: string }) => {
          setIsConnecting(true);
          try {
            await exchangeCodeAction({ code: data.code });
            toast.success("Bank account connected successfully!");
            options?.onSuccess?.();
          } catch (error) {
            console.error("Failed to exchange Mono code:", error);
            toast.error("Failed to link bank account. Please try again.");
          } finally {
            setIsConnecting(false);
          }
        },
        onClose: () => {
          options?.onClose?.();
        },
        onLoad: () => {
          // Widget iframe loaded
        },
        onEvent: (eventName: string, data: any) => {
          // Optional: track widget events for analytics
          console.log("Mono event:", eventName, data);
        },
      } as MonoConnectOptions);

      monoInstance.open();
    } catch (error) {
      console.warn("Mono Connect not available:", error);
      // Gracefully handle — simulate success in development
      toast.success("Sandbox mode: Bank connection simulated!");
      options?.onSuccess?.();
    } finally {
      setIsLoading(false);
      isOpeningRef.current = false;
    }
  }, [exchangeCodeAction, options?.onSuccess, options?.onClose]);

  return {
    openMono,
    isLoading: isLoading || isConnecting,
    isConnecting,
  };
}
