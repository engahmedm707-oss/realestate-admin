import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";
import type { Submission } from "./schema";

export type SubmissionRow = {
  id: string;
  folder_name: string;
  data: Submission;
  created_at: string;
};

export async function listSubmissions(q?: string): Promise<SubmissionRow[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  let query = supabase
    .from("submissions")
    .select("id, folder_name, data, created_at")
    .order("created_at", { ascending: false })
    .limit(300);

  const term = q?.trim();
  if (term) {
    query = query.ilike("folder_name", `%${term}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as SubmissionRow[];
}

export async function getSubmission(id: string): Promise<SubmissionRow | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("id, folder_name, data, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as SubmissionRow | null) ?? null;
}
