import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";
import {
  PlusIcon,
  FolderIcon,
  BuildingIcon,
} from "@/components/icons";

export const metadata = {
  title: "لوحة التحكم | لوحة الإدارة",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const stats = await getDashboardStats();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "صباح الخير";
    if (h < 18) return "مساء الخير";
    return "مساء الخير";
  })();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {greeting} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            مسجّل بـ <span dir="ltr">{user?.email}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/new"
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
          >
            <PlusIcon className="h-4 w-4" />
            تقييم جديد
          </Link>
          <Link
            href="/admin/submissions"
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FolderIcon className="h-4 w-4" />
            السجلات
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي التقييمات" value={stats.total} accent="brand" />
        <StatCard label="هذا الشهر" value={stats.thisMonth} accent="sky" />
        <StatCard label="آخر ٧ أيام" value={stats.thisWeek} accent="emerald" />
      </div>

      {/* Recent */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">آخر التقييمات</h2>
          <Link
            href="/admin/submissions"
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            عرض الكل →
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-500">لسه مفيش تقييمات.</p>
            <Link
              href="/admin/new"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              <PlusIcon className="h-4 w-4" />
              أضف أول تقييم
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">اسم الفولدر</th>
                  <th className="px-4 py-3 font-semibold">العميل</th>
                  <th className="px-4 py-3 font-semibold">المالك</th>
                  <th className="px-4 py-3 font-semibold">التاريخ</th>
                  <th className="px-4 py-3 font-semibold"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recent.map((row) => (
                  <tr key={row.id} className="transition hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/submissions/${row.id}`}
                        className="font-semibold text-slate-900 hover:text-brand-700"
                      >
                        {row.folder_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.data?.basic_data?.customer_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.data?.basic_data?.owner_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDateTime(row.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/submissions/${row.id}`}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        عرض
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Quick tips */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-5">
        <h2 className="text-sm font-bold text-slate-900">اختصارات سريعة</h2>
        <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
          <li>• لتغيير مدة الجلسة (دقيقتين افتراضيًا): عدّل `NEXT_PUBLIC_IDLE_MINUTES` في `.env.local`.</li>
          <li>• لتعديل القوايم (نوع الأصل، الغرض، ...): `src/lib/options.ts`.</li>
          <li>• لتصدير كل السجلات: صفحة السجلات → «تصدير JSON».</li>
          <li>• لطباعة/تصدير PDF: افتح أي سجل → «طباعة / حفظ كـ PDF».</li>
        </ul>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "brand" | "sky" | "emerald";
}) {
  const colors = {
    brand: "bg-brand-50 text-brand-700",
    sky: "bg-sky-50 text-sky-700",
    emerald: "bg-emerald-50 text-emerald-700",
  }[accent];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${colors}`}>
        <BuildingIcon className="h-4 w-4" />
      </div>
      <div className="text-3xl font-extrabold tracking-tight text-slate-900">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium text-slate-500">{label}</div>
    </div>
  );
}
