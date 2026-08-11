const dotenv = require("dotenv");

// Keep the worker's configuration loading in sync with the API process.
dotenv.config({ path: ".env.local" });
dotenv.config();
const { Worker } = require("bullmq");
const axios = require("axios");
const mongoose = require("mongoose");
const createRedisConnection = require("./src/config/redis");
const Click = require("./src/models/Click");

// This file is run as its OWN process (npm run worker), separate from the
// API server (npm run dev). It must stay running continuously to keep
// pulling jobs off the queue - this is exactly why it needs to live on
// Railway/Render, not on serverless Vercel, which only runs code per-request.

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("[worker] MongoDB connected");

  const connection = createRedisConnection();

  const worker = new Worker(
    "click-logging",
    async (job) => {
      const { linkCode, ip, userAgent, referrer, clickedAt } = job.data;

      // Look up rough geolocation from the IP. If this call is slow or
      // fails entirely, it does NOT affect any user waiting for a redirect -
      // that response was already sent long before this job even started.
      let country = null;
      let city = null;
      try {
        if (ip && ip !== "::1" && process.env.GEO_IP_API) {
          const { data } = await axios.get(`${process.env.GEO_IP_API}/${ip}/json/`, {
            timeout: 3000,
          });
          country = data.country_name || null;
          city = data.city || null;
        }
      } catch (err) {
        console.warn(`[worker] geo-IP lookup failed for ${ip}:`, err.message);
        // We deliberately swallow this error - a missing location is fine,
        // a crashed worker is not.
      }

      await Click.create({
        linkCode,
        ip,
        country,
        city,
        userAgent,
        referrer,
        clickedAt,
      });

      console.log(`[worker] logged click for ${linkCode}`);
    },
    { connection }
  );

  worker.on("failed", (job, err) => {
    console.error(`[worker] job ${job.id} failed:`, err.message);
  });

  console.log("[worker] listening for click-logging jobs...");
}

main().catch((err) => {
  console.error("[worker] fatal error:", err);
  process.exit(1);
});
