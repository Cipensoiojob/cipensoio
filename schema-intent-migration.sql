-- =============================================================================
-- Migrazione: intent cerco | offro (vetrina operatori)
-- Esegui in Supabase SQL Editor
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE public.listing_intent AS ENUM ('cerco', 'offro');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS intent public.listing_intent NOT NULL DEFAULT 'cerco';

CREATE INDEX IF NOT EXISTS listings_intent_idx
  ON public.listings (intent, status, created_at DESC);

CREATE INDEX IF NOT EXISTS listings_intent_city_idx
  ON public.listings (intent, location_city, category);

-- Ricrea vista pubblica con intent
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
  status,
  intent
FROM public.listings
WHERE status = 'published';

GRANT SELECT ON public.listings_public TO anon, authenticated;

-- Profili demo "offro" (operatori disponibili)
INSERT INTO public.listings (
  macro_branch, category, title, slug, description,
  company_or_family_name, location_city, location_zone,
  is_remote, work_type, salary_custom, contact_phone, contact_whatsapp,
  is_featured, is_verified, status, intent
) VALUES
(
  'persona_assistenza',
  'badante',
  'Badante disponibile a Milano — Maria',
  'badante-disponibile-milano-maria-101',
  'Ho esperienza con anziani e convivenza. Disponibile da subito, preferisco contatto WhatsApp. Referenze su richiesta.',
  'Maria Rossi',
  'Milano',
  'Città Studi',
  false,
  'convivenza',
  'Da concordare / CCNL',
  '+393401010101',
  '+393401010101',
  true,
  true,
  'published',
  'offro'
),
(
  'persona_assistenza',
  'babysitter',
  'Babysitter disponibile zona Roma Nord',
  'babysitter-disponibile-roma-102',
  'Mi occupo di bambini da 2 a 10 anni. Pomeriggi e weekend. Parlo italiano e un po'' di inglese.',
  'Giulia Bianchi',
  'Roma',
  'Trieste',
  false,
  'ad_ore',
  '12€/ora',
  '+393401010102',
  '+393401010102',
  false,
  true,
  'published',
  'offro'
),
(
  'pet_home',
  'dogsitter',
  'Dog sitter disponibile a Bologna',
  'dogsitter-disponibile-bologna-103',
  'Passeggiate e custodia diurna. Amo i cani di ogni taglia. Zona Savena e centro.',
  'Luca Verdi',
  'Bologna',
  'Savena',
  false,
  'ad_ore',
  '10€/ora',
  '+393401010103',
  NULL,
  false,
  true,
  'published',
  'offro'
),
(
  'pet_home',
  'idraulico',
  'Idraulico per piccoli interventi a Milano',
  'idraulico-milano-disponibile-104',
  'Riparazioni perdite, rubinetti, scarichi. Interventi rapidi in città. Preventivo chiaro.',
  'Andrea Neri',
  'Milano',
  NULL,
  false,
  'ad_ore',
  'Preventivo',
  '+393401010104',
  '+393401010104',
  true,
  false,
  'published',
  'offro'
)
ON CONFLICT (slug) DO NOTHING;
