const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const { linksRouter, handleRedirect } = require("./routes/links");
const createRateLimiter = require("./middleware/rateLimit");
const createRedisConnection = require("./config/redis");

const app = express();
const redis = createRedisConnection();

// Only allow requests from your actual frontend(s). FRONTEND_URL is set in
// Railway to your Vercel domain, e.g. https://devkit.vercel.app
// Localhost is always allowed too, so local development keeps working.
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
  })
);
app.use(express.json());

// Rate limiting applies globally - every route gets this shared gate.
app.use(createRateLimiter(redis, { windowMs: 60 * 1000, max: 100 }));

// Auth routes: /api/auth/register, /api/auth/login
app.use("/api/auth", authRoutes);

// Link management routes: /api/links (create, list) - all require auth
app.use("/api/links", linksRouter);

// The actual redirect endpoint - PUBLIC, mounted at root so links look like
// yourapp.com/x7Yq2 instead of yourapp.com/api/links/x7Yq2
app.get("/:code", handleRedirect);

app.get("/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;