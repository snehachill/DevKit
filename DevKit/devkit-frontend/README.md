# DevKit Frontend

Next.js app for the URL shortener — register, log in, create short links,
and see click counts. Talks to the devkit-backend API.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

`.env.local` should point at your running backend:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Run

Make sure the backend (`devkit-backend`) is already running on port 5000
first, then:

```bash
npm run dev
```

Visit http://localhost:3000

## Pages

- `/` — landing page
- `/register` — create an account
- `/login` — log in
- `/dashboard` — protected: create + list short links (redirects to
  `/login` if you're not authenticated)

## How auth works here

On register/login, the backend returns a JWT. We save it to
`localStorage` (`lib/auth.js`). Every subsequent API call
(`lib/api.js`) reads that token and attaches it as
`Authorization: Bearer <token>`. The dashboard page checks for a token on
load and redirects to `/login` if there isn't one — that's the whole
"auth guard."
