const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ err: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Get token after "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX: Assign decoded directly (no more decoded.payload)
    req.user = decoded.payload;

    next();
  } catch (err) {
    res.status(401).json({ err: "Invalid Token" });
  }
}

module.exports = verifyToken;
