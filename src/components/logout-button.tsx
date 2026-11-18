"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogoutIcon } from "./icons";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "last_activity=; path=/; max-age=0";
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
    >
      <LogoutIcon className="h-[18px] w-[18px]" />
      {loading ? "جاري الخروج..." : "تسجيل الخروج"}
    </button>
  );
}
