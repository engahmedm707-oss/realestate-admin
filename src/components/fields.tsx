"use client";

import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-slate-100";

const errorClass = " border-rose-400 ring-2 ring-rose-100 focus:border-rose-500 focus:ring-rose-100";

function cls(error?: boolean) {
  return error ? inputClass + errorClass : inputClass;
}

export function Field({
  label,
  hint,
  required,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`block ${className}`}>
      <span className="mb-1.5 flex items-center gap-1 text-[13px] font-semibold text-slate-700">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  required,
  type = "text",
  className,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  type?: "text" | "number";
  className?: string;
  error?: boolean;
}) {
  return (
    <Field label={label} hint={hint} required={required} className={className}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cls(error)}
      />
    </Field>
  );
}

export function DateField({
  label,
  value,
  onChange,
  hint,
  className,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  className?: string;
  error?: boolean;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${cls(error)} [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
      />
    </Field>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
  className,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  hint?: string;
  className?: string;
  error?: boolean;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${cls(error)} cursor-pointer appearance-none bg-[length:16px] bg-[left_0.9rem_center] bg-no-repeat ps-9`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")",
        }}
      >
        {options.map((option, index) => (
          <option key={`${option}-${index}`} value={option}>
            {option === "" ? "— غير محدد —" : option}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 3,
  className,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  className?: string;
  error?: boolean;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${cls(error)} resize-y leading-relaxed`}
      />
    </Field>
  );
}
