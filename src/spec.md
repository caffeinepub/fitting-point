# Specification

## Summary
**Goal:** Fix admin access by enabling direct email/password login for the first admin account and removing the broken token-based bootstrap UI.

**Planned changes:**
- Backend: Hardcode the first admin credentials (`fitting.point.official@gmail.com` / `Farhan@456`) and ensure `authenticateAdminWithEmailPassword(email, password)` assigns the `#admin` role when they match, and returns an invalid-credentials-style error when they do not.
- Frontend: Remove/disable the token-based “First-Time Setup” / “Grant Admin Access” section from the admin login screen so email + password is the only visible admin login path.

**User-visible outcome:** Admins can log in from the /admin screen using only email and password and reach the admin dashboard; token/bootstrap fields are no longer shown.
