import Store from '@shared/store/store'
import { getSocket, mergeSocketMessages } from '@shared/socket'
import resourcesApi from '@shared/api/resourcesApi'
import chatsApi from '@shared/api/chatsApi'
import { ChatWindow, ChatWindowBlock } from './chatWindow'
import { getMountedRoot, mount, query } from '../../tests/helpers/mount'
import { flushPromises } from '../../tests/helpers/mockXhr'

jest.mock('@shared/api/resourcesApi', () => ({
  __esModule: true,
  default: {
    uploadResource: jest.fn(),
  },
}))

jest.mock('@shared/api/chatsApi', () => ({
  __esModule: true,
  default: {
    setChatToken: jest.fn(),
  },
}))

jest.mock('@shared/socket', () => ({
  ...jest.requireActual('@shared/socket'),
  getSocket: jest.fn(),
  mergeSocketMessages: jest.fn(
    jest.requireActual('@shared/socket').mergeSocketMessages
  ),
}))

const mockedGetSocket = getSocket as jest.MockedFunction<typeof getSocket>
const mockedMergeSocketMessages = mergeSocketMessages as jest.MockedFunction<
  typeof mergeSocketMessages
>
const mockedSetChatToken = chatsApi.setChatToken as jest.Mock
const mockedUploadResource = resourcesApi.uploadResource as jest.Mock

