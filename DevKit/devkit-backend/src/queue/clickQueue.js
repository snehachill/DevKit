const { Queue } = require("bullmq");
const createRedisConnection = require("../config/redis");

// This queue is the "notepad" from the valet story.
// The API server (routes/links.js) only ever PUSHES jobs onto this queue -
// it never processes them. That work happens in worker.js, which runs as
// a completely separate, always-on process.
const connection = createRedisConnection();

const clickQueue = new Queue("click-logging", { connection });

module.exports = clickQueue;
