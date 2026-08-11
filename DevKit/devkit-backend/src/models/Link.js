const mongoose = require("mongoose");

// Each document here is one "ticket" in the valet story:
// code -> the short ticket number (e.g. "x7Yq2")
// longUrl -> the full description of the car
const linkSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    longUrl: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clickCount: { type: Number, default: 0 }, // cheap running total for quick display
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Link", linkSchema);