describe('ChatWindow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedSetChatToken.mockResolvedValue({ token: 'chat-token' })
    mockedUploadResource.mockResolvedValue('/uploads/file.png')
    mockedGetSocket.mockReturnValue({
      socket: {} as WebSocket,
      send: jest.fn(),
      sendMessage: jest.fn(),
      sendFile: jest.fn(),
      getOldMessages: jest.fn(),
      close: jest.fn(),
    })
  })

  it('Отображение loader, когда выбранного чата нет в store', () => {
    Store.setState('selectedChatId', 42)
    Store.setState('chats', [])

    const el = mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    expect(el.className).toBe('chat-window-loader')
    expect(el.textContent).toBe('Загрузка...')
  })

  it('Отображение окна чата с шапкой, когда чат существует', () => {
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      {
        id: 1,
        title: 'Мой чат',
        type: 'chat',
        avatar: '/chat-avatar.png',
        unread_count: 0,
      },
    ])

    const el = mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    expect(el.className).toBe('chat-window')
    expect(
      query(el, '.chat-window__chat-header-user-info-name').textContent
    ).toBe('Мой чат')
    expect(query(el, '.chat-window__chat-input-container')).toBeTruthy()
  })

  it('Очистка state при снятии выбранного чата', () => {
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      { id: 1, title: 'Мой чат', type: 'chat', unread_count: 0 },
    ])

    mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    Store.setState('selectedChatId', null)

    expect(getMountedRoot().className).toBe('chat-window')
    expect(
      query(getMountedRoot(), '.chat-window__chat-header-user-info-name')
        .textContent
    ).toBe('')
  })

  it('Загрузка сообщений через websocket для авторизованного пользователя', async () => {
    Store.setState('user', {
      id: 7,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      login: 'ivan',
      avatar: null,
      email: 'ivan@mail.ru',
      phone: '79991234567',
    })
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      {
        id: 1,
        title: 'Мой чат',
        type: 'chat',
        avatar: '/chat-avatar.png',
        unread_count: 0,
        created_by: 7,
      },
    ])

    let onMessage: ((data: unknown) => void) | undefined

    mockedGetSocket.mockImplementation(({ onMessage: handleMessage }) => {
      onMessage = handleMessage as typeof onMessage

      return {
        socket: {} as WebSocket,
        send: jest.fn(),
        sendMessage: jest.fn(),
        sendFile: jest.fn(),
        getOldMessages: jest.fn(),
        close: jest.fn(),
      }
    })

    mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    await flushPromises()

    expect(mockedSetChatToken).toHaveBeenCalledWith('1', {})
    expect(mockedGetSocket).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: '7',
        chatId: '1',
        tokenValue: 'chat-token',
        loadHistoryOnOpen: true,
      })
    )

    onMessage?.([
      {
        id: 1,
        user_id: 7,
        chat_id: 1,
        time: '2026-06-24T10:30:00.000Z',
        type: 'message',
        content: 'Привет!',
      },
    ])

    expect(getMountedRoot().textContent).toContain('Привет!')
  })

  it('Отображение сообщений websocket в хронологическом порядке', async () => {
    const rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        const container = document.querySelector<HTMLElement>(
          '.chat-window__chat-messages-container'
        )

        if (container) {
          Object.defineProperty(container, 'scrollHeight', {
            value: 480,
            configurable: true,
          })
        }

        callback(0)
        return 1
      })

    Store.setState('user', {
      id: 7,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      login: 'ivan',
      avatar: null,
      email: 'ivan@mail.ru',
      phone: '79991234567',
    })
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      {
        id: 1,
        title: 'Мой чат',
        type: 'chat',
        unread_count: 0,
        created_by: 7,
      },
    ])

    let onMessage: ((data: unknown) => void) | undefined

    mockedGetSocket.mockImplementation(({ onMessage: handleMessage }) => {
      onMessage = handleMessage as typeof onMessage

      return {
        socket: {} as WebSocket,
        send: jest.fn(),
        sendMessage: jest.fn(),
        sendFile: jest.fn(),
        getOldMessages: jest.fn(),
        close: jest.fn(),
      }
    })

    mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    await flushPromises()

    onMessage?.([
      {
        id: 2,
        user_id: 8,
        chat_id: 1,
        time: '2026-06-24T11:00:00.000Z',
        type: 'message',
        content: 'Позже',
      },
      {
        id: 1,
        user_id: 7,
        chat_id: 1,
        time: '2026-06-24T10:00:00.000Z',
        type: 'message',
        content: 'Раньше',
      },
    ])

    await flushPromises()

    const messageNodes = getMountedRoot().querySelectorAll(
      '.chat-window__chat-messages-message'
    )

    expect(messageNodes[0].textContent).toContain('Раньше')
    expect(messageNodes[1].textContent).toContain('Позже')

    const container = query<HTMLElement>(
      getMountedRoot(),
      '.chat-window__chat-messages-container'
    )

    expect(container.scrollTop).toBe(480)
    rafSpy.mockRestore()
  })

  it('Обработка ошибок подключения websocket', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedSetChatToken.mockRejectedValue(new Error('fail'))

    Store.setState('user', {
      id: 7,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      login: 'ivan',
      avatar: null,
      email: 'ivan@mail.ru',
      phone: '79991234567',
    })
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      {
        id: 1,
        title: 'Мой чат',
        type: 'chat',
        unread_count: 0,
        created_by: 7,
      },
    ])

    mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    await flushPromises()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('Очистка socket-клиента при закрытии активного чата', async () => {
    Store.setState('user', {
      id: 7,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      login: 'ivan',
      avatar: null,
      email: 'ivan@mail.ru',
      phone: '79991234567',
    })
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      {
        id: 1,
        title: 'Мой чат',
        type: 'chat',
        unread_count: 0,
        created_by: 7,
      },
    ])

    let onClose: (() => void) | undefined

    mockedGetSocket.mockImplementation(({ onClose: handleClose }) => {
      onClose = handleClose as typeof onClose

      return {
        socket: {} as WebSocket,
        send: jest.fn(),
        sendMessage: jest.fn(),
        sendFile: jest.fn(),
        getOldMessages: jest.fn(),
        close: jest.fn(),
      }
    })

    mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    await flushPromises()
    onClose?.()

    expect(onClose).toBeDefined()
  })

  it('Игнорирование пустых websocket-пayload', async () => {
    Store.setState('user', {
      id: 7,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      login: 'ivan',
      avatar: null,
      email: 'ivan@mail.ru',
      phone: '79991234567',
    })
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      {
        id: 1,
        title: 'Мой чат',
        type: 'chat',
        unread_count: 0,
        created_by: 7,
      },
    ])

    let onMessage: ((data: unknown) => void) | undefined

    mockedGetSocket.mockImplementation(({ onMessage: handleMessage }) => {
      onMessage = handleMessage as typeof onMessage

      return {
        socket: {} as WebSocket,
        send: jest.fn(),
        sendMessage: jest.fn(),
        sendFile: jest.fn(),
        getOldMessages: jest.fn(),
        close: jest.fn(),
      }
    })

    mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    await flushPromises()
    onMessage?.([])

    expect(getMountedRoot().textContent).not.toContain('Привет!')
  })

  it('Пустая дата, когда объединённая история пустая', async () => {
    Store.setState('user', {
      id: 7,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      login: 'ivan',
      avatar: null,
      email: 'ivan@mail.ru',
      phone: '79991234567',
    })
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      {
        id: 1,
        title: 'Мой чат',
        type: 'chat',
        unread_count: 0,
        created_by: 7,
      },
    ])

    let onMessage: ((data: unknown) => void) | undefined

    mockedGetSocket.mockImplementation(({ onMessage: handleMessage }) => {
      onMessage = handleMessage as typeof onMessage

      return {
        socket: {} as WebSocket,
        send: jest.fn(),
        sendMessage: jest.fn(),
        sendFile: jest.fn(),
        getOldMessages: jest.fn(),
        close: jest.fn(),
      }
    })
    mockedMergeSocketMessages.mockReturnValueOnce([])

    mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    await flushPromises()
    onMessage?.([
      {
        id: 1,
        user_id: 7,
        chat_id: 1,
        time: '2026-06-24T10:30:00.000Z',
        type: 'message',
        content: 'Привет!',
      },
    ])

    expect(getMountedRoot().querySelector('.chat-window__chat-messages-date')).toBeNull()
  })

  it('Отправка текстового сообщения через websocket', async () => {
    const sendMessage = jest.fn()

    Store.setState('user', {
      id: 7,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      login: 'ivan',
      avatar: null,
      email: 'ivan@mail.ru',
      phone: '79991234567',
    })
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      {
        id: 1,
        title: 'Мой чат',
        type: 'chat',
        unread_count: 0,
        created_by: 7,
      },
    ])

    mockedGetSocket.mockReturnValue({
      socket: {} as WebSocket,
      send: jest.fn(),
      sendMessage,
      sendFile: jest.fn(),
      getOldMessages: jest.fn(),
      close: jest.fn(),
    })

    mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    await flushPromises()

    const input = query<HTMLInputElement>(
      getMountedRoot(),
      '.chat-window__chat-input-texarea'
    )
    input.value = 'Новое'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    query<HTMLFormElement>(getMountedRoot(), '.chat-window__chat-input-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    expect(sendMessage).toHaveBeenCalledWith('Новое')
  })

  it('Не отправляет сообщение, когда socket недоступен', () => {
    const sendMessage = jest.fn()
    const block = new ChatWindowBlock({
      onLeaveChat: jest.fn(),
      toggleModal: jest.fn(),
    })

    mount(block.element())

    const handleSendMessage = (
      block as unknown as { handleSendMessage: (message: string) => void }
    ).handleSendMessage

    handleSendMessage('   ')
    handleSendMessage('Привет')

    expect(sendMessage).not.toHaveBeenCalled()
  })

  it('Не загружает вложение, когда socket недоступен', async () => {
    const block = new ChatWindowBlock({
      onLeaveChat: jest.fn(),
      toggleModal: jest.fn(),
    })

    mount(block.element())

    await (
      block as unknown as { handleSendAttachment: (file: File) => Promise<void> }
    ).handleSendAttachment(new File(['data'], 'photo.png', { type: 'image/png' }))

    expect(mockedUploadResource).not.toHaveBeenCalled()
  })

  it('Загрузка вложения и отправка через websocket', async () => {
    const sendFile = jest.fn()
    mockedUploadResource.mockResolvedValue('/uploads/file.png')

    Store.setState('user', {
      id: 7,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      login: 'ivan',
      avatar: null,
      email: 'ivan@mail.ru',
      phone: '79991234567',
    })
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      {
        id: 1,
        title: 'Мой чат',
        type: 'chat',
        unread_count: 0,
        created_by: 7,
      },
    ])

    mockedGetSocket.mockReturnValue({
      socket: {} as WebSocket,
      send: jest.fn(),
      sendMessage: jest.fn(),
      sendFile,
      getOldMessages: jest.fn(),
      close: jest.fn(),
    })

    mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    await flushPromises()

    const file = new File(['data'], 'photo.png', { type: 'image/png' })
    const input = query<HTMLInputElement>(getMountedRoot(), '#chat-media-input')

    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))

    await flushPromises()

    expect(mockedUploadResource).toHaveBeenCalled()
    expect(sendFile).toHaveBeenCalledWith('/uploads/file.png')
  })

  it('Отображение файловых сообщений из websocket', async () => {
    Store.setState('user', {
      id: 7,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      login: 'ivan',
      avatar: null,
      email: 'ivan@mail.ru',
      phone: '79991234567',
    })
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      {
        id: 1,
        title: 'Мой чат',
        type: 'chat',
        unread_count: 0,
        created_by: 7,
      },
    ])

    let onMessage: ((data: unknown) => void) | undefined

    mockedGetSocket.mockImplementation(({ onMessage: handleMessage }) => {
      onMessage = handleMessage as typeof onMessage

      return {
        socket: {} as WebSocket,
        send: jest.fn(),
        sendMessage: jest.fn(),
        sendFile: jest.fn(),
        getOldMessages: jest.fn(),
        close: jest.fn(),
      }
    })

    mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    await flushPromises()

    onMessage?.([
      {
        id: 2,
        user_id: 8,
        chat_id: 1,
        time: '2026-06-24T10:31:00.000Z',
        type: 'file',
        content: '/uploads/photo.png',
      },
    ])

    expect(
      query<HTMLImageElement>(getMountedRoot(), '.chat-window__chat-messages-media--image').src
    ).toContain('photo.png')
  })

  it('Отображение видео и файловых вложений из websocket', async () => {
    Store.setState('user', {
      id: 7,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      login: 'ivan',
      avatar: null,
      email: 'ivan@mail.ru',
      phone: '79991234567',
    })
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      {
        id: 1,
        title: 'Мой чат',
        type: 'chat',
        unread_count: 0,
        created_by: 7,
      },
    ])

    let onMessage: ((data: unknown) => void) | undefined

    mockedGetSocket.mockImplementation(({ onMessage: handleMessage }) => {
      onMessage = handleMessage as typeof onMessage

      return {
        socket: {} as WebSocket,
        send: jest.fn(),
        sendMessage: jest.fn(),
        sendFile: jest.fn(),
        getOldMessages: jest.fn(),
        close: jest.fn(),
      }
    })

    mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    await flushPromises()

    onMessage?.([
      {
        id: 3,
        user_id: 8,
        chat_id: 1,
        time: '2026-06-24T10:32:00.000Z',
        type: 'file',
        content: '/uploads/clip.mp4',
      },
      {
        id: 4,
        user_id: 8,
        chat_id: 1,
        time: '2026-06-24T10:33:00.000Z',
        type: 'file',
        content: '/uploads/report.pdf',
      },
    ])

    expect(
      query<HTMLVideoElement>(getMountedRoot(), '.chat-window__chat-messages-media--video').src
    ).toContain('clip.mp4')
    expect(
      query<HTMLAnchorElement>(getMountedRoot(), '.chat-window__chat-messages-file-link').textContent
    ).toBe('report.pdf')
  })

  it('Логирование ошибок загрузки вложений', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedUploadResource.mockRejectedValue(new Error('upload failed'))

    Store.setState('user', {
      id: 7,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      login: 'ivan',
      avatar: null,
      email: 'ivan@mail.ru',
      phone: '79991234567',
    })
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      {
        id: 1,
        title: 'Мой чат',
        type: 'chat',
        unread_count: 0,
        created_by: 7,
      },
    ])

    mockedGetSocket.mockReturnValue({
      socket: {} as WebSocket,
      send: jest.fn(),
      sendMessage: jest.fn(),
      sendFile: jest.fn(),
      getOldMessages: jest.fn(),
      close: jest.fn(),
    })

    mount(ChatWindow({ onLeaveChat: jest.fn(), toggleModal: jest.fn() }))

    await flushPromises()

    const file = new File(['data'], 'photo.png', { type: 'image/png' })
    const input = query<HTMLInputElement>(getMountedRoot(), '#chat-file-input')

    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))

    await flushPromises()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('Отписка от store при destroy', () => {
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      { id: 1, title: 'Мой чат', type: 'chat', unread_count: 0 },
    ])

    const block = new ChatWindowBlock({
      onLeaveChat: jest.fn(),
      toggleModal: jest.fn(),
    })
    const renderSpy = jest.spyOn(block as never as { renderComponent: () => void }, 'renderComponent')

    mount(block.element())
    renderSpy.mockClear()
    block.destroy()

    Store.setState('chats', [
      { id: 1, title: 'Другое имя', type: 'chat', unread_count: 0 },
    ])

    expect(renderSpy).not.toHaveBeenCalled()
    renderSpy.mockRestore()
  })
})
