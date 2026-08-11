const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const { linksRouter, handleRedirect } = require("./routes/links");
const createRateLimiter = require("./middleware/rateLimit");
const createRedisConnection = require("./config/redis");

const app = express();
const redis = createRedisConnection();

app.use(cors());
app.use(express.json());

// Rate limiting applies globally - every route gets this shared gate.
app.use(createRateLimiter(redis, { windowMs: 60 * 1000, max: 100 }));

// Auth routes: /api/auth/register, /api/auth/login
app.use("/api/auth", authRoutes);

// Link management routes: /api/links (create, list) - all require auth
app.use("/api/links", linksRouter);

// Keep fixed application routes ahead of the catch-all short-code route.
app.get("/health", (req, res) => res.json({ status: "ok" }));

// The actual redirect endpoint - PUBLIC, mounted at root so links look like
// yourapp.com/x7Yq2 instead of yourapp.com/api/links/x7Yq2
app.get("/:code", handleRedirect);

module.exports = app;
