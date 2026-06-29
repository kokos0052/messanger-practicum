import { SOCKET_BASE_URL, SOCKET_MESSAGE_TYPES } from './constants'
import {
  TSocketClient,
  TSocketOptions,
  TSocketPayload,
} from './types'
import { parseSocketData } from './utils'

export const getSocket = ({
  userId,
  chatId,
  tokenValue,
  onOpen,
  onClose,
  onError,
  onMessage,
  loadHistoryOnOpen = false,
  historyOffset = 0,
}: TSocketOptions): TSocketClient => {
  const socket = new WebSocket(
    `${SOCKET_BASE_URL}/${userId}/${chatId}/${tokenValue}`
  )

  const send = (payload: TSocketPayload) => {
    if (socket.readyState !== WebSocket.OPEN) return

    socket.send(JSON.stringify(payload))
  }

  const sendMessage = (content: string) => {
    send({
      type: SOCKET_MESSAGE_TYPES.MESSAGE,
      content,
    })
  }

  const sendFile = (resourcePath: string) => {
    send({
      type: SOCKET_MESSAGE_TYPES.FILE,
      content: resourcePath,
    })
  }

  const getOldMessages = (offset: number | string = 0) => {
    send({
      type: SOCKET_MESSAGE_TYPES.GET_OLD,
      content: String(offset),
    })
  }

  const close = () => {
    socket.close()
  }

  socket.addEventListener('open', () => {
    onOpen?.()

    if (loadHistoryOnOpen) {
      getOldMessages(historyOffset)
    }
  })

  socket.addEventListener('close', (event) => {
    onClose?.(event)
  })

  socket.addEventListener('message', (event) => {
    onMessage?.(parseSocketData(event.data))
  })

  socket.addEventListener('error', (event) => {
    onError?.(event)
  })

  return {
    socket,
    send,
    sendMessage,
    sendFile,
    getOldMessages,
    close,
  }
}
