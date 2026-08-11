const mongoose = require("mongoose");

// This is the "paperwork" the worker fills in AFTER the customer already
// drove off with their car. Nothing here ever blocks the redirect.
const clickSchema = new mongoose.Schema(
  {
    linkCode: { type: String, required: true, index: true },
    ip: { type: String },
    country: { type: String },
    city: { type: String },
    userAgent: { type: String },
    referrer: { type: String },
    clickedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Click", clickSchema);
