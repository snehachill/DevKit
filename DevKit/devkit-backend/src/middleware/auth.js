const jwt = require("jsonwebtoken");

// This runs BEFORE any protected route handler.
// It checks the Authorization header for a valid JWT, and if valid,
// attaches the user's id to req.user so route handlers know who's asking.
function requireAuth(req, res, next) {
  const header = req.headers.authorization; // expected format: "Bearer <token>"

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
