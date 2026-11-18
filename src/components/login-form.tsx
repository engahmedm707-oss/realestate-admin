"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IDLE_MINUTES } from "@/lib/supabase/env";
import { BuildingIcon, AlertIcon } from "@/components/icons";
import { inputClass } from "@/components/fields";

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "الإيميل أو كلمة السر غلط",
  "Email not confirmed": "الإيميل لسه مش متأكد — فعّل Confirm email أو أكّد اليوزر من Supabase",
  "Too many requests": "محاولات كتير — استنى شوية وجرب تاني",
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("reason");
    if (reason === "idle") {
      setNotice(
        `تم تسجيل خروجك تلقائيًا لأنك كنت غير نشط لمدة ${IDLE_MINUTES} دقيقة.`
      );
    }
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(ERROR_MESSAGES[signInError.message] ?? signInError.message);
      setLoading(false);
      return;
    }

    document.cookie = `last_activity=${Date.now()}; path=/; max-age=86400; samesite=lax`;
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-brand-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
            <BuildingIcon className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-bold text-slate-900">لوحة إدارة التقييمات</h1>
          <p className="mt-1 text-sm text-slate-500">سجّل دخولك للمتابعة</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50"
        >
          {notice && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {notice}
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-slate-700">
                الإيميل
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className={inputClass}
                dir="ltr"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-slate-700">
                كلمة السر
              </span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                dir="ltr"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:ring-4 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-400">
            الجلسة بتتقفل تلقائيًا بعد {IDLE_MINUTES} دقيقة من عدم النشاط.
          </p>
        </form>
      </div>
    </div>
  );
}
