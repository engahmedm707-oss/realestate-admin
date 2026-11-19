import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-50 text-4xl font-extrabold text-brand-700">
          404
        </div>
        <h1 className="text-xl font-bold text-slate-900">الصفحة غير موجودة</h1>
        <p className="mt-2 text-sm text-slate-500">
          الرابط الذي بحثت عنه غير موجود أو تم نقله.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            <ArrowIcon className="h-4 w-4 rotate-180" />
            لوحة التحكم
          </Link>
          <Link
            href="/admin/submissions"
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            السجلات
          </Link>
        </div>
      </div>
    </div>
  );
}
