import { Suspense } from "react";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";

/** Wrappa il beacon (useSearchParams richiede Suspense). */
export function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <AnalyticsBeacon />
    </Suspense>
  );
}
