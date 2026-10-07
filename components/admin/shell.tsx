"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  FileText,
  Home,
  Images,
  LayoutDashboard,
  LayoutList,
  Menu,
  Newspaper,
  X,
} from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { signOutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/homepage", label: "Homepage layout", icon: Home },
  { href: "/admin/content", label: "Page content", icon: FileText },
  { href: "/admin/navigation", label: "Menus", icon: LayoutList },
  { href: "/admin/stories", label: "Stories", icon: Newspaper },
  { href: "/admin/media", label: "Images", icon: Images },
];

export function AdminShell({
  user,
  children,
}: {
  user: { email: string; name: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col gap-1 p-4">
      <Link href="/admin" className="mb-6 flex items-center gap-3 px-2 pt-2">
        <Logo variant="light" className="h-9 w-auto" />
      </Link>
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-10 items-center gap-3 rounded-lg px-3 text-[0.9375rem] transition-colors",
              active ? "bg-limestone/12 font-semibold text-limestone" : "text-limestone/65 hover:bg-limestone/6 hover:text-limestone",
            )}
          >
            <item.icon className="size-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
      <a
        href="/"
        target="_blank"
        className="mt-2 flex h-10 items-center gap-3 rounded-lg px-3 text-[0.9375rem] text-limestone/65 hover:bg-limestone/6 hover:text-limestone"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        View site
      </a>
      <div className="mt-auto border-t border-limestone/10 px-2 pt-4">
        <p className="truncate text-[0.875rem] font-semibold text-limestone">{user.name || user.email}</p>
        <p className="truncate text-[0.75rem] text-limestone/50">
          {user.email} · Admin
        </p>
        <form action={signOutAction}>
          <button type="submit" className="mt-3 text-[0.8125rem] font-semibold text-olio hover:underline">
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh bg-limestone text-frantoio">
      <aside className="on-dark fixed inset-y-0 left-0 z-40 hidden w-64 bg-frantoio lg:block">{sidebar}</aside>

      <div className="sticky top-0 z-40 flex h-14 items-center justify-between bg-frantoio px-4 text-limestone lg:hidden">
        <Logo variant="light" className="h-8 w-auto" />
        <button type="button" onClick={() => setOpen(true)} className="flex size-10 items-center justify-center" aria-expanded={open}>
          <Menu className="size-5" aria-hidden="true" />
          <span className="sr-only">Open admin menu</span>
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-frantoio/50" onClick={() => setOpen(false)} />
          <aside className="on-dark absolute inset-y-0 left-0 w-72 bg-frantoio">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 flex size-10 items-center justify-center text-limestone"
            >
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Close admin menu</span>
            </button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">{children}</div>
      </main>
    </div>
  );
}
