"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Link2,
  MousePointerClick,
  Trophy,
  Plus,
  X,
  Search,
} from "lucide-react";
import { getToken } from "../../lib/auth";
import { api } from "../../lib/api";
import Sidebar from "../../components/Sidebar";
import LinkForm from "../../components/LinkForm";
import LinkList from "../../components/LinkList";

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    loadLinks();
  }, [router]);

  async function loadLinks() {
    setLoading(true);
    setError("");
    try {
      const data = await api.listLinks();
      setLinks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCreated(newLink) {
    setLinks((prev) => [{ ...newLink, clickCount: 0 }, ...prev]);
    setShowForm(false);
  }

  const totalClicks = useMemo(
    () => links.reduce((sum, item) => sum + (item.clickCount ?? 0), 0),
    [links]
  );

  const topLink = useMemo(
    () => [...links].sort((a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0))[0],
    [links]
  );

  const topPerformers = useMemo(
    () => [...links].sort((a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0)).slice(0, 5),
    [links]
  );

  const filteredLinks = useMemo(() => {
    if (!query.trim()) return links;
    const q = query.trim().toLowerCase();
    return links.filter(
      (l) => l.code?.toLowerCase().includes(q) || l.url?.toLowerCase().includes(q)
    );
  }, [links, query]);

  return (
    <div className="min-h-screen bg-bg">
      <div className="lg:flex lg:min-h-screen">
        <Sidebar />

        <main className="flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur px-4 py-5 lg:px-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-text">Links</h1>
                <p className="text-muted text-sm mt-1">
                  {links.length
                    ? `${links.length} link${links.length === 1 ? "" : "s"} · ${totalClicks} clicks total`
                    : "Create your first short link"}
                </p>
              </div>
              <button
                onClick={() => setShowForm((v) => !v)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition-colors duration-150 hover:bg-accent/90"
              >
                {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {showForm ? "Close" : "New link"}
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-10 lg:py-8 space-y-6">
            {/* Create form — collapses in place, no layout jump elsewhere */}
            <AnimatePresence initial={false}>
              {showForm && (
                <motion.section
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl border border-border bg-panel p-6">
                    <h2 className="text-lg font-semibold text-text mb-1">Create a short link</h2>
                    <p className="text-muted text-sm mb-4">
                      Paste a long URL to get a short, shareable one.
                    </p>
                    <LinkForm onCreated={handleCreated} />
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Main grid: table-centric with a fixed insights rail */}
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              {/* Left: link table */}
              <div className="min-w-0 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by code or URL"
                      className="w-full rounded-xl border border-border bg-panel py-2.5 pl-9 pr-3 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-accent/50"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-panel overflow-hidden">
                  {loading ? (
                    <SkeletonList />
                  ) : error ? (
                    <p className="p-6 text-red-400 text-sm">{error}</p>
                  ) : filteredLinks.length === 0 ? (
                    <EmptyState hasQuery={!!query.trim()} />
                  ) : (
                    <LinkList links={filteredLinks} />
                  )}
                </div>
              </div>

              {/* Right: insights rail */}
              <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <InsightStat icon={Link2} label="Total links" value={links.length} />
                <InsightStat icon={MousePointerClick} label="Total clicks" value={totalClicks} />
                <InsightStat
                  icon={Trophy}
                  label="Best performer"
                  value={topLink ? `/${topLink.code}` : "—"}
                  sub={topLink ? `${topLink.clickCount ?? 0} clicks` : "No links yet"}
                />

                <div className="rounded-2xl border border-border bg-panel p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">Top links</p>
                  {topPerformers.length === 0 ? (
                    <p className="text-muted text-sm">Nothing to rank yet.</p>
                  ) : (
                    <ol className="space-y-3">
                      {topPerformers.map((link, i) => (
                        <li key={link.code} className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg text-[11px] text-muted">
                            {i + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm text-text">/{link.code}</span>
                          <span className="text-xs text-muted shrink-0">{link.clickCount ?? 0}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                <div className="rounded-2xl border border-border bg-panel p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">Tip</p>
                  <p className="text-sm text-text leading-relaxed">
                    Short, readable codes are easier to share out loud and remember.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function InsightStat({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-accent" />
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      </div>
      <p className="text-2xl font-semibold text-text truncate">{value}</p>
      {sub && <p className="text-muted text-xs mt-1">{sub}</p>}
    </div>
  );
}

function EmptyState({ hasQuery }) {
  return (
    <div className="py-16 text-center">
      <Link2 className="mx-auto h-7 w-7 text-muted mb-3" />
      <p className="text-text font-medium">{hasQuery ? "No matches" : "No links yet"}</p>
      <p className="text-muted text-sm mt-1">
        {hasQuery ? "Try a different search term." : 'Use "New link" above to create one.'}
      </p>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="divide-y divide-border">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="h-4 w-32 rounded bg-bg/80 animate-pulse" />
          <div className="h-4 flex-1 rounded bg-bg/60 animate-pulse" />
          <div className="h-4 w-10 rounded bg-bg/80 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
