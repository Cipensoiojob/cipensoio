-- =============================================================================
-- CiPensoIo — Analytics (eventi di navigazione / ricerca)
-- Esegui in: Supabase Dashboard → SQL Editor → Run
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.site_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL
    CHECK (event_type IN ('page_view', 'search', 'listing_view')),
  path TEXT,
  query TEXT,
  city TEXT,
  intent TEXT,
  listing_slug TEXT,
  referrer TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS site_events_created_at_idx
  ON public.site_events (created_at DESC);

CREATE INDEX IF NOT EXISTS site_events_type_created_idx
  ON public.site_events (event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS site_events_session_idx
  ON public.site_events (session_id, created_at DESC);

ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_events_anon_insert" ON public.site_events;
CREATE POLICY "site_events_anon_insert"
  ON public.site_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    event_type IN ('page_view', 'search', 'listing_view')
    AND char_length(coalesce(path, '')) <= 500
    AND char_length(coalesce(query, '')) <= 200
    AND char_length(coalesce(city, '')) <= 120
    AND char_length(coalesce(intent, '')) <= 40
    AND char_length(coalesce(listing_slug, '')) <= 200
    AND char_length(coalesce(referrer, '')) <= 500
    AND char_length(coalesce(session_id, '')) <= 80
  );

-- Nessuna policy SELECT per anon: lettura solo via service role (admin).

GRANT INSERT ON public.site_events TO anon, authenticated;
GRANT ALL ON public.site_events TO service_role;

COMMENT ON TABLE public.site_events IS
  'Eventi analytics first-party (page view, search, listing view). Nessun PII.';
