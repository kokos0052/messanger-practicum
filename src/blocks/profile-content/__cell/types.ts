import type { ValidationRule } from '@shared/utils'

export type TCellBlockProps = {
  cellId: string
  cellKey: string
  cellValue: string
  cellType: string
  cellName: string
  isActive?: boolean
  validators?: ValidationRule[]
  resolveValidators?: () => ValidationRule[]
  onChange?: (name: string, value: string) => void
}

export type TCellButtonProps = {
  actionName: string
  isFirst: boolean
  isLast: boolean
  action: () => void
}
