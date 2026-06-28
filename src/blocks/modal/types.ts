type TField = {
  fieldId: string
  fieldLabel: string
}

export type TModalVariant = 'form' | 'file'

export type TModalProps<TFormData = unknown> = {
  modalTitle: string
  buttonText: string
  onClose: (e?: Event) => void
  modalFields?: TField[]
  link?: string
  variant?: TModalVariant
  accept?: string
  action?: (payload: TFormData) => void | Promise<void>
}
