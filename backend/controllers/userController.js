const authService = require("../services/authService");
const { handleServerError } = require("../utils/errors");

async function getMe(req, res) {
  try {
    const user = await authService.getUserById(req.user.user_id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    handleServerError(res, err);
  }
}

module.exports = { getMe };
