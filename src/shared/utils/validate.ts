export type ValidationRule = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

export function validateValue(
  value: string,
  validators?: ValidationRule[]
): string | null {
  if (!validators?.length) return null

  for (const rule of validators) {
    if (rule.required && !value.trim()) {
      return 'Поле обязательно для заполнения'
    }
    if (rule.minLength && value.length < rule.minLength) {
      return `Минимальная длина ${rule.minLength} символов`
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return `Максимальная длина ${rule.maxLength} символов`
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return 'Неверный формат'
    }
    if (rule.custom) {
      const customError = rule.custom(value)
      if (customError) return customError
    }
  }

  return null
}

export function isFormValid(
  values: Record<string, string>,
  fields: { name: string; validators?: ValidationRule[] }[]
): boolean {
  return fields.every(
    (field) => !validateValue(values[field.name] ?? '', field.validators)
  )
}
