function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "You do not have permission to perform this action" });
    }
    next();
  };
}

// getOwnerId: async (req) => ownerUserId | null (null means "resource not found")
function requireOwnership(getOwnerId) {
  return async (req, res, next) => {
    try {
      const ownerId = await getOwnerId(req);

      if (ownerId === null) {
        return res.status(404).json({ success: false, message: "Not found" });
      }

      if (ownerId !== req.user.user_id) {
        return res.status(403).json({ success: false, message: "You do not own this resource" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Something went wrong, please try again" });
    }
  };
}

module.exports = { requireRole, requireOwnership };
