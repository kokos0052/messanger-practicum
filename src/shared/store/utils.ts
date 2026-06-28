import { Indexed } from './types'

export function set(
  object: Indexed | unknown,
  path: string,
  value: unknown
): Indexed | unknown {
  if (typeof object !== 'object' || object === null) {
    return object
  }

  if (!path || typeof path !== 'string') {
    return object
  }

  const keys = path.split('.')
  let current = object as Indexed

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]

    if (
      !(key in current) ||
      typeof current[key] !== 'object' ||
      current[key] === null
    ) {
      current[key] = {}
    }

    current = current[key] as Indexed
  }

  const lastKey = keys[keys.length - 1]
  current[lastKey] = value

  return object
}

export function merge(lhs: Indexed, rhs: Indexed): Indexed {
  const result: Indexed = {}

  for (const key of Object.keys(lhs)) {
    if (key in rhs) {
      const leftVal = lhs[key]
      const rightVal = rhs[key]
      if (isPlainObject(leftVal) && isPlainObject(rightVal)) {
        result[key] = merge(leftVal as Indexed, rightVal as Indexed)
      } else {
        result[key] = rightVal // перезапись
      }
    } else {
      result[key] = lhs[key]
    }
  }

  for (const key of Object.keys(rhs)) {
    if (!(key in result)) {
      result[key] = rhs[key]
    }
  }

  return result
}

function isPlainObject(value: unknown): value is Indexed {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
