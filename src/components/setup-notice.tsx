import { AlertIcon } from "./icons";

export function SetupNotice() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center p-6">
      <div className="w-full rounded-2xl border border-amber-200 bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <AlertIcon className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-bold text-slate-900">
            لسه محتاج نوصّل Supabase
          </h1>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          الموقع شغال، بس محتاج مفتاح الاتصال بقاعدة البيانات. اعمل الخطوات دي في
          مشروعك على Supabase بعدين ارجع هنا:
        </p>

        <ol className="mb-5 space-y-2 text-sm text-slate-700">
          <li className="rounded-lg bg-slate-50 px-3 py-2">
            <b>1.</b> Supabase → Settings → API
          </li>
          <li className="rounded-lg bg-slate-50 px-3 py-2">
            <b>2.</b> انسخ <code className="rounded bg-slate-200 px-1">Project URL</code> و{" "}
            <code className="rounded bg-slate-200 px-1">anon public key</code>
          </li>
          <li className="rounded-lg bg-slate-50 px-3 py-2">
            <b>3.</b> اعمل ملف <code className="rounded bg-slate-200 px-1">.env.local</code>{" "}
            جوه المشروع وحط فيهم القيمتين
          </li>
          <li className="rounded-lg bg-slate-50 px-3 py-2">
            <b>4.</b> شغّل الـ SQL الموجود في <code className="rounded bg-slate-200 px-1">SETUP.md</code>{" "}
            في SQL Editor
          </li>
          <li className="rounded-lg bg-slate-50 px-3 py-2">
            <b>5.</b> أعد تشغيل السيرفر: <code className="rounded bg-slate-200 px-1">npm run dev</code>
          </li>
        </ol>

        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100" dir="ltr">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...`}
        </pre>
      </div>
    </div>
  );
}
