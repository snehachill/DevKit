const mongoose = require("mongoose");

// A single document that holds our running counter for short-code generation.
// We use MongoDB's atomic $inc so that even if two "create link" requests
// land at the exact same millisecond, they always get different numbers -
// no race condition, no duplicate codes.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "linkCounter"
  seq: { type: Number, default: 1000 },  // start at 1000 so early codes aren't 1-2 chars long
});

const Counter = mongoose.model("Counter", counterSchema);

async function getNextSequence(name) {
  // NOTE: MongoDB doesn't allow $inc and $setOnInsert on the SAME field in
  // one operation, and $inc with upsert ignores the Mongoose schema default
  // anyway (defaults only apply when a document is built via Mongoose's own
  // constructor, not via a raw findByIdAndUpdate upsert). So we seed the
  // counter explicitly the first time it's used, then increment normally
  // on every call after that.
  let counter = await Counter.findById(name);

  if (!counter) {
    // First time this counter is used - create it starting at 1000.
    try {
      counter = await Counter.create({ _id: name, seq: 1000 });
      return counter.seq;
    } catch (err) {
      // Extremely rare: another request created it a split second earlier
      // (duplicate key error). That's fine - just fall through and
      // increment the one that now exists.
      if (err.code !== 11000) throw err;
    }
  }

  const result = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true }
  );
  return result.seq;
}

module.exports = { getNextSequence };
module.exports = { getNextSequence };
