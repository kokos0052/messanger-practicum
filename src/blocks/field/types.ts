type ValidationRule = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

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
}
