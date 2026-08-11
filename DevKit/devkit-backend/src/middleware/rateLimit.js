const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");

// Why Redis-backed instead of the default in-memory store?
// If you ever run more than one instance of the backend (which you will,
// the moment you scale), an in-memory counter is per-instance and useless -
// a user could get 100 requests on server A and another 100 on server B.
// Redis gives everyone a SHARED counter, so limits are enforced correctly
// no matter how many backend instances are running.
function createRateLimiter(redisClient, { windowMs = 60 * 1000, max = 60 } = {}) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    }),
    message: { error: "Too many requests, please slow down." },
  });
}

module.exports = createRateLimiter;
