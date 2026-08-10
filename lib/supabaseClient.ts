import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  // Accetta anche URL incollati con /rest/v1/
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes("YOUR_PROJECT_REF") &&
      !supabaseAnonKey.includes("YOUR_SUPABASE_ANON_KEY"),
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    isSupabaseConfigured() &&
      supabaseServiceRoleKey &&
      !supabaseServiceRoleKey.includes("YOUR_SERVICE_ROLE"),
  );
}

let client: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

/**
 * Browser / shared Supabase client (anon key).
 * Contatti sensibili restano protetti da RLS lato database.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    );
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return client;
}

/**
 * Client service-role solo server (bypassa RLS) — moderazione FASE 3.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY for admin operations in .env.local",
    );
  }

  if (!adminClient) {
    adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return adminClient;
}

/** Alias comodo per import legacy / componenti client. */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabaseClient(), prop, receiver);
  },
});
