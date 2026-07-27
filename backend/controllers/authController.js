const authService = require("../services/authService");
const { handleServerError } = require("../utils/errors");
const { EMAIL_RE } = require("../utils/validation");

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
  }

  try {
    const user = await authService.registerUser(name, email, password);
    return res.json({ success: true, user });
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

    return res.json({ success: true, user });
  } catch (err) {
    handleServerError(res, err, "Could not log in");
  }
}

module.exports = { register, login };
