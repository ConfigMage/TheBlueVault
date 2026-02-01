"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, HardHat, Shirt, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hats", label: "Hats", icon: HardHat },
  { href: "/jerseys", label: "Jerseys", icon: Shirt },
];

export function MobileNav() {
  const pathname = usePathname();

  const getAddHref = () => {
    if (pathname === "/jerseys") return "/jerseys?add=true";
    return "/hats?add=true";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-white md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--muted-foreground)]"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <Link
          href={getAddHref()}
          className="flex flex-col items-center gap-1 px-3 py-2 text-xs text-[var(--primary)]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white">
            <Plus className="h-6 w-6" />
          </div>
        </Link>
      </div>
    </nav>
  );
}
