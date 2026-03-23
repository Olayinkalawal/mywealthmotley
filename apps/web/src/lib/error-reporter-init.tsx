"use client";

import { useEffect } from "react";

export function ErrorReporterInit() {
  useEffect(() => {
    import("@/lib/error-reporter").then(({ initErrorReporter }) =>
      initErrorReporter()
    );
  }, []);
  return null;
}
