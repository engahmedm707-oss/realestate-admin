"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BuildingIcon, FolderIcon, PlusIcon, SettingsIcon } from "./icons";

const LINKS = [
  { href: "/admin", label: "لوحة التحكم", icon: BuildingIcon, exact: true },
  { href: "/admin/new", label: "تقييم جديد", icon: PlusIcon, exact: true },
  {
    href: "/admin/submissions",
    label: "السجلات المحفوظة",
    icon: FolderIcon,
    exact: false,
  },
  {
    href: "/admin/settings",
    label: "الإعدادات",
    icon: SettingsIcon,
    exact: true,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              active
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
