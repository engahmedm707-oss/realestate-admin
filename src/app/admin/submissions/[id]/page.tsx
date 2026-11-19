import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubmission } from "@/lib/data";
import { filenameFromFolderName } from "@/lib/utils";
import { SubmissionReport } from "@/components/submission-report";
import { DeleteButton } from "@/components/delete-button";
import { ArrowIcon, FolderIcon, EditIcon } from "@/components/icons";

export const metadata = {
  title: "عرض السجل | لوحة الإدارة",
};

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getSubmission(id);

  if (!row) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/submissions"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
          >
            <ArrowIcon className="h-3.5 w-3.5 rotate-180" />
            رجوع للسجلات
          </Link>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <FolderIcon className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {row.folder_name}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500">
                سجل تقييم عقاري
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/submissions/${row.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <EditIcon className="h-4 w-4" />
            تعديل
          </Link>
          <DeleteButton
            id={row.id}
            folderName={row.folder_name}
            redirectTo="/admin/submissions"
          />
        </div>
      </div>

      <SubmissionReport
        id={row.id}
        folderName={row.folder_name}
        createdAt={row.created_at}
        data={row.data as Record<string, unknown>}
      />
    </div>
  );
}
