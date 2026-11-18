"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { makeEmptySubmission, submissionSchema, type Submission } from "@/lib/schema";
import { getDeep, mergeDeep, setDeep } from "@/lib/utils";
import { FIELD_GROUPS } from "@/lib/form-config";
import {
  DateField,
  SelectField,
  TextField,
  TextareaField,
  inputClass,
} from "./fields";
import { RemindersEditor } from "./reminders-editor";
import {
  AlertIcon,
  CheckIcon,
  ChevronIcon,
  EyeIcon,
  SaveIcon,
} from "./icons";

const DRAFT_KEY = "realestate-admin:draft";

type Issue = { path: string; message: string };

export function SubmissionForm() {
  const [data, setData] = useState<Submission>(() => makeEmptySubmission());
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(FIELD_GROUPS.map((group) => [group.id, true]))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  // استرجاع المسودة
  useEffect(() => {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      // مسودة فاضية = مفيش حاجة تستحق الاسترجاع
      if (raw === JSON.stringify(makeEmptySubmission())) return;
      const parsed = JSON.parse(raw);
      setData((current) => mergeDeep(current, parsed));
      setDraftRestored(true);
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  // حفظ المسودة تلقائيًا
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      } catch {
        /* المساحة اتملّت — مش مشكلة */
      }
    }, 600);
    return () => window.clearTimeout(timer);
  }, [data]);

  function setValue(path: string[], value: string) {
    setData((current) => setDeep(current, path, value));
    setIssues((current) => current.filter((issue) => issue.path !== path.join(".")));
  }

  function discardDraft() {
    if (!window.confirm("هتمسح كل البيانات المكتوبة والمسودة. متأكد؟")) return;
    window.localStorage.removeItem(DRAFT_KEY);
    setData(makeEmptySubmission());
    setDraftRestored(false);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIssues([]);
    setSavedId(null);

    const parsed = submissionSchema.safeParse(data);
    if (!parsed.success) {
      setIssues(
        parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }))
      );
      document.getElementById("form-top")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload.error ?? "حصلت مشكلة أثناء الحفظ");
        if (Array.isArray(payload.issues)) setIssues(payload.issues);
        setSaving(false);
        return;
      }

      window.localStorage.removeItem(DRAFT_KEY);
      setData(makeEmptySubmission());
      setDraftRestored(false);
      setSavedId(payload.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("مش قادر أوصل للسيرفر — اتأكد من النت وجرب تاني");
    } finally {
      setSaving(false);
    }
  }

  const issuePaths = new Set(issues.map((issue) => issue.path));

  return (
    <form onSubmit={onSubmit} id="form-top" className="pb-28">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          تقييم عقاري جديد
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          املأ البيانات ثم اضغط حفظ — السجل بيتخزن بنفس صيغة الـ JSON المطلوبة.
        </p>
      </div>

      {/* Saved */}
      {savedId && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
              <CheckIcon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-emerald-900">تم الحفظ بنجاح</div>
              <div className="text-xs text-emerald-700">
                السجل اتحفظ في قاعدة البيانات.
              </div>
            </div>
          </div>
          <Link
            href={`/admin/submissions/${savedId}`}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <EyeIcon className="h-4 w-4" />
            عرض السجل
          </Link>
        </div>
      )}

      {/* Errors */}
      {(error || issues.length > 0) && (
        <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-800">
            <AlertIcon className="h-4 w-4" />
            {error ?? "راجع الحقول دي:"}
          </div>
          {issues.length > 0 && (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-rose-700">
              {issues.map((issue) => (
                <li key={issue.path}>{issue.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Draft */}
      {draftRestored && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm text-sky-800">
          <span>تم استرجاع مسودة غير محفوظة كنت بتكتبها قبل كده.</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDraftRestored(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-sky-100"
            >
              تمام
            </button>
            <button
              type="button"
              onClick={discardDraft}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
            >
              امسح المسودة
            </button>
          </div>
        </div>
      )}

      {/* Folder name */}
      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
              اسم الفولدر <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={data.folder_name}
              onChange={(e) => setValue(["folder_name"], e.target.value)}
              placeholder="مثال: تقييم - فيلا الرياض - 2026/1234"
              className={inputClass}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              ده المفتاح الأساسي للسجل — لازم يكون مختلف عن أي سجل تاني.
            </p>
          </div>
        </div>
      </section>

      {/* Groups */}
      {FIELD_GROUPS.map((group, groupIndex) => {
        const isOpen = open[group.id];

        return (
          <section
            key={group.id}
            className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() =>
                setOpen((current) => ({ ...current, [group.id]: !current[group.id] }))
              }
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">
                  {groupIndex + 1}
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{group.title}</div>
                  {group.subtitle && (
                    <div className="text-[11px] text-slate-400">{group.subtitle}</div>
                  )}
                </div>
              </div>
              <ChevronIcon
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="grid grid-cols-1 gap-4 border-t border-slate-100 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.fields.map((field) => {
                  const path = [...group.path, field.key];
                  const key = path.join(".");
                  const common = {
                    label: field.label,
                    value: getDeep(data, path),
                    onChange: (next: string) => setValue(path, next),
                    className: field.full ? "sm:col-span-2 lg:col-span-3" : "",
                    error: issuePaths.has(key),
                  };

                  if (field.type === "select") {
                    return (
                      <SelectField
                        key={key}
                        {...common}
                        options={field.options ?? []}
                      />
                    );
                  }
                  if (field.type === "date") {
                    return <DateField key={key} {...common} />;
                  }
                  if (field.type === "textarea") {
                    return <TextareaField key={key} {...common} />;
                  }
                  return (
                    <TextField
                      key={key}
                      {...common}
                      placeholder={field.placeholder}
                      type={field.type === "number" ? "number" : "text"}
                    />
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      {/* Reminders */}
      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">
            {FIELD_GROUPS.length + 1}
          </span>
          <div>
            <div className="text-sm font-bold text-slate-900">التذكيرات</div>
            <div className="text-[11px] text-slate-400">
              أي ملاحظات أو متابعات لازم تتحفظ مع التقييم
            </div>
          </div>
        </div>
        <RemindersEditor
          value={data.reminders}
          onChange={(next) => setData((current) => ({ ...current, reminders: next }))}
        />
      </section>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <span className="hidden text-[11px] text-slate-400 sm:block">
            المسودة بتتحفظ تلقائيًا على الجهاز
          </span>
          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            <button
              type="button"
              onClick={discardDraft}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              تفريغ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SaveIcon className="h-4 w-4" />
              {saving ? "جاري الحفظ..." : "حفظ التقييم"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
