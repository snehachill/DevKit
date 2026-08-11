# DevKit Backend

Auth + URL shortener with Redis caching and async click analytics via BullMQ.

## Why two separate processes?

- `npm run dev` — the API server. Handles auth, creating links, and the
  public redirect endpoint. This must respond fast, so it never does slow
  work (like geo-IP lookups) inline.
- `npm run worker` — a separate, always-running process that consumes the
  click-logging queue. This is why deployment needs Railway/Render (a host
  that keeps processes running) rather than Vercel (serverless, spins up
  per-request only).

Run both at once locally, in two terminals.

## Setup

```bash
npm install
cp .env.example .env
# fill in MONGO_URI (MongoDB Atlas) and REDIS_URL (Upstash) in .env
```

## Run

```bash
npm run dev      # terminal 1: API server on http://localhost:5000
npm run worker   # terminal 2: background worker
```

## Try it

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"test1234","name":"You"}'
# -> copy the "token" from the response

# Create a short link (replace TOKEN)
curl -X POST http://localhost:5000/api/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"longUrl":"https://example.com/some/very/long/path"}'
# -> returns { code, shortUrl, ... }

# Visit the short link in a browser, or:
curl -iL http://localhost:5000/<code>
```

Watch the worker terminal — a few moments after you hit the redirect,
you'll see `[worker] logged click for <code>` printed, proving the click
was logged asynchronously, after the redirect already happened.

## Concept map (code -> story)

| Story element         | Code                                      |
|------------------------|--------------------------------------------|
| Permanent logbook       | MongoDB (`src/models/Link.js`, `Click.js`) |
| Whiteboard cache         | Redis (`src/config/redis.js`)             |
| Handing over keys instantly | `res.redirect(302, longUrl)` in `links.js` |
| Notepad for later        | BullMQ queue (`src/queue/clickQueue.js`)  |
| Paperwork assistant      | `worker.js`                                |
