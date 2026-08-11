const dotenv = require("dotenv");

// Support the local configuration file included with this project while
// retaining the conventional .env fallback used in the README.
dotenv.config({ path: ".env.local" });
dotenv.config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] API running on http://localhost:${PORT}`);
    console.log(`[server] Try creating a link: POST /api/links`);
  });
}

start();
