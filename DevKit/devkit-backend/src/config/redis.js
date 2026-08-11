const Redis = require("ioredis");

// This is our "whiteboard" - the fast-access cache sitting in front of MongoDB.
// We use ONE Redis connection for two different jobs:
//   1. Caching short-code -> longUrl lookups (see routes/links.js)
//   2. Powering the BullMQ queue for async click logging (see queue/clickQueue.js)
//
// BullMQ requires maxRetriesPerRequest: null on the connection it uses,
// so we export a factory function rather than a single shared instance.
function createRedisConnection() {
  const rawRedisUrl = (process.env.REDIS_URL || "").trim();
  // Upstash's dashboard sometimes provides a full `redis-cli --tls -u ...`
  // command. Accept it as well as a normal redis:// or rediss:// URL.
  const cliUrl = rawRedisUrl.match(/(?:^|\s)-u\s+(rediss?:\/\/\S+)/i);
  const redisUrl = cliUrl ? cliUrl[1] : rawRedisUrl;

  if (!/^rediss?:\/\//i.test(redisUrl)) {
    throw new Error("REDIS_URL must be a redis:// or rediss:// connection URL");
  }

  const connection = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    ...(/(?:^|\s)--tls(?:\s|$)/i.test(rawRedisUrl) && /^redis:\/\//i.test(redisUrl)
      ? { tls: {} }
      : {}),
  });

  connection.on("connect", () => console.log("[redis] connected"));
  connection.on("error", (err) => console.error("[redis] error:", err.message));

  return connection;
}

module.exports = createRedisConnection;
