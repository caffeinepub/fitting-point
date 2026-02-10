# Specification

## Summary
**Goal:** Redesign the storefront homepage to closely match the structure and behavior of vnscollection.com, and add admin-manageable full-width homepage banners that persist.

**Planned changes:**
- Rework the homepage layout/section ordering/spacing to resemble vnscollection.com as closely as possible while keeping existing app navigation (Home/Catalog/Product/etc.) and using the existing `onNavigate` behavior for CTAs.
- Remove or rework existing homepage elements that don’t fit the reference structure, avoiding hardcoded category tiles, hardcoded images, and hardcoded marketing copy for sections intended to mirror the reference site.
- Add a data-driven homepage banner system that supports multiple full-width banners with image + editable text (heading and optional subheading) and an optional click-through destination.
- Extend backend site content storage and admin-only methods to create/update/delete homepage banners (including uploaded image references) and keep site content publicly readable for storefront rendering.
- Update Admin Site Settings to include a “Homepage Banners” management UI (list + add/edit/remove), using the existing `MediaSlotUploader` and ensuring saved changes reflect on the homepage after data refetch (no full reload required).

**User-visible outcome:** The homepage appears and behaves much closer to vnscollection.com, and admins can add, edit, remove, and reorder (via list management) multiple full-width homepage banners (image + text + optional link) that persist across refreshes.
