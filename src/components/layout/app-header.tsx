"use client";

import { usePathname } from "next/navigation";
import { UserMenu } from "@/features/auth/user-menu";
import { MobileNav } from "./mobile-nav";
import { mainNavItems } from "./nav-items";

function pageTitle(pathname: string) {
  const match = mainNavItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.label ?? "Doctor Tracker";
}

export function AppHeader() {
  const pathname = usePathname() ?? "";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <h1 className="text-lg font-semibold text-foreground md:text-xl">
            {pageTitle(pathname)}
          </h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Healthcare admin workspace
          </p>
        </div>
      </div>
      <UserMenu />
    </header>
  );
}
