# Specification

## Summary
**Goal:** Fix broken admin login/sign-up by using Internet Identity end-to-end and correctly verifying/admin-bootstrapping roles via the backend.

**Planned changes:**
- Ensure the backend exposes an `isCallerAdmin()` method that matches the frontend candid/actor interface and returns `true` only for principals with the admin role.
- Add an admin bootstrapping flow in the backend: on fresh deployments with no admins, promote the first authenticated (non-anonymous) principal who attempts to access admin functionality; never promote anonymous callers; stop auto-promotion once at least one admin exists.
- Update the admin panel login gate UI to remove the non-functional Admin Key flow and instead prompt anonymous users to “Log in with Internet Identity”; after login, re-check `isCallerAdmin()` to either enter the admin dashboard or show an English “insufficient permissions” state with recovery actions (e.g., logout/switch account, retry verification, reset session).
- Add a minimal diagnostics surface for admin auth failures: show an English error summary plus a collapsible/copyable technical detail section using existing `parseAdminAuthError` classification, without crashing the app.

**User-visible outcome:** Admin access works via Internet Identity: anonymous users are prompted to log in, admins can enter the dashboard, non-admins see a clear permissions error with recovery options, and auth failures show copyable diagnostic details for support/debugging.
