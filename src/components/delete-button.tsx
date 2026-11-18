"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "./icons";

export function DeleteButton({
  id,
  folderName,
  redirectTo,
  compact = false,
}: {
  id: string;
  folderName: string;
  redirectTo?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setError(null);
    const response = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? "فشل الحذف");
      return;
    }
    if (redirectTo) {
      router.push(redirectTo);
    }
    startTransition(() => router.refresh());
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-rose-700 disabled:opacity-60"
        >
          {pending ? "..." : "تأكيد الحذف"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          إلغاء
        </button>
        {error && <span className="text-[11px] text-rose-600">{error}</span>}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      title={`حذف "${folderName}"`}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 font-semibold text-rose-600 transition hover:bg-rose-100 ${
        compact ? "h-8 w-8 justify-center" : "px-3 py-1.5 text-xs"
      }`}
    >
      <TrashIcon className="h-4 w-4" />
      {!compact && "حذف"}
    </button>
  );
}
