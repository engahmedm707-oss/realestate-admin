import { notFound } from "next/navigation";
import { getSubmission } from "@/lib/data";
import { SubmissionForm } from "@/components/submission-form";
import type { Submission } from "@/lib/schema";

export const metadata = {
  title: "نسخ تقييم | لوحة الإدارة",
};

export default async function DuplicateSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getSubmission(id);

  if (!row) notFound();

  const initial: Submission = {
    ...row.data,
    folder_name: `${row.folder_name} - نسخة`,
  };

  return (
    <div className="mx-auto max-w-6xl">
      <SubmissionForm initialData={initial} mode="create" />
    </div>
  );
}
