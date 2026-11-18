import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * تسجيل خروج مبني على الخمول: بيمسح الجلسة ويرجّع اليوزر لصفحة اللوجين.
 */
export async function GET(request: NextRequest) {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // مفيش جلسة أصلًا — كمّل عادي
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "?reason=idle";

  const response = NextResponse.redirect(url);
  response.cookies.set("last_activity", "", { path: "/", maxAge: 0 });
  return response;
}
