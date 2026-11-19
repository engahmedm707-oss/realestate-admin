"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { inputClass } from "./fields";
import { CheckIcon, AlertIcon } from "./icons";

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (next.length < 8) {
      setError("كلمة السر يجب أن تكون ٨ أحرف على الأقل");
      return;
    }
    if (next !== confirm) {
      setError("كلمة السر الجديدة وتأكيدها غير متطابقين");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: next,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setCurrent("");
    setNext("");
    setConfirm("");
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>تم تغيير كلمة السر بنجاح.</span>
        </div>
      )}

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-semibold text-slate-700">
          كلمة السر الجديدة
        </span>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
          dir="ltr"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-semibold text-slate-700">
          تأكيد كلمة السر
        </span>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
          dir="ltr"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? "جاري التغيير..." : "تغيير كلمة السر"}
      </button>
    </form>
  );
}
