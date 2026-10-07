import Link from "next/link";

import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="on-dark relative hidden overflow-hidden bg-frantoio lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/product-line/img-22.webp" alt="" className="absolute inset-0 size-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-frantoio via-frantoio/30" />
        <div className="absolute bottom-12 left-12 max-w-sm text-limestone">
          <Logo variant="light" className="h-12 w-auto" />
          <p className="mt-6 font-display text-[2rem] leading-tight">Manage the site&apos;s pages, menus, stories and images.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-10 inline-block lg:hidden">
            <Logo className="h-10 w-auto" />
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
