const authService = require("../services/authService");
const { handleServerError } = require("../utils/errors");
const { EMAIL_RE, SELF_SERVE_ROLES } = require("../utils/validation");
const { signToken } = require("../utils/jwt");

async function register(req, res) {
  const { name, email, password, role = "student" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
  }
  if (!SELF_SERVE_ROLES.includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  try {
    const user = await authService.registerUser(name, email, password, role);
    const token = signToken({ user_id: user.user_id, role: user.role });
    return res.json({ success: true, token, user });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    handleServerError(res, err, "Could not register user");
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  try {
    const user = await authService.verifyCredentials(email, password);

    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = signToken({ user_id: user.user_id, role: user.role });
    const { password: _password, ...safeUser } = user;

    return res.json({ success: true, token, user: safeUser });
  } catch (err) {
    handleServerError(res, err, "Could not log in");
  }
}

module.exports = { register, login };
