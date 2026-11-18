import type { Metadata } from "next";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SetupNotice } from "@/components/setup-notice";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول | لوحة إدارة التقييمات",
};

export const dynamic = "force-dynamic";

export default function LoginPage() {
  if (!isSupabaseConfigured) {
    return <SetupNotice />;
  }
  return <LoginForm />;
}
