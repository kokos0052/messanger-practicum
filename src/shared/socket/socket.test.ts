import { SOCKET_MESSAGE_TYPES } from './constants'
import { getSocket } from './socket'
import {
  formatMessageTime,
  isSocketMessage,
  mergeSocketMessages,
  normalizeSocketMessages,
  parseSocketData,
} from './utils'
import { TSocketMessage } from './types'

class MockWebSocket {
  static OPEN = 1
  static last: MockWebSocket | null = null

  readyState = 0
  sent: string[] = []
  private listeners: Record<string, Array<(event?: unknown) => void>> = {}

  constructor(public url: string) {
    MockWebSocket.last = this
  }

  addEventListener(event: string, listener: (event?: unknown) => void) {
    this.listeners[event] = [...(this.listeners[event] ?? []), listener]
  }

  send(data: string) {
    this.sent.push(data)
  }

  close() {
    this.readyState = 3
  }

  emit(event: string, payload?: unknown) {
    this.listeners[event]?.forEach((listener) => listener(payload))
  }

  open() {
    this.readyState = MockWebSocket.OPEN
    this.emit('open')
  }
}

const message: TSocketMessage = {
  id: 1,
  user_id: 10,
  chat_id: 5,
  time: '2026-06-24T10:30:00.000Z',
  type: 'message',
  content: 'Привет',
}

describe('socket utils', () => {
  it('Парсинг одиночных и массивных socket-сообщений', () => {
    expect(parseSocketData(JSON.stringify(message))).toEqual(message)
    expect(parseSocketData(message)).toEqual(message)
    expect(parseSocketData(JSON.stringify([message]))).toEqual([message])
    expect(parseSocketData('broken')).toEqual([])
    expect(parseSocketData(JSON.stringify({ invalid: true }))).toEqual([])
    expect(isSocketMessage(null)).toBe(false)
  })

  it('Валидация и нормализация socket-сообщений', () => {
    expect(isSocketMessage(message)).toBe(true)
    expect(isSocketMessage({ id: 1 })).toBe(false)
    expect(normalizeSocketMessages([message])).toEqual([message])
    expect(normalizeSocketMessages(message)).toEqual([message])
  })

  it('Объединение сообщений по id и форматирование времени', () => {
    const merged = mergeSocketMessages(
      [message],
      [{ ...message, id: 2, content: 'Ещё' }]
    )

    expect(merged.map((item) => item.id)).toEqual([1, 2])
    expect(formatMessageTime('2026-06-24T10:30:00.000Z')).toMatch(/\d{2}:\d{2}/)
  })

  it('Сортировка объединённых сообщений по time при неверном порядке id', () => {
    const earlier = {
      ...message,
      id: 10,
      time: '2026-06-24T10:00:00.000Z',
      content: 'Раньше',
    }
    const later = {
      ...message,
      id: 5,
      time: '2026-06-24T11:00:00.000Z',
      content: 'Позже',
    }

    const merged = mergeSocketMessages([], [later, earlier])

    expect(merged.map((item) => item.content)).toEqual(['Раньше', 'Позже'])
  })
})

describe('getSocket', () => {
  const originalWebSocket = global.WebSocket

  beforeEach(() => {
    MockWebSocket.last = null
    global.WebSocket = MockWebSocket as unknown as typeof WebSocket
    Object.assign(global.WebSocket, { OPEN: MockWebSocket.OPEN })
  })

  afterEach(() => {
    global.WebSocket = originalWebSocket
  })

  it('Создание socket с url Practicum', () => {
    getSocket({
      userId: '1',
      chatId: '5',
      tokenValue: 'token',
    })

    expect(MockWebSocket.last?.url).toBe(
      'wss://ya-praktikum.tech/ws/chats/1/5/token'
    )
  })

  it('Загрузка истории при open, когда включено', () => {
    const client = getSocket({
      userId: '1',
      chatId: '5',
      tokenValue: 'token',
      loadHistoryOnOpen: true,
    })

    MockWebSocket.last?.open()

    expect(client.socket).toBe(MockWebSocket.last)
    expect(MockWebSocket.last?.sent[0]).toBe(
      JSON.stringify({
        type: SOCKET_MESSAGE_TYPES.GET_OLD,
        content: '0',
      })
    )
  })

  it('Загрузка истории с кастомным offset при open', () => {
    getSocket({
      userId: '1',
      chatId: '5',
      tokenValue: 'token',
      loadHistoryOnOpen: true,
      historyOffset: 20,
    })

    MockWebSocket.last?.open()

    expect(MockWebSocket.last?.sent[0]).toBe(
      JSON.stringify({
        type: SOCKET_MESSAGE_TYPES.GET_OLD,
        content: '20',
      })
    )
  })

  it('Отправка сообщений и парсинг входящих данных', () => {
    const onMessage = jest.fn()

    const client = getSocket({
      userId: '1',
      chatId: '5',
      tokenValue: 'token',
      onMessage,
    })

    MockWebSocket.last?.open()
    client.sendMessage('Новое сообщение')
    client.sendFile('/uploads/file.png')
    client.getOldMessages()

    expect(MockWebSocket.last?.sent).toEqual([
      JSON.stringify({
        type: SOCKET_MESSAGE_TYPES.MESSAGE,
        content: 'Новое сообщение',
      }),
      JSON.stringify({
        type: SOCKET_MESSAGE_TYPES.FILE,
        content: '/uploads/file.png',
      }),
      JSON.stringify({
        type: SOCKET_MESSAGE_TYPES.GET_OLD,
        content: '0',
      }),
    ])

    MockWebSocket.last?.emit('message', { data: JSON.stringify([message]) })

    expect(onMessage).toHaveBeenCalledWith([message])
  })

  it('Не отправляет, когда socket закрыт', () => {
    const client = getSocket({
      userId: '1',
      chatId: '5',
      tokenValue: 'token',
    })

    client.sendMessage('Не отправится')

    expect(MockWebSocket.last?.sent).toEqual([])
  })

  it('Вызов lifecycle callbacks', () => {
    const onOpen = jest.fn()
    const onClose = jest.fn()
    const onError = jest.fn()

    getSocket({
      userId: '1',
      chatId: '5',
      tokenValue: 'token',
      onOpen,
      onClose,
      onError,
    })

    MockWebSocket.last?.open()
    MockWebSocket.last?.emit('close', { wasClean: true })
    MockWebSocket.last?.emit('error', new Event('error'))

    expect(onOpen).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
    expect(onError).toHaveBeenCalled()
  })

  it('Закрытие socket-соединения', () => {
    const client = getSocket({
      userId: '1',
      chatId: '5',
      tokenValue: 'token',
    })

    client.close()

    expect(MockWebSocket.last?.readyState).toBe(3)
  })
})
