export function formatToMinutesFrom(seconds: number) {
  return Math.ceil(seconds / 60).toString() + "m"
}

export function isString(value: unknown): boolean {
  return typeof value === 'string'
}

export function isOneOf<T extends Record<string, string>>(
  obj: T,
  value: unknown
): value is T[keyof T] {
  if (!isString(value)) return false

  return Object.values(obj).includes(value as T[keyof T])
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
