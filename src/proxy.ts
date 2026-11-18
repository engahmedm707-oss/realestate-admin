import { NextResponse, type NextRequest } from "next/server";
import { IDLE_MS, isSupabaseConfigured } from "@/lib/supabase/env";
import { updateSession } from "@/lib/supabase/session";

const PUBLIC_PATHS = ["/login", "/api/idle-logout"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function redirectWithCookies(request: NextRequest, path: string, response: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // لو Supabase لسه مش متظبط، نسيب الموقع يفتح ويعرض تعليمات الإعداد
  if (!isSupabaseConfigured) {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

  if (isPublic(pathname)) {
    return response;
  }

  const needsAuth =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api/submissions" ||
    pathname.startsWith("/api/submissions/");

  if (!needsAuth) {
    return response;
  }

  const isApi = pathname.startsWith("/api/");

  if (!user) {
    if (isApi) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    return redirectWithCookies(request, "/login", response);
  }

  // ===== فحص الخمول =====
  const lastActivity = Number(request.cookies.get("last_activity")?.value ?? 0);
  if (lastActivity > 0 && Date.now() - lastActivity > IDLE_MS) {
    if (isApi) {
      return NextResponse.json(
        { error: "انتهت الجلسة بسبب عدم النشاط" },
        { status: 401 }
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = "/api/idle-logout";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * كل المسارات ما عدا الملفات الثابتة
     */
    "/((?!_next/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
