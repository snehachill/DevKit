"use client";

import { API_URL } from "../lib/api";

export default function LinkList({ links }) {
  if (links.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-3xl py-16 text-center bg-panel">
        <p className="text-muted font-mono text-sm">
          No links yet. Paste a URL above to create your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {links.map((link) => {
        const shortUrl = `${API_URL}/${link.code}`;
        return (
          <div
            key={link.code}
            className="rounded-[24px] border border-border bg-panel p-4 transition hover:bg-panel/80"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-accent text-sm hover:underline"
                >
                  /{link.code}
                  <span className="caret" />
                </a>
                <p className="text-muted text-xs truncate mt-2">{link.longUrl}</p>
              </div>

              <div className="flex flex-row flex-wrap items-center gap-2 text-right">
                <span className="rounded-full border border-border bg-bg/70 px-3 py-1 text-xs font-mono text-muted">
                  {link.clickCount ?? 0} clicks
                </span>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-muted hover:text-accent"
                >
                  open
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
