import { Store } from '@shared/store'
import type { ValidationRule } from '@shared/utils'

export type { ValidationRule }

export type TFieldProps = {
  type: string
  name: string
  id: string
  label: string
  value?: string
  onChange?: (e: Event) => void
  onBlur?: (e: Event) => void
  validators?: ValidationRule[]
  errorText?: string
  store?: Store
}
