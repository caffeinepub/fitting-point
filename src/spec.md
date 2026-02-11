# Specification

## Summary
**Goal:** Fix admin email/password login so valid configured credentials successfully authenticate and grant admin privileges without false “invalid credentials” errors.

**Planned changes:**
- Update backend admin authentication flow so `authenticateAdminWithEmailPassword("fitting.point.official@gmail.com", "Farhan@456")` succeeds without trapping and correctly marks the current caller/session as admin.
- Preserve correct failure behavior for wrong credentials (explicit invalid-credentials error; no silent success).
- Frontend: trim email and password inputs before submitting to `authenticateAdminWithEmailPassword`.
- Frontend: improve error handling so “Invalid email or password” is shown only for true credential failures; show a generic error message for unrelated backend/initialization errors.
- Ensure admin UI switches to the authenticated admin layout immediately after successful login (no refresh required).

**User-visible outcome:** Admins can log in at `/admin` using the configured email/password (even with accidental leading/trailing spaces) and immediately see the authenticated admin panel; incorrect credentials still show an invalid-credentials message, while other failures show a generic error.
