const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// org-admin registers by creating a brand-new organization (see
// authService.registerOrgAdmin), rather than attaching to an existing one,
// so self-serve here can't let someone claim an org they don't run.
const SELF_SERVE_ROLES = ["student", "instructor", "org-admin"];

module.exports = { EMAIL_RE, SELF_SERVE_ROLES };
