import { TUser } from '@shared/types/user'
import { ValidationRule } from '@shared/utils'
import { TCellBlockProps } from './__cell/types'

const REQUIRED: ValidationRule[] = [{ required: true }]
const PASSWORD: ValidationRule[] = [{ required: true }, { minLength: 6 }]

const PROFILE_CELL_FIELDS: Omit<TCellBlockProps, 'cellValue'>[] = [
  {
    cellKey: 'Почта',
    cellId: 'info_mail',
    cellType: 'text',
    cellName: 'email',
    validators: REQUIRED,
  },
  {
    cellKey: 'Логин',
    cellId: 'info_login',
    cellType: 'text',
    cellName: 'login',
    validators: REQUIRED,
  },
  {
    cellKey: 'Имя',
    cellId: 'info_name',
    cellType: 'text',
    cellName: 'first_name',
    validators: REQUIRED,
  },
  {
    cellKey: 'Фамилия',
    cellId: 'info_second_name',
    cellType: 'text',
    cellName: 'second_name',
    validators: REQUIRED,
  },
  {
    cellKey: 'Имя в чате',
    cellId: 'info_nickname',
    cellType: 'text',
    cellName: 'display_name',
  },
  {
    cellKey: 'Телефон',
    cellId: 'info_phone',
    cellType: 'text',
    cellName: 'phone',
    validators: REQUIRED,
  },
]

export const profileCellButtons = [
  { actionName: 'Изменить данные' },
  { actionName: 'Изменить пароль' },
  { actionName: 'Выйти' },
]

export const passwordCells: TCellBlockProps[] = [
  {
    cellKey: 'Старый пароль',
    cellValue: '',
    cellId: 'info_old_password',
    cellType: 'password',
    cellName: 'old_password',
    validators: REQUIRED,
  },
  {
    cellKey: 'Новый пароль',
    cellValue: '',
    cellId: 'info_new_password',
    cellType: 'password',
    cellName: 'new_password',
    validators: PASSWORD,
  },
  {
    cellKey: 'Повторите новый пароль',
    cellValue: '',
    cellId: 'info_new_password_again',
    cellType: 'password',
    cellName: 'new_password_again',
    validators: PASSWORD,
  },
]

export function buildProfileCells(user: TUser): TCellBlockProps[] {
  return PROFILE_CELL_FIELDS.map((field) => ({
    ...field,
    cellValue: String(user[field.cellName as keyof TUser] ?? ''),
  }))
}

export function getProfileFormFields(): {
  name: string
  validators?: ValidationRule[]
}[] {
  return PROFILE_CELL_FIELDS.map(({ cellName, validators }) => ({
    name: cellName,
    validators,
  }))
}

export function getPasswordFormFields(): {
  name: string
  validators?: ValidationRule[]
}[] {
  return passwordCells.map(({ cellName, validators }) => ({
    name: cellName,
    validators,
  }))
}

export function getUserDisplayName(user: TUser): string {
  return user.display_name ?? user.first_name
}

export function buildProfileFormValues(user: TUser): Record<string, string> {
  return buildProfileCells(user).reduce<Record<string, string>>(
    (acc, { cellName, cellValue }) => {
      acc[cellName] = cellValue
      return acc
    },
    {}
  )
}

export function buildPasswordFormValues(): Record<string, string> {
  return passwordCells.reduce<Record<string, string>>((acc, { cellName }) => {
    acc[cellName] = ''
    return acc
  }, {})
}
