const express = require("express");
const Link = require("../models/Link");
const { getNextSequence } = require("../models/Counter");
const { toBase62 } = require("../utils/shortCode");
const requireAuth = require("../middleware/auth");
const clickQueue = require("../queue/clickQueue");

// We need direct access to the redis client here (not just the rate
// limiter's usage of it) to do our own GET/SET calls for the cache.
const createRedisConnection = require("../config/redis");
const redis = createRedisConnection();

const router = express.Router();

const CACHE_TTL_SECONDS = 60 * 60 * 24; // cached mappings expire after 24h of no use

// ---------------------------------------------------------------------
// POST /api/links  (protected - requires login)
// "Dropping off the car": generate a ticket, write it to the logbook
// (MongoDB), and pre-warm the whiteboard (Redis) so the very first click
// is already a cache hit.
// ---------------------------------------------------------------------
router.post("/", requireAuth, async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl || !/^https?:\/\//i.test(longUrl)) {
      return res.status(400).json({ error: "A valid longUrl starting with http(s):// is required" });
    }

    // Atomically get the next counter value, then encode it - collision-free.
    const seq = await getNextSequence("linkCounter");
    const code = toBase62(seq);

    const link = await Link.create({ code, longUrl, owner: req.user.id });

    // Pre-warm the cache so we don't wait for a cache miss on first use.
    await redis.set(`link:${code}`, longUrl, "EX", CACHE_TTL_SECONDS);

    res.status(201).json({
      code,
      shortUrl: `${process.env.BASE_URL}/${code}`,
      longUrl,
      createdAt: link.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create short link" });
  }
});

// ---------------------------------------------------------------------
// GET /api/links  (protected) - list the logged-in user's links
// ---------------------------------------------------------------------
router.get("/", requireAuth, async (req, res) => {
  const links = await Link.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json(links);
});

// ---------------------------------------------------------------------
// GET /:code  (PUBLIC - no auth, this is the redirect anyone clicks)
// This route is mounted separately at the root in app.js, not under /api,
// since short links need to look like yourapp.com/x7Yq2, not
// yourapp.com/api/links/x7Yq2.
//
// This is the cache-aside pattern:
//   1. Check Redis first (fast path)
//   2. On miss, fall back to MongoDB, then repopulate Redis
//   3. Send the redirect immediately either way
//   4. ONLY AFTER responding, enqueue a job to log the click asynchronously
// ---------------------------------------------------------------------
async function handleRedirect(req, res) {
  const { code } = req.params;

  try {
    let longUrl = await redis.get(`link:${code}`);

    if (!longUrl) {
      // Cache miss - fall back to the permanent logbook.
      const link = await Link.findOne({ code });
      if (!link) {
        return res.status(404).send("Short link not found");
      }
      longUrl = link.longUrl;

      // Repopulate the cache so the NEXT visitor gets a cache hit.
      await redis.set(`link:${code}`, longUrl, "EX", CACHE_TTL_SECONDS);
    }

    // Step 1 of the important part: send the customer off with their car
    // BEFORE doing anything else. This is what keeps redirects fast.
    res.redirect(302, longUrl);

    // Step 2: only now, after the response is already sent, do the
    // "paperwork" - push a job onto the queue. This call is fire-and-forget
    // from the request's point of view; it does not delay the response
    // above because .redirect() has already flushed the response.
    await clickQueue.add("log-click", {
      linkCode: code,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
      referrer: req.headers["referer"] || "",
      clickedAt: new Date().toISOString(),
    });

    // Also bump a cheap running counter on the Link doc itself, so the
    // dashboard can show a click count without querying the Click collection.
    Link.updateOne({ code }, { $inc: { clickCount: 1 } }).exec();
  } catch (err) {
    console.error(err);
    // If headers were already sent (redirect happened) we can't send another
    // response - just log it. The user already got their redirect either way.
    if (!res.headersSent) {
      res.status(500).send("Something went wrong");
    }
  }
}

module.exports = { linksRouter: router, handleRedirect };
