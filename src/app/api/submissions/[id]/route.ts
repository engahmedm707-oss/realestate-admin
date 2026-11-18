import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "غير مهيأ" }, { status: 503 });
  }

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("id, folder_name, data, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "غير مهيأ" }, { status: 503 });
  }

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { error } = await supabase.from("submissions").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
