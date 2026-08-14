import Link from "next/link";
import { ArrowRight, Zap, BarChart3, History } from "lucide-react";
import TerminalDemo from "../components/TerminalDemo";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-border">
        <span className="flex items-center gap-2 text-text font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent text-sm font-mono">
            /
          </span>
          Devkit
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted transition-colors duration-150 hover:text-text px-3 py-2"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold bg-accent text-bg px-4 py-2.5 rounded-xl transition-colors duration-150 hover:bg-accent/90"
          >
            Create account
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 sm:px-10 py-20 sm:py-28 max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-accent text-xs font-mono tracking-widest uppercase mb-5">
            link shortening, done right
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6 text-text tracking-tight">
            Short links your
            <br />
            audience can trust
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-md mb-8 leading-relaxed">
            Create a short link in seconds, share it anywhere, and see exactly
            how it performs — clicks, top links, and trends, all in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-accent text-bg font-semibold px-6 py-3 rounded-xl transition-colors duration-150 hover:bg-accent/90"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="border border-border text-text px-6 py-3 rounded-xl transition-colors duration-150 hover:border-accent/50"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <TerminalDemo />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 sm:px-10 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-accent text-xs font-mono tracking-widest uppercase mb-3">
            Why Devkit
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-14 max-w-xl text-text tracking-tight">
            Everything you need, nothing you don't
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            <FeatureCard
              icon={Zap}
              title="Instant redirects"
              body="Your links resolve immediately, every time — no lag between a click and where it needs to go."
            />
            <FeatureCard
              icon={BarChart3}
              title="Real-time analytics"
              body="Watch clicks roll in as they happen and see which links are working best, at a glance."
            />
            <FeatureCard
              icon={History}
              title="Full link history"
              body="Every short link you've ever created, searchable and organized, so nothing gets lost."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 sm:px-10 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-accent text-xs font-mono tracking-widest uppercase mb-3">
            how it works
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-14 max-w-xl text-text tracking-tight">
            From long link to short link in three steps
          </h2>

          <ol className="space-y-6 max-w-2xl">
            <FlowStep n="1" text="Paste any URL you want to share." />
            <FlowStep n="2" text="Get a short, memorable link back instantly." />
            <FlowStep n="3" text="Share it anywhere and track every click from your dashboard." />
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 py-10 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted">Devkit</span>
        <span className="text-xs text-muted">&copy; {new Date().getFullYear()} Devkit. All rights reserved.</span>
      </footer>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, body }) {
  return (
    <div className="border border-border rounded-2xl p-6 bg-panel transition-colors duration-150 hover:border-accent/30">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="text-lg font-semibold mt-4 mb-2 text-text">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function FlowStep({ n, text }) {
  return (
    <li className="flex items-start gap-4">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-mono mt-0.5">
        {n}
      </span>
      <p className="text-text text-sm sm:text-base leading-relaxed">{text}</p>
    </li>
  );
}
