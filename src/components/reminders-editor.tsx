"use client";

import { PlusIcon, TrashIcon } from "./icons";
import { inputClass } from "./fields";

export function RemindersEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  function update(index: number, text: string) {
    const next = [...value];
    next[index] = text;
    onChange(next);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...value, ""]);
  }

  return (
    <div className="space-y-2.5">
      {value.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-400">
          مفيش تذكيرات مضافة.
        </p>
      )}

      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">
            {index + 1}
          </span>
          <input
            type="text"
            value={item}
            onChange={(e) => update(index, e.target.value)}
            placeholder="اكتب نص التذكير..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            title="حذف التذكير"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 rounded-xl border border-dashed border-brand-300 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:border-brand-500 hover:bg-brand-50"
      >
        <PlusIcon className="h-4 w-4" />
        إضافة تذكير
      </button>
    </div>
  );
}
