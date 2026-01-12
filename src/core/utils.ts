/**
 * Formats seconds to a minute display string with "m" suffix.
 * Rounds up to nearest minute.
 *
 * @param seconds - Time in seconds to format
 * @returns Formatted string like "25m", "5m", etc.
 */
export function formatToMinutesFrom(seconds: number) {
  return Math.ceil(seconds / 60).toString() + "m"
}

/**
 * Type guard to check if a value is a string.
 *
 * @param value - Value to check
 * @returns True if value is a string
 */
export function isString(value: unknown): boolean {
  return typeof value === 'string'
}

/**
 * Generic type guard to check if a value exists in a const object's values.
 * Useful for validating enum-like constants.
 *
 * @template T - Object type with string values
 * @param obj - The const object to check against (e.g., MODES, STATUSES)
 * @param value - The value to validate
 * @returns True if value is one of the object's values, with type narrowing
 */
export function isOneOf<T extends Record<string, string>>(
  obj: T,
  value: unknown
): value is T[keyof T] {
  if (!isString(value)) return false

  return Object.values(obj).includes(value as T[keyof T])
}

/**
 * Type guard to check if a value is a non-null object.
 *
 * @param value - Value to check
 * @returns True if value is an object (excludes null and arrays)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
