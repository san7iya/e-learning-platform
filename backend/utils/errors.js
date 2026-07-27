// Logs the real error server-side and sends a generic message to the client.
function handleServerError(res, err, message = "Something went wrong, please try again") {
  console.error(err);
  res.status(500).json({ success: false, message });
}

module.exports = { handleServerError };
