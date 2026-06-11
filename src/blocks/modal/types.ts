type TField = {
  fieldId: string
  fieldLabel: string
}

export type TModalProps = {
  modalTitle: string
  buttonText: string
  onClose: () => void
  modalFields?: TField[]
  link?: string
}
