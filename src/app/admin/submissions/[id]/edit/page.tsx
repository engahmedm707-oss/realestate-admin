import { notFound } from "next/navigation";
import { getSubmission } from "@/lib/data";
import { SubmissionForm } from "@/components/submission-form";

export const metadata = {
  title: "تعديل التقييم | لوحة الإدارة",
};

export default async function EditSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getSubmission(id);

  if (!row) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <SubmissionForm
        initialData={row.data}
        recordId={row.id}
        mode="edit"
      />
    </div>
  );
}
