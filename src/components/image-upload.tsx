"use client";

import { useRef, useState } from "react";
import { TrashIcon } from "./icons";

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let { width, height } = img;
        if (width > MAX) {
          height = Math.round(height * (MAX / width));
          width = MAX;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas unsupported"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => reject(new Error("invalid image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({
  value,
  onChange,
  label = "صورة الصك",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("يجب أن يكون الملف صورة (JPG/PNG/...)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("حجم الملف كبير — الحد الأقصى 10MB");
      return;
    }
    setProcessing(true);
    try {
      const dataUrl = await compressImage(file);
      onChange(dataUrl);
    } catch {
      setError("فشل معالجة الصورة — جرب صورة أخرى");
    } finally {
      setProcessing(false);
    }
  }

  const sizeKb = value ? Math.round(value.length / 1024) : 0;

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt={label}
            className="max-h-64 rounded-xl border border-slate-200 shadow-sm"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            title="حذف الصورة"
            className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition hover:bg-rose-700"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
          <div className="mt-1 text-[11px] text-slate-400">
            حجم مضغوط: ~{sizeKb} KB
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm font-medium text-slate-500 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-60"
        >
          {processing ? (
            <span>جاري المعالجة...</span>
          ) : (
            <>
              <span className="text-2xl">📷</span>
              <span>اضغط لاختيار صورة {label}</span>
              <span className="text-[11px] text-slate-400">
                JPG/PNG — يُضغط تلقائيًا (الحد 10MB)
              </span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && (
        <p className="text-xs font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
}
