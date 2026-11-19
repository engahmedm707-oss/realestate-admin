import Link from "next/link";
import { listSubmissions } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";
import { ExportAllButton } from "@/components/export-all-button";
import { DeleteButton } from "@/components/delete-button";
import { EyeIcon, FolderIcon, PlusIcon, SearchIcon, EditIcon } from "@/components/icons";

export const metadata = {
  title: "السجلات المحفوظة | لوحة الإدارة",
};

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const rows = await listSubmissions(q);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            السجلات المحفوظة
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {rows.length} سجل{q ? ` مطابق لـ "${q}"` : ""}
          </p>
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
        >
          <PlusIcon className="h-4 w-4" />
          تقييم جديد
        </Link>
      </div>

      <form action="/admin/submissions" className="mb-5 flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="ابحث باسم الفولدر..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-9 pl-3.5 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          بحث
        </button>
        <ExportAllButton />
      </form>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <FolderIcon className="h-7 w-7" />
          </span>
          <h2 className="text-base font-bold text-slate-800">
            {q ? "مفيش نتائج للبحث" : "لسه مفيش سجلات"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {q
              ? "جرّب كلمة بحث تانية أو امسح البحث."
              : "ابدأ بإضافة أول تقييم عقاري."}
          </p>
          {!q && (
            <Link
              href="/admin"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              <PlusIcon className="h-4 w-4" />
              أضف تقييم
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">اسم الفولدر</th>
                  <th className="px-4 py-3 font-semibold">العميل</th>
                  <th className="px-4 py-3 font-semibold">المالك</th>
                  <th className="px-4 py-3 font-semibold">تاريخ الحفظ</th>
                  <th className="px-4 py-3 font-semibold"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
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
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/submissions/${row.id}`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          <EyeIcon className="h-4 w-4" />
                          عرض
                        </Link>
                        <Link
                          href={`/admin/submissions/${row.id}/edit`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          <EditIcon className="h-4 w-4" />
                          تعديل
                        </Link>
                        <DeleteButton id={row.id} folderName={row.folder_name} compact />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
