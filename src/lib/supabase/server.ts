import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * Supabase client للسيرفر (Server Components / Route Handlers).
 */
export async function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase مش مهيأ. ضيف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY في ملف .env.local"
    );
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // بيحصل لما نكون جوه Server Component (مش مسموح نكتب كوكيز) —
          // الـ proxy بيتكفل بتحديث الجلسة في الحالة دي.
        }
      },
    },
  });
}
