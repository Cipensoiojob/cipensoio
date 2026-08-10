-- =============================================================================
-- CiPensoIo — Schema Supabase (PostgreSQL)
-- Esegui in: Supabase Dashboard → SQL Editor → New query → Run
-- =============================================================================

-- Tipi enum
DO $$ BEGIN
  CREATE TYPE public.macro_branch AS ENUM (
    'persona_assistenza',
    'pet_home',
    'lavoro_tradizionale'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.work_type AS ENUM (
    'full_time',
    'part_time',
    'convivenza',
    'ad_ore',
    'turni'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- FASE 3: moderazione annunci
DO $$ BEGIN
  CREATE TYPE public.listing_status AS ENUM (
    'pending',
    'published',
    'rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Tabella principale annunci
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  macro_branch public.macro_branch NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  company_or_family_name TEXT NOT NULL,
  location_city TEXT NOT NULL,
  location_zone TEXT,
  is_remote BOOLEAN NOT NULL DEFAULT false,
  work_type public.work_type NOT NULL,
  salary_custom TEXT,
  contact_phone TEXT NOT NULL,
  contact_whatsapp TEXT,
  apply_external_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  status public.listing_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT listings_slug_unique UNIQUE (slug),
  CONSTRAINT listings_category_nonempty CHECK (char_length(trim(category)) > 0),
  CONSTRAINT listings_title_nonempty CHECK (char_length(trim(title)) > 0),
  CONSTRAINT listings_slug_seo CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- Migrazione FASE 3 su DB già esistenti
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS status public.listing_status NOT NULL DEFAULT 'pending';

-- Seed / annunci storici: marcali pubblicati se ancora al default senza revisione esplicito
-- (esegui una sola volta in produzione dopo il primo deploy FASE 3, poi commenta)
UPDATE public.listings
SET status = 'published'
WHERE status = 'pending'
  AND created_at < now() - interval '1 second'
  AND slug IN (
    'badante-h24-convivente-segrate-001',
    'dogsitter-passeggiate-milano-002',
    'ai-engineer-full-remote-003'
  );

-- Indici per ricerca, SEO programmatica e feed homepage
CREATE INDEX IF NOT EXISTS listings_macro_branch_idx
  ON public.listings (macro_branch);

CREATE INDEX IF NOT EXISTS listings_category_idx
  ON public.listings (category);

CREATE INDEX IF NOT EXISTS listings_city_idx
  ON public.listings (location_city);

CREATE INDEX IF NOT EXISTS listings_created_at_idx
  ON public.listings (created_at DESC);

CREATE INDEX IF NOT EXISTS listings_featured_idx
  ON public.listings (is_featured DESC, created_at DESC)
  WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS listings_city_branch_idx
  ON public.listings (location_city, macro_branch, created_at DESC);

CREATE INDEX IF NOT EXISTS listings_status_idx
  ON public.listings (status, created_at DESC);

-- Vista pubblica: SOLO published, senza contatti
-- DROP necessario: CREATE OR REPLACE non può inserire/riordinare colonne (errore 42P16)
DROP VIEW IF EXISTS public.listings_public;
CREATE VIEW public.listings_public
WITH (security_invoker = true)
AS
SELECT
  id,
  macro_branch,
  category,
  title,
  slug,
  description,
  company_or_family_name,
  location_city,
  location_zone,
  is_remote,
  work_type,
  salary_custom,
  apply_external_url,
  is_featured,
  is_verified,
  created_at,
  status
FROM public.listings
WHERE status = 'published';

COMMENT ON VIEW public.listings_public IS
  'Annunci pubblicati senza contact_phone / contact_whatsapp. Usare per homepage, SERP e sitemap.';

-- Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Lettura pubblica: solo annunci approvati
DROP POLICY IF EXISTS "listings_public_read" ON public.listings;
CREATE POLICY "listings_public_read"
  ON public.listings
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Insert pubblici sempre in pending (non si può forzare published da anon)
DROP POLICY IF EXISTS "listings_auth_insert" ON public.listings;
DROP POLICY IF EXISTS "listings_public_insert" ON public.listings;
CREATE POLICY "listings_public_insert"
  ON public.listings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- Update solo autenticati (moderazione usa service role lato server)
DROP POLICY IF EXISTS "listings_auth_update" ON public.listings;
CREATE POLICY "listings_auth_update"
  ON public.listings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.listings_public TO anon, authenticated;
GRANT SELECT, INSERT ON public.listings TO anon, authenticated;
GRANT UPDATE ON public.listings TO authenticated;

-- Seed demo (pubblicati)
INSERT INTO public.listings (
  macro_branch, category, title, slug, description,
  company_or_family_name, location_city, location_zone,
  is_remote, work_type, salary_custom, contact_phone, contact_whatsapp,
  is_featured, is_verified, status
) VALUES
(
  'persona_assistenza',
  'badante',
  'Badante H24 convivente a Segrate',
  'badante-h24-convivente-segrate-001',
  'Famiglia cerca badante convivente per assistenza anziana. Preferenza esperienza e referenze verificabili.',
  'Famiglia Rossi',
  'Segrate',
  'Milano Est',
  false,
  'convivenza',
  'Retribuzione secondo CCNL',
  '+390200000001',
  '+393400000001',
  true,
  true,
  'published'
),
(
  'pet_home',
  'dogsitter',
  'Dog sitter per passeggiate quotidiane a Milano',
  'dogsitter-passeggiate-milano-002',
  'Cerchiamo dog sitter affidabile per due passeggiate al giorno in zona Navigli.',
  'Famiglia Bianchi',
  'Milano',
  'Navigli',
  false,
  'ad_ore',
  '12€/ora',
  '+390200000002',
  NULL,
  false,
  true,
  'published'
),
(
  'lavoro_tradizionale',
  'ai_engineer',
  'AI Engineer Full Remote — startup italiana',
  'ai-engineer-full-remote-003',
  'Ruolo entry/mid su LLM e pipeline dati. Full remote, team italiano, contratto indeterminato.',
  'NovaTech Srl',
  'Italia',
  NULL,
  true,
  'full_time',
  'RAL 38-48k',
  '+390200000003',
  NULL,
  true,
  false,
  'published'
)
ON CONFLICT (slug) DO NOTHING;
