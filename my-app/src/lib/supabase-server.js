import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createSupabaseClient(key) {
  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getServerSupabaseClient() {
  const serverKey = supabaseServiceRoleKey || supabaseAnonKey;

  if (!supabaseUrl || !serverKey) {
    throw new Error("Missing Supabase server environment variables.");
  }

  return createSupabaseClient(serverKey);
}

export function getServiceRoleSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for blog image uploads."
    );
  }

  return createSupabaseClient(supabaseServiceRoleKey);
}
