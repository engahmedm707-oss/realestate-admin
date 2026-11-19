import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { submissionSchema } from "@/lib/schema";

const BUCKET = "deeds";

function isDeedsUrl(url: string): boolean {
  return (
    !!url &&
    !url.startsWith("data:") &&
    url.includes(`/storage/v1/object/public/${BUCKET}/`)
  );
}

async function deleteStorageImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  url: string
): Promise<void> {
  if (!url || !isDeedsUrl(url)) return;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

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

export async function PUT(request: Request, { params }: Params) {
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

  // جلب السجل القديم (لحذف صورة قديمة إن تغيّرت)
  const { data: existing } = await supabase
    .from("submissions")
    .select("data")
    .eq("id", id)
    .maybeSingle();

  const oldImage = (existing?.data as { basic_data?: { deed_image?: string } } | null)
    ?.basic_data?.deed_image;

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

  const newImage = payload.basic_data.deed_image;

  const { error } = await supabase
    .from("submissions")
    .update({
      folder_name: payload.folder_name,
      data: payload,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: `اسم الفولدر "${payload.folder_name}" مستخدم بالفعل` },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // حذف الصورة القديمة إذا تغيّرت (وهي من Storage)
  if (oldImage && oldImage !== newImage && isDeedsUrl(oldImage)) {
    await deleteStorageImage(supabase, oldImage).catch(() => {
      /* ignore cleanup errors */
    });
  }

  return NextResponse.json({ ok: true });
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

  // جلب السجل لحذف صورته من Storage
  const { data: existing } = await supabase
    .from("submissions")
    .select("data")
    .eq("id", id)
    .maybeSingle();

  const imageUrl = (existing?.data as { basic_data?: { deed_image?: string } } | null)
    ?.basic_data?.deed_image;

  const { error } = await supabase.from("submissions").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // حذف الصورة من Storage (إن وُجدت)
  if (imageUrl && isDeedsUrl(imageUrl)) {
    await deleteStorageImage(supabase, imageUrl).catch(() => {
      /* ignore cleanup errors */
    });
  }

  return NextResponse.json({ ok: true });
}
