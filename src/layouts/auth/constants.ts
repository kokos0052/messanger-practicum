import {
  PASSWORD_VALIDATORS,
  PHONE_VALIDATORS,
  REQUIRED_VALIDATORS,
  ValidationRule,
} from '@shared/utils'

export type TAuthFormField = {
  name: string
  validators: ValidationRule[]
}

export const LOGIN_FORM_FIELDS: TAuthFormField[] = [
  { name: 'login', validators: REQUIRED_VALIDATORS },
  { name: 'password', validators: PASSWORD_VALIDATORS },
]

export const SIGNUP_FORM_FIELDS: TAuthFormField[] = [
  { name: 'email', validators: REQUIRED_VALIDATORS },
  { name: 'login', validators: REQUIRED_VALIDATORS },
  { name: 'first_name', validators: REQUIRED_VALIDATORS },
  { name: 'second_name', validators: REQUIRED_VALIDATORS },
  { name: 'phone', validators: PHONE_VALIDATORS },
  { name: 'password', validators: PASSWORD_VALIDATORS },
  { name: 'password_two', validators: PASSWORD_VALIDATORS },
]

export function getAuthFormFields(formType: 'loginForm' | 'signupForm') {
  return formType === 'loginForm' ? LOGIN_FORM_FIELDS : SIGNUP_FORM_FIELDS
}
