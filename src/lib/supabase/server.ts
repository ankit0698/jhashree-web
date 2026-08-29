import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { requireEnvironmentVariable } from "@/lib/supabase/env";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient() {
  if (!adminClient) {
    adminClient = createClient(
      requireEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL"),
      requireEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
  }

  return adminClient;
}
