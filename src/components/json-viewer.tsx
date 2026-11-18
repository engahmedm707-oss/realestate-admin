"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, DownloadIcon } from "./icons";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlight(json: string) {
  const escaped = escapeHtml(json);
  return escaped.replace(
    /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let color = "text-amber-300";
      if (match.startsWith('"')) {
        color = match.trimEnd().endsWith(":")
          ? "text-sky-300"
          : "text-emerald-300";
      } else if (/^(true|false|null)$/.test(match)) {
        color = "text-fuchsia-300";
      }
      return `<span class="${color}">${match}</span>`;
    }
  );
}

export function JsonViewer({
  data,
  filename,
}: {
  data: unknown;
  filename: string;
}) {
  const [copied, setCopied] = useState(false);

  const json = JSON.stringify(data, null, 2);

  async function copy() {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="text-[11px] font-medium text-slate-400" dir="ltr">
          JSON
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition hover:bg-white/10"
          >
            {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
            {copied ? "اتنسخ" : "نسخ"}
          </button>
          <button
            type="button"
            onClick={download}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-brand-700"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            تحميل
          </button>
        </div>
      </div>
      <pre
        dir="ltr"
        className="max-h-[70vh] overflow-auto p-4 text-left text-[12px] leading-relaxed text-slate-200"
      >
        <code dangerouslySetInnerHTML={{ __html: highlight(json) }} />
      </pre>
    </div>
  );
}
