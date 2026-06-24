export type TCellBlockProps = {
  cellId: string
  cellKey: string
  cellValue: string
  cellType: string
  cellName: string
  isActive?: boolean
}

export type TCellButtonProps = {
  actionName: string
  isFirst: boolean
  isLast: boolean
  action: () => void
}
