"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogoutIcon } from "./icons";

export function SignOutAllButton() {
  const [loading, setLoading] = useState(false);

  async function signOutAll() {
    if (!window.confirm("سنسجّل خروجك من جميع الأجهزة. متأكد؟")) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "global" });
    document.cookie = "last_activity=; path=/; max-age=0";
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={signOutAll}
      disabled={loading}
      className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
    >
      {loading ? "جاري..." : "تسجيل خروج من جميع الأجهزة"}
    </button>
  );
}
