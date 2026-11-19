"use client";

import Link from "next/link";
import { FIELD_GROUPS } from "@/lib/form-config";
import { getDeep } from "@/lib/utils";
import { formatDateTime, filenameFromFolderName } from "@/lib/utils";
import { JsonViewer } from "./json-viewer";
import { DownloadIcon, EditIcon, PrintIcon } from "./icons";

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <tr>
      <td className="report-label">{label}</td>
      <td className="report-value">{value?.trim() ? value : "—"}</td>
    </tr>
  );
}

function Section({
  title,
  number,
  children,
}: {
  title: string;
  number: number;
  children: React.ReactNode;
}) {
  return (
    <section className="report-section">
      <h3 className="report-section-title">
        <span className="report-section-badge">{number}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function SubmissionReport({
  id,
  folderName,
  createdAt,
  data,
}: {
  id: string;
  folderName: string;
  createdAt: string;
  data: Record<string, unknown>;
}) {
  const tx = (data.transaction_data ?? {}) as Record<string, unknown>;
  const asset = (tx.asset_details ?? {}) as Record<string, unknown>;
  const basic = (data.basic_data ?? {}) as Record<string, unknown>;
  const property = (data.property_data ?? {}) as Record<string, unknown>;
  const boundaries = (data.boundaries_and_lengths ?? {}) as Record<string, unknown>;
  const reminders = (data.reminders ?? []) as string[];

  function print() {
    window.print();
  }

  return (
    <div className="report-page">
      {/* Header */}
      <header className="report-header">
        <div className="report-header-row">
          <div>
            <div className="report-company">تقييم عقاري</div>
            <h1 className="report-title">تقرير التقييم العقاري</h1>
          </div>
          <div className="report-meta">
            <div>
              <span className="report-meta-label">اسم الفولدر</span>
              <span className="report-meta-value">{folderName}</span>
            </div>
            <div>
              <span className="report-meta-label">تاريخ الحفظ</span>
              <span className="report-meta-value">{formatDateTime(createdAt)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 1. بيانات العملية */}
      <Section title="بيانات العملية" number={1}>
        <table className="report-table">
          <tbody>
            {FIELD_GROUPS[0].fields.map((f) => (
              <Row
                key={f.key}
                label={f.label}
                value={String(getDeep(tx, [f.key]) ?? "")}
              />
            ))}
          </tbody>
        </table>
      </Section>

      {/* 2. تفاصيل الأصل */}
      <Section title="تفاصيل الأصل" number={2}>
        <table className="report-table">
          <tbody>
            {FIELD_GROUPS[1].fields.map((f) => (
              <Row
                key={f.key}
                label={f.label}
                value={String(getDeep(asset, [f.key]) ?? "")}
              />
            ))}
          </tbody>
        </table>
      </Section>

      {/* 3. البيانات الأساسية */}
      <Section title="البيانات الأساسية" number={3}>
        <table className="report-table">
          <tbody>
            {FIELD_GROUPS[2].fields.map((f) => (
              <Row
                key={f.key}
                label={f.label}
                value={String(getDeep(basic, [f.key]) ?? "")}
              />
            ))}
          </tbody>
        </table>
      </Section>

      {/* 4. بيانات العقار */}
      <Section title="بيانات العقار" number={4}>
        <table className="report-table">
          <tbody>
            {FIELD_GROUPS[3].fields.map((f) => (
              <Row
                key={f.key}
                label={f.label}
                value={String(getDeep(property, [f.key]) ?? "")}
              />
            ))}
          </tbody>
        </table>
      </Section>

      {/* 5. الحدود والأطوال */}
      <Section title="الحدود والأطوال" number={5}>
        <table className="report-table report-table-boundaries">
          <thead>
            <tr>
              <th>الحد</th>
              <th>الوصف</th>
              <th>الطول (م)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>شمال</td>
              <td>{String(boundaries.north_boundary ?? "") || "—"}</td>
              <td>{String(boundaries.north_length ?? "") || "—"}</td>
            </tr>
            <tr>
              <td>جنوب</td>
              <td>{String(boundaries.south_boundary ?? "") || "—"}</td>
              <td>{String(boundaries.south_length ?? "") || "—"}</td>
            </tr>
            <tr>
              <td>شرق</td>
              <td>{String(boundaries.east_boundary ?? "") || "—"}</td>
              <td>{String(boundaries.east_length ?? "") || "—"}</td>
            </tr>
            <tr>
              <td>غرب</td>
              <td>{String(boundaries.west_boundary ?? "") || "—"}</td>
              <td>{String(boundaries.west_length ?? "") || "—"}</td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* 6. التذكيرات */}
      <Section title="التذكيرات" number={6}>
        {reminders.filter((r) => r.trim()).length === 0 ? (
          <p className="report-empty">مفيش تذكيرات مضافة.</p>
        ) : (
          <ol className="report-reminders">
            {reminders
              .filter((r) => r.trim())
              .map((r, i) => (
                <li key={i}>{r}</li>
              ))}
          </ol>
        )}
      </Section>

      {/* Actions */}
      <div className="no-print report-actions">
        <button type="button" onClick={print} className="report-btn report-btn-primary">
          <PrintIcon className="h-4 w-4" />
          طباعة / حفظ كـ PDF
        </button>
        <Link
          href={`/admin/submissions/${id}/edit`}
          className="report-btn report-btn-secondary"
        >
          <EditIcon className="h-4 w-4" />
          تعديل
        </Link>
        <button
          type="button"
          onClick={() => {
            const blob = new Blob([JSON.stringify(data, null, 2)], {
              type: "application/json;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filenameFromFolderName(folderName);
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="report-btn report-btn-secondary"
        >
          <DownloadIcon className="h-4 w-4" />
          تحميل JSON
        </button>
      </div>

      {/* JSON قابل للطي (للمطورين/التصدير) */}
      <details className="no-print report-json-details">
        <summary className="report-json-summary">عرض JSON (للمطورين والتصدير)</summary>
        <JsonViewer data={data} filename={filenameFromFolderName(folderName)} />
      </details>
    </div>
  );
}
