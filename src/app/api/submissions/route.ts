import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { submissionSchema } from "@/lib/schema";

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: "Supabase مش متظبط. راجع ملف SETUP.md" },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = submissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "فيه بيانات غير صحيحة",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  const payload = {
    ...parsed.data,
    reminders: parsed.data.reminders.filter((item) => item.trim().length > 0),
  };

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      folder_name: payload.folder_name,
      data: payload,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: `اسم الفولدر "${payload.folder_name}" مستخدم بالفعل` },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "غير مهيأ" }, { status: 503 });
  }

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
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ submissions: data ?? [] });
}
