export type TChatInputProps = {
  onSendMessage?: (message: string) => void
  onAttachMedia?: (file: File) => void | Promise<void>
  onAttachFile?: (file: File) => void | Promise<void>
}
