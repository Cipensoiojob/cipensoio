"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SID_KEY = "cipensoio_sid";
const FIRST_REF_KEY = "cipensoio_first_ref";

function getSessionId(): string {
  try {
    const existing = localStorage.getItem(SID_KEY);
    if (existing && existing.length >= 8) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SID_KEY, id);
    return id;
  } catch {
    return `anon_${Date.now().toString(36)}`;
  }
}

/** Prima referrer della sessione (Google → navigazione interna non lo perde). */
function getAttributionReferrer(): string | undefined {
  try {
    const stored = sessionStorage.getItem(FIRST_REF_KEY);
    if (stored !== null) return stored || undefined;
    const ref =
      typeof document !== "undefined" ? document.referrer || "" : "";
    sessionStorage.setItem(FIRST_REF_KEY, ref);
    return ref || undefined;
  } catch {
    return typeof document !== "undefined"
      ? document.referrer || undefined
      : undefined;
  }
}

function postEvent(payload: Record<string, string | undefined>) {
  const body = JSON.stringify(payload);
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

/**
 * Beacon first-party: page view + search + listing view.
 * Solo ID sessione anonimo in localStorage (niente cookie di profilazione).
 */
export function AnalyticsBeacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastKey = useRef<string>("");

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const q = searchParams.get("q")?.trim() || undefined;
    const citta = searchParams.get("citta")?.trim() || undefined;
    const intento = searchParams.get("intento")?.trim() || undefined;
    const utmSource = searchParams.get("utm_source")?.trim() || undefined;
    const key = `${pathname}?${searchParams.toString()}`;
    if (key === lastKey.current) return;
    lastKey.current = key;

    const session_id = getSessionId();
    let referrer = getAttributionReferrer();
    if (!referrer && utmSource && /google/i.test(utmSource)) {
      referrer = "https://www.google.com/";
    }

    postEvent({
      event_type: "page_view",
      path: pathname,
      query: q,
      city: citta,
      intent: intento,
      referrer,
      session_id,
    });

    if (q || citta) {
      if (pathname === "/cerca" || pathname === "/disponibili") {
        postEvent({
          event_type: "search",
          path: pathname,
          query: q,
          city: citta,
          intent: intento,
          session_id,
        });
      }
    }

    const listingMatch = pathname.match(/^\/annunci\/([^/]+)/);
    if (listingMatch?.[1]) {
      postEvent({
        event_type: "listing_view",
        path: pathname,
        listing_slug: listingMatch[1],
        session_id,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
