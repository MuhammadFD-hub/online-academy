const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "secretKey";
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "token not found" });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(403).json({ error: "invalid token" });
    req.user = decoded;
    next();
  });
}
module.exports = authenticateToken;
