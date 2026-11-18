export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/**
 * Supabase بقى فيه نوعين من المفاتيح:
 *  - الجديد: publishable key (sb_publishable_...)  ← اللي بنستخدمه
 *  - القديم: anon key (eyJ...)                      ← لسه مدعوم
 */
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

/** هل الإعدادات موجودة؟ لو لأ، بنعرض شاشة تعليمات بدل ما الموقع يقع. */
export const isSupabaseConfigured =
  SUPABASE_URL.startsWith("http") && SUPABASE_KEY.length > 20;

/** مدة الخمول بالمللي ثانية (افتراضي دقيقتين) */
export const IDLE_MS =
  Math.max(1, Number(process.env.NEXT_PUBLIC_IDLE_MINUTES ?? 2)) * 60_000;

export const IDLE_MINUTES = Math.round(IDLE_MS / 60_000);
