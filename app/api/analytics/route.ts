import { NextResponse } from "next/server";
import {
  trackAnalyticsEvent,
  type AnalyticsEventType,
} from "@/lib/analytics";

export const runtime = "nodejs";

const ALLOWED: AnalyticsEventType[] = [
  "page_view",
  "search",
  "listing_view",
];

type Body = {
  event_type?: string;
  path?: string;
  query?: string;
  city?: string;
  intent?: string;
  listing_slug?: string;
  referrer?: string;
  session_id?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON non valido" }, { status: 400 });
  }

  const eventType = body.event_type as AnalyticsEventType | undefined;
  if (!eventType || !ALLOWED.includes(eventType)) {
    return NextResponse.json({ ok: false, error: "event_type non valido" }, { status: 400 });
  }

  // Ignora bot/admin path
  const path = body.path?.trim() ?? "";
  if (path.startsWith("/admin") || path.startsWith("/api")) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const result = await trackAnalyticsEvent({
    event_type: eventType,
    path,
    query: body.query,
    city: body.city,
    intent: body.intent,
    listing_slug: body.listing_slug,
    referrer: body.referrer,
    session_id: body.session_id,
  });

  if (!result.ok) {
    // 204 silenzioso: non rompere UX se la tabella non è ancora migrata
    return NextResponse.json({ ok: false, error: result.error }, { status: 200 });
  }

  return NextResponse.json({ ok: true });
}
