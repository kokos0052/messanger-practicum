import type { ValidationRule } from './validate'

export const PHONE_VALIDATORS: ValidationRule[] = [
  { required: true },
  { custom: (value) => validatePhone(value) },
]

export const PHONE_PATTERN = /^[78]\d{10}$/

export function applyPhoneMask(value: string): string {
  let digits = value.replace(/\D/g, '')

  if (digits.startsWith('8')) {
    digits = '7' + digits.slice(1)
  }

  if (digits.startsWith('7')) {
    digits = digits.slice(1)
  }

  digits = digits.slice(0, 10)

  const part1 = digits.slice(0, 3)
  const part2 = digits.slice(3, 6)
  const part3 = digits.slice(6, 8)
  const part4 = digits.slice(8, 10)

  let result = '+7'

  if (part1) {
    result += ` (${part1}`
    if (part1.length === 3) result += ')'
  }

  if (part2) {
    result += `${part1.length === 3 ? ' ' : ''}${part2}`
  }

  if (part3) {
    result += `-${part3}`
  }

  if (part4) {
    result += `-${part4}`
  }

  return result
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return PHONE_PATTERN.test(digits)
}

export function normalizePhoneForApi(value: string): string {
  const digits = value.replace(/\D/g, '')

  if (digits.startsWith('7') && digits.length === 11) {
    return `8${digits.slice(1)}`
  }

  return digits
}

export function validatePhone(value: string): string | null {
  if (!value.trim()) {
    return 'Поле обязательно для заполнения'
  }

  if (!isValidPhone(value)) {
    return 'Телефон должен быть в формате +7 (999) 999-99-99'
  }

  return null
}
