"use client";

import { useEffect, useState } from "react";

// This mock terminal is the page's signature element. Instead of a generic
// hero graphic, it shows the ACTUAL request flow the product performs -
// cache check, redirect, async queue, worker log - so the hero is a thesis
// about what the product does, not decoration.
const STEPS = [
  { text: "$ GET /x7Yq2", tone: "text" },
  { text: "checking cache...", tone: "muted" },
  { text: "cache hit (0.4ms)", tone: "accent" },
  { text: "302 -> redirecting", tone: "text" },
  { text: "queued click-log job", tone: "muted" },
  { text: "[worker] logged click for x7Yq2", tone: "accent" },
];

export default function TerminalDemo() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let i = 0;
    let timeout;

    function tick() {
      i += 1;
      setVisibleCount(i);

      if (i < STEPS.length) {
        timeout = setTimeout(tick, 550);
      } else {
        // Hold the full output on screen, then reset and loop.
        timeout = setTimeout(() => {
          setVisibleCount(0);
          timeout = setTimeout(tick, 500);
        }, 1800);
      }
    }

    timeout = setTimeout(tick, 400);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full max-w-md bg-panel border border-border rounded-lg overflow-hidden shadow-2xl shadow-black/40">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
        <span className="w-2.5 h-2.5 rounded-full bg-[#3a3f4b]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3a3f4b]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3a3f4b]" />
        <span className="ml-2 text-xs text-muted font-mono">redirect.log</span>
      </div>
      <div className="p-4 font-mono text-sm space-y-1.5 min-h-[190px]">
        {STEPS.slice(0, visibleCount).map((step, idx) => (
          <p
            key={idx}
            className={
              step.tone === "accent"
                ? "text-accent"
                : step.tone === "muted"
                ? "text-muted"
                : "text-text"
            }
          >
            {step.text}
          </p>
        ))}
        {visibleCount > 0 && visibleCount < STEPS.length && (
          <span className="caret" />
        )}
      </div>
    </div>
  );
}