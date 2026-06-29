export type TSocketArguments = {
  userId: string
  chatId: string
  tokenValue: string
}

export type TSocketPayload = {
  type: string
  content: string
}

export type TSocketMessage = {
  id: number
  user_id: number
  chat_id: number
  time: string
  type: string
  content: string
}

export type TSocketOptions = TSocketArguments & {
  onOpen?: () => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
  onMessage?: (data: TSocketMessage | TSocketMessage[]) => void
  loadHistoryOnOpen?: boolean
  historyOffset?: number | string
}

export type TSocketClient = {
  socket: WebSocket
  send: (payload: TSocketPayload) => void
  sendMessage: (content: string) => void
  sendFile: (resourcePath: string) => void
  getOldMessages: (offset?: number | string) => void
  close: () => void
}
