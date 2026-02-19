/**
 * Shared sentinel values and utilities for shadcn-ui Select components.
 * Prevents rendering SelectItem with empty-string values, which causes runtime errors.
 */

// Sentinel value for "All" / "no filter" selections
export const SELECT_ALL_SENTINEL = '__ALL__';

/**
 * Check if a value represents "All" / "no filter"
 */
export function isAllSelected(value: string | undefined | null): boolean {
  return !value || value === SELECT_ALL_SENTINEL;
}

/**
 * Convert a filter value to a sentinel-safe value for Select component
 */
export function toSelectValue(value: string | undefined | null): string {
  return value && value.trim() ? value : SELECT_ALL_SENTINEL;
}

/**
 * Convert a Select value back to a filter value (empty string for "All")
 */
export function fromSelectValue(value: string): string {
  return value === SELECT_ALL_SENTINEL ? '' : value;
}

/**
 * Filter and sanitize option values to prevent empty-string SelectItems
 */
export function sanitizeSelectOptions(options: string[]): string[] {
  return options.filter((opt) => opt && opt.trim().length > 0);
}
