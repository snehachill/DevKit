"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getUser } from "../lib/auth";

export default function Sidebar() {
  const router = useRouter();

  // We deliberately start with user = null on BOTH server and client, then
  // fill it in after mount via useEffect. This guarantees the very first
  // render matches on both sides (both show nothing), and the email pops
  // in a moment later on the client only - which avoids the hydration
  // mismatch entirely, since React only compares the FIRST render.
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-panel min-h-screen flex flex-col justify-between px-4 py-6">
      <div>
        <p className="font-mono text-accent text-sm tracking-widest uppercase mb-8 px-2">
          devkit
        </p>
        <nav className="space-y-1">
          <a
            href="/dashboard"
            className="block px-3 py-2 rounded-md text-sm font-mono bg-bg text-accent"
          >
            links
          </a>
          <span className="block px-3 py-2 rounded-md text-sm font-mono text-muted cursor-not-allowed">
            api tester (soon)
          </span>
        </nav>
      </div>

      <div className="px-2">
        {user && (
          <p className="text-xs text-muted font-mono mb-3 truncate">{user.email}</p>
        )}
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm font-mono text-muted hover:text-accent transition"
        >
          log out
        </button>
      </div>
    </aside>
  );
}
