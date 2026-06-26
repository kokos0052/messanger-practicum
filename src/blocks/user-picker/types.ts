import { TUser } from '@shared/types/user'

export type TUserPickerMode = 'search' | 'list'

export type TUserPickerProps = {
  mode: TUserPickerMode
  title: string
  buttonText: string
  chatId?: number
  onClose: () => void
  onSelect: (user: TUser) => void | Promise<void>
}
