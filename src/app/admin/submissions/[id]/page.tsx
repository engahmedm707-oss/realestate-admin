import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubmission } from "@/lib/data";
import { filenameFromFolderName, formatDateTime } from "@/lib/utils";
import { JsonViewer } from "@/components/json-viewer";
import { DeleteButton } from "@/components/delete-button";
import { ArrowIcon, FolderIcon } from "@/components/icons";

export const metadata = {
  title: "عرض السجل | لوحة الإدارة",
};

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0">
      <span className="shrink-0 text-[12px] text-slate-500">{label}</span>
      <span className="text-left text-[13px] font-semibold text-slate-900">
        {value?.trim() ? value : "—"}
      </span>
    </div>
  );
}

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getSubmission(id);

  if (!row) notFound();

  const data = row.data ?? {};
  const transaction = data.transaction_data ?? {};
  const asset = transaction.asset_details ?? {};
  const basic = data.basic_data ?? {};
  const property = data.property_data ?? {};

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/submissions"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
        >
          <ArrowIcon className="h-3.5 w-3.5 rotate-180" />
          رجوع للسجلات
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <FolderIcon className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {row.folder_name}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500">
                {formatDateTime(row.created_at)}
              </p>
            </div>
          </div>

          <DeleteButton
            id={row.id}
            folderName={row.folder_name}
            redirectTo="/admin/submissions"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-sm font-bold text-slate-900">ملخص سريع</h2>
            <Row label="العميل" value={transaction.client} />
            <Row label="طالب التقرير" value={basic.report_requester} />
            <Row label="اسم المالك" value={basic.owner_name} />
            <Row label="الغرض من التقييم" value={transaction.valuation_purpose} />
            <Row label="أساس القيمة" value={transaction.basis_of_value} />
            <Row label="رقم التكليف" value={transaction.assignment_number} />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-sm font-bold text-slate-900">الأصل</h2>
            <Row label="المنطقة" value={asset.region} />
            <Row label="المدينة" value={asset.city} />
            <Row label="الحي" value={asset.district} />
            <Row label="التصنيف" value={asset.asset_classification} />
            <Row label="النوع" value={asset.asset_type} />
            <Row label="المساحة" value={asset.asset_area} />
            <Row label="المعاين" value={asset.inspector} />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-sm font-bold text-slate-900">العقار</h2>
            <Row label="متوقف؟" value={property.is_property_halted} />
            <Row
              label="نسبة الإنجاز"
              value={property.construction_completion_percentage}
            />
            <Row label="الشارع" value={property.street_name} />
            <Row label="الوحدة" value={property.unit_number} />
            <Row label="الدور" value={property.floor_number} />
            <Row
              label="داخل المخطط التنظيمي"
              value={property.is_in_regulatory_plan}
            />
          </section>
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              البيانات الكاملة (JSON)
            </h2>
            <span className="text-[11px] text-slate-400">
              نفس الصيغة اللي بتتحفظ في الداتابيز
            </span>
          </div>
          <JsonViewer
            data={row.data}
            filename={filenameFromFolderName(row.folder_name)}
          />
        </div>
      </div>
    </div>
  );
}
