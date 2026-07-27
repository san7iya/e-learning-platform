const jwt = require("jsonwebtoken");

function signToken({ user_id, role }) {
  return jwt.sign({ user_id, role }, process.env.JWT_SECRET, { expiresIn: "2h" });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
