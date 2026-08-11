import Link from "next/link";
import TerminalDemo from "../components/TerminalDemo";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-border">
        <span className="font-mono text-accent text-sm tracking-widest uppercase">
          devkit
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="font-mono text-sm text-muted hover:text-text transition"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="font-mono text-sm bg-accent text-bg px-4 py-2 rounded-md hover:bg-accent/90 transition"
          >
            Create account
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 sm:px-10 py-20 sm:py-28 max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p className="font-mono text-accent text-xs tracking-widest uppercase mb-5">
            for developers, by design
          </p>
          <h1 className="font-mono text-4xl sm:text-5xl font-semibold leading-tight mb-6">
            Short links that
            <br />
            show their work
            <span className="caret" />
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-md mb-8 leading-relaxed">
            Every redirect hits cache first, responds instantly, then logs the
            click asynchronously in the background. Nothing hidden — watch
            the whole pipeline run in real time.
          </p>
          <div className="flex gap-4">
            <Link
              href="/register"
              className="bg-accent text-bg font-mono font-medium px-6 py-3 rounded-md hover:bg-accent/90 transition"
            >
              Start for free
            </Link>
            <Link
              href="/login"
              className="border border-border text-text font-mono px-6 py-3 rounded-md hover:border-accent transition"
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
          <p className="font-mono text-accent text-xs tracking-widest uppercase mb-3">
            built to be inspected
          </p>
          <h2 className="font-mono text-2xl sm:text-3xl font-semibold mb-14 max-w-xl">
            Three pieces, one pipeline
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            <FeatureCard
              label="01"
              title="Redis cache"
              body="Short codes resolve from an in-memory cache before ever touching the database, so redirects stay fast under load."
            />
            <FeatureCard
              label="02"
              title="Async logging"
              body="Click analytics are pushed onto a queue and written by a background worker — never on the critical path of a redirect."
            />
            <FeatureCard
              label="03"
              title="API tester"
              body="A built-in request builder for testing your own endpoints, with saved collections and environment variables. Coming soon."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 sm:px-10 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-accent text-xs tracking-widest uppercase mb-3">
            the redirect flow
          </p>
          <h2 className="font-mono text-2xl sm:text-3xl font-semibold mb-14 max-w-xl">
            What happens when someone clicks
          </h2>

          <ol className="space-y-6 max-w-2xl">
            <FlowStep n="1" text="Visitor requests your short link." />
            <FlowStep n="2" text="Backend checks Redis for the destination URL." />
            <FlowStep n="3" text="Cache hit or not, the visitor is redirected immediately." />
            <FlowStep n="4" text="A click-logging job is pushed onto a queue — after the response is already sent." />
            <FlowStep n="5" text="A separate worker process picks up the job and writes analytics to the database." />
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 py-10 border-t border-border flex items-center justify-between">
        <span className="font-mono text-xs text-muted">devkit</span>
        <span className="font-mono text-xs text-muted">
          built with next.js, redis, and bullmq
        </span>
      </footer>
    </main>
  );
}

function FeatureCard({ label, title, body }) {
  return (
    <div className="border border-border rounded-lg p-6 bg-panel">
      <span className="font-mono text-xs text-accentDim">{label}</span>
      <h3 className="font-mono text-lg font-medium mt-3 mb-2">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function FlowStep({ n, text }) {
  return (
    <li className="flex items-start gap-4">
      <span className="font-mono text-accent text-sm mt-0.5 shrink-0">{n}</span>
      <p className="text-text text-sm sm:text-base leading-relaxed">{text}</p>
    </li>
  );
}
