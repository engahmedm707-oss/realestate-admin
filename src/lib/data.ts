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

export type DashboardStats = {
  total: number;
  thisMonth: number;
  thisWeek: number;
  recent: SubmissionRow[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured) {
    return { total: 0, thisMonth: 0, thisWeek: 0, recent: [] };
  }

  const supabase = await createClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [totalRes, monthRes, weekRes] = await Promise.all([
    supabase.from("submissions").select("*", { count: "exact", head: true }),
    supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthStart),
    supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekStart),
  ]);

  const recent = (await listSubmissions()).slice(0, 5);

  return {
    total: totalRes.count ?? 0,
    thisMonth: monthRes.count ?? 0,
    thisWeek: weekRes.count ?? 0,
    recent,
  };
}
