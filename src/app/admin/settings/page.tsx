import { createClient } from "@/lib/supabase/server";
import { IDLE_MINUTES } from "@/lib/supabase/env";
import { ChangePasswordForm } from "@/components/change-password-form";
import { SignOutAllButton } from "@/components/sign-out-all-button";

export const metadata = {
  title: "الإعدادات | لوحة الإدارة",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          الإعدادات
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          إدارة حسابك وتفضيلات لوحة التحكم.
        </p>
      </div>

      {/* Account */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-slate-900">الحساب</h2>
        <div className="mb-5 rounded-xl bg-slate-50 px-4 py-3">
          <div className="text-[11px] font-medium text-slate-500">الإيميل</div>
          <div className="text-sm font-semibold text-slate-900" dir="ltr">
            {user?.email}
          </div>
        </div>

        <h3 className="mb-3 text-[13px] font-semibold text-slate-700">
          تغيير كلمة السر
        </h3>
        <ChangePasswordForm />
      </section>

      {/* Session */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-slate-900">الجلسة</h2>
        <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3">
          <div className="text-[11px] font-medium text-slate-500">
            مدة الخمول (تسجيل خروج تلقائي)
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {IDLE_MINUTES} دقيقة
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            للتغيير عدّل `NEXT_PUBLIC_IDLE_MINUTES` في `.env.local` وأعد تشغيل
            السيرفر.
          </div>
        </div>
        <SignOutAllButton />
      </section>

      {/* About */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-slate-900">حول النظام</h2>
        <p className="text-xs leading-relaxed text-slate-500">
          لوحة إدارة التقييمات العقارية — Next.js 16 + Supabase. البيانات تتحفظ
          في جدول <code className="rounded bg-slate-100 px-1">submissions</code>{" "}
          كـ JSONB بنفس شكل الـ JSON المطلوب.
        </p>
      </section>
    </div>
  );
}
