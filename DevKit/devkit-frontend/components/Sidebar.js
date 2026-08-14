"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Link2, Wrench, LogOut } from "lucide-react";
import { clearSession, getUser } from "../lib/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Links", icon: Link2, enabled: true },
  { href: "#", label: "API tester", icon: Wrench, enabled: false },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  const initial = user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <aside className="w-full lg:w-64 border-b border-border lg:border-b-0 lg:border-r bg-panel px-4 py-5 lg:flex lg:h-screen lg:flex-col lg:px-4 lg:py-6">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <Link2 className="h-4 w-4" />
        </span>
        <span className="text-text font-semibold tracking-tight">devkit</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-row gap-1.5 lg:flex-col lg:flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.enabled && pathname === item.href;

          if (!item.enabled) {
            return (
              <span
                key={item.label}
                className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted/50 cursor-not-allowed lg:flex-none"
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                <span className="text-[10px] uppercase tracking-wide text-muted/50">soon</span>
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150 lg:flex-none",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-bg hover:text-text",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="mt-8 border-t border-border pt-4 lg:mt-0">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2 mb-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg text-xs font-semibold text-text">
            {initial}
          </span>
          <span className="min-w-0 flex-1 truncate text-xs text-muted">
            {user?.email ?? "…"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors duration-150 hover:bg-bg hover:text-text"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
