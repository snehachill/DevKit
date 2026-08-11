// Base62 alphabet: 0-9, a-z, A-Z (62 characters total)
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Converts a plain incrementing number into a short base62 string.
// Why base62 + a counter instead of random/hash?
//   - It's collision-free BY CONSTRUCTION: two different numbers can never
//     encode to the same string, so we never need to check-and-retry.
//   - It's short: even a huge counter (millions of links) encodes to just
//     5-6 characters, because we're packing 62 possibilities per digit
//     instead of only 10 (like plain decimal numbers).
function toBase62(num) {
  if (num === 0) return ALPHABET[0];
  let result = "";
  while (num > 0) {
    result = ALPHABET[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

module.exports = { toBase62 };
