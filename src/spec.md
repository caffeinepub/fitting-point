# Specification

## Summary
**Goal:** Fix admin email/password authentication so valid configured credentials successfully log in and the UI shows correct error messaging.

**Planned changes:**
- Backend: Correct `authenticateAdminWithEmailPassword` to accept the configured admin credentials, granting admin privileges to the caller on success.
- Backend: Normalize credentials by trimming whitespace and comparing email case-insensitively.
- Backend: Ensure fresh deployments allow admin login without requiring `unlockBootstrapAdminPrivileges`.
- Frontend: Keep the “Invalid email or password...” message strictly tied to backend invalid-credential failures, while showing a generic error for other failures (preserving existing `parseAdminAuthError` behavior).

**User-visible outcome:** Admins can log in using the configured email/password without being incorrectly rejected, and the login screen shows the invalid-credentials message only when the credentials are actually wrong.
