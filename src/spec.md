# Specification

## Summary
**Goal:** Fix the Shadcn Select runtime crash in product catalog and admin product flows caused by `<SelectItem value="">`, while preserving an “All / no filter” state.

**Planned changes:**
- Replace/remove any `<SelectItem value="">` used in product catalog filters (e.g., Category and Usage) and implement an “All” option using a non-empty value or a sentinel state.
- Audit admin products and other product-related pages/components that render Shadcn `<SelectItem />` options to ensure no empty-string values are ever rendered (including dynamically-generated items).
- Add guards to filter out or safely map empty/invalid option values from backend/category data so they do not render as SelectItems or crash pages.

**User-visible outcome:** Product Catalog and Admin Products pages load without the SelectItem empty-string error, and filters still support clearing back to an unfiltered “All” state.
