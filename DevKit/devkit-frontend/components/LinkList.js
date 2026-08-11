"use client";

import { API_URL } from "../lib/api";

export default function LinkList({ links }) {
  if (links.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-md py-16 text-center">
        <p className="text-muted font-mono text-sm">
          No links yet. Paste a URL above to create your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-md divide-y divide-border overflow-hidden">
      {links.map((link) => {
        const shortUrl = `${API_URL}/${link.code}`;
        return (
          <div
            key={link.code}
            className="flex items-center justify-between px-4 py-3 bg-panel hover:bg-panel/70 transition"
          >
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
              <p className="text-muted text-xs truncate mt-1 max-w-md">{link.longUrl}</p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="font-mono text-sm text-text">{link.clickCount ?? 0}</p>
              <p className="text-muted text-xs">clicks</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
