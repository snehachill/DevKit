"use client";

import { useState } from "react";
import { api } from "../lib/api";

export default function LinkForm({ onCreated }) {
  const [longUrl, setLongUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const link = await api.createLink(longUrl);
      setLongUrl("");
      onCreated(link);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
      <input
        type="url"
        required
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        placeholder="https://example.com/some/very/long/path"
        className="flex-1 bg-panel border border-border rounded-md px-3 py-2 text-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-bg font-mono text-sm font-medium px-5 py-2 rounded-md hover:bg-accent/90 transition disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? "creating..." : "shorten"}
      </button>
      {error && <p className="text-sm text-red-400 font-mono self-center">{error}</p>}
    </form>
  );
}
