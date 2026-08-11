"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  // Auth guard: if there's no token, bounce to login. This runs client-side
  // since we're reading localStorage, which doesn't exist during SSR.
  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    loadLinks();
  }, []);

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
    // Prepend the new link so it's visible immediately, without waiting
    // on a full refetch from the server.
    setLinks((prev) => [{ ...newLink, clickCount: 0 }, ...prev]);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-10 max-w-3xl">
        <h1 className="font-mono text-2xl font-semibold mb-1">Your links</h1>
        <p className="text-muted text-sm mb-8">
          Create a short link, click it, and watch the click count update.
        </p>

        <LinkForm onCreated={handleCreated} />

        {loading ? (
          <p className="text-muted font-mono text-sm">Loading...</p>
        ) : error ? (
          <p className="text-red-400 font-mono text-sm">{error}</p>
        ) : (
          <LinkList links={links} />
        )}
      </main>
    </div>
  );
}
