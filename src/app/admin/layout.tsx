import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SetupNotice } from "@/components/setup-notice";
import { SidebarNav } from "@/components/sidebar-nav";
import { LogoutButton } from "@/components/logout-button";
import { IdleTimeout } from "@/components/idle-timeout";
import { BuildingIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured) {
    return <SetupNotice />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Sidebar */}
      <aside className="flex shrink-0 flex-col gap-6 bg-slate-900 p-4 lg:sticky lg:top-0 lg:h-screen lg:w-64">
        <div className="flex items-center gap-3 px-2 pt-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <BuildingIcon className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-bold text-white">التقييمات العقارية</div>
            <div className="text-[11px] text-slate-400">لوحة الإدارة</div>
          </div>
        </div>

        <SidebarNav />

        <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
          <div className="px-3 pb-1">
            <div className="text-[10px] text-slate-500">مسجّل الدخول بـ</div>
            <div className="truncate text-xs font-medium text-slate-300" dir="ltr">
              {user.email}
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-10">{children}</div>
      </main>

      <IdleTimeout />
    </div>
  );
}
