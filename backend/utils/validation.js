const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// org-admin is deliberately excluded: it's not self-servable at registration.
const SELF_SERVE_ROLES = ["student", "instructor"];

module.exports = { EMAIL_RE, SELF_SERVE_ROLES };
