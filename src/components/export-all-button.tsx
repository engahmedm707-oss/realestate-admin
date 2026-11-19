"use client";

import { useState } from "react";
import { DownloadIcon } from "./icons";

export function ExportAllButton() {
  const [loading, setLoading] = useState(false);

  async function exportAll() {
    setLoading(true);
    try {
      const response = await fetch("/api/submissions");
      if (!response.ok) throw new Error("فشل الجلب");
      const payload = await response.json();
      const rows = payload.submissions ?? [];
      const json = JSON.stringify(rows.map((r: { data: unknown }) => r.data), null, 2);
      const blob = new Blob([json], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `submissions-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("مش قادر أصدّر السجلات — جرب تاني");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={exportAll}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
    >
      <DownloadIcon className="h-4 w-4" />
      {loading ? "جاري التصدير..." : "تصدير JSON"}
    </button>
  );
}
