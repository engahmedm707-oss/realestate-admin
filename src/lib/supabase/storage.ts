"use client";

import { createClient } from "./client";

const BUCKET = "deeds";

/**
 * يرفع صورة مضغوطة إلى Supabase Storage ويُرجع public URL.
 * @param blob - الصورة المضغوطة (Blob)
 * @returns public URL of the uploaded file
 */
export async function uploadDeedImage(blob: Blob): Promise<string> {
  const supabase = createClient();
  const ext = blob.type === "image/png" ? "png" : "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message || "فشل رفع الصورة");
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * يحذف صورة من Storage given its public URL.
 * يتجاهل base64 data URLs و URLs غير تابعة لـ bucket.
 */
export async function deleteDeedImage(url: string): Promise<void> {
  if (!url || url.startsWith("data:")) return;

  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;

  const path = url.slice(idx + marker.length);
  if (!path) return;

  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}

/**
 * يتحقق من أن URL ينتمي إلى bucket deeds (للتأكد قبل الحذف).
 */
export function isDeedsUrl(url: string): boolean {
  return (
    !!url &&
    !url.startsWith("data:") &&
    url.includes(`/storage/v1/object/public/${BUCKET}/`)
  );
}
