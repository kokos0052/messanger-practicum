import chatsApi from '@shared/api/chatsApi'
import userApi from '@shared/api/userApi'
import Store from '@shared/store/store'
import { TUser } from '@shared/types/user'
import { ChatHeader } from './chatHeader'
import { getMountedRoot, mount, query } from '../../../tests/helpers/mount'
import { flushPromises } from '../../../tests/helpers/mockXhr'

jest.mock('@shared/api/chatsApi', () => ({
  __esModule: true,
  default: {
    updateChatAvatar: jest.fn(),
    getChats: jest.fn(),
    addChatUser: jest.fn(),
    deleteChatUser: jest.fn(),
    deleteChat: jest.fn(),
    getChatUsers: jest.fn(),
  },
}))

jest.mock('@shared/api/userApi', () => ({
  __esModule: true,
  default: {
    searchUser: jest.fn(),
  },
}))

const mockedChatsApi = chatsApi as jest.Mocked<typeof chatsApi>
const mockedUserApi = userApi as jest.Mocked<typeof userApi>

const users: TUser[] = [
  {
    id: 2,
    first_name: 'Анна',
    second_name: 'Петрова',
    display_name: 'Анна',
    login: 'anna',
    avatar: null,
    email: 'anna@mail.ru',
    phone: '79990001122',
  },
]

function openOptionsMenu() {
  query<HTMLButtonElement>(
    getMountedRoot(),
    '.chat-window__chat-header-options-button'
  ).click()
}

function clickMenuItem(text: string) {
  const item = Array.from(
    getMountedRoot().querySelectorAll('.chat-window__chat-header-options__list-element')
  ).find((element) => element.textContent?.includes(text))

  item?.dispatchEvent(new Event('click', { bubbles: true }))
}

describe('ChatHeader', () => {
  beforeEach(() => {
    Store.setState('selectedChatId', 1)
    Store.setState('chats', [
      { id: 1, title: 'Команда', type: 'chat', unread_count: 0 },
    ])
    mockedChatsApi.getChats.mockResolvedValue([])
    mockedChatsApi.deleteChat.mockResolvedValue(undefined)
    mockedChatsApi.updateChatAvatar.mockResolvedValue(undefined)
    mockedChatsApi.addChatUser.mockResolvedValue(undefined)
    mockedChatsApi.deleteChatUser.mockResolvedValue(undefined)
    mockedChatsApi.getChatUsers.mockResolvedValue(users)
  })

  it('Отображение имени чата и avatar', () => {
    const el = mount(
      ChatHeader({
        chatName: 'Команда',
        chatAvatar: '/avatar.png',
        onLeaveChat: jest.fn(),
      })
    )

    expect(
      query(el, '.chat-window__chat-header-user-info-name').textContent
    ).toBe('Команда')
    expect(
      query<HTMLImageElement>(
        el,
        '.chat-window__chat-header-user-info-avatar-image'
      ).src
    ).toContain('/avatar.png')
  })

  it('Открытие и закрытие меню опций', () => {
    mount(
      ChatHeader({
        chatName: 'Команда',
        onLeaveChat: jest.fn(),
      })
    )

    openOptionsMenu()
    expect(query(getMountedRoot(), '.chat-window__chat-header-options__list')).toBeTruthy()

    openOptionsMenu()
    expect(
      getMountedRoot().querySelector('.chat-window__chat-header-options__list')
    ).toBeNull()
  })

  it('Открытие модалки avatar и загрузка avatar', async () => {
    mockedChatsApi.getChats.mockResolvedValue([
      { id: 1, title: 'Команда', type: 'chat', unread_count: 0 },
    ])

    mount(
      ChatHeader({
        chatName: 'Команда',
        onLeaveChat: jest.fn(),
      })
    )

    query<HTMLElement>(getMountedRoot(), '.chat-window__chat-header-user-info-avatar').click()

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' })
    const input = query<HTMLInputElement>(getMountedRoot(), '#modal-file-input')

    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))

    await flushPromises()

    expect(mockedChatsApi.updateChatAvatar).toHaveBeenCalled()
    expect(mockedChatsApi.getChats).toHaveBeenCalled()
    expect(getMountedRoot().querySelector('.modal-window')).toBeNull()
  })

  it('Открытие picker добавления пользователя и добавление', async () => {
    jest.useFakeTimers()
    mockedUserApi.searchUser.mockResolvedValue(users)

    mount(
      ChatHeader({
        chatName: 'Команда',
        onLeaveChat: jest.fn(),
      })
    )

    openOptionsMenu()
    clickMenuItem('Добавить пользователя')

    const input = query<HTMLInputElement>(getMountedRoot(), '.user-picker__input')
    input.value = 'anna'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    jest.advanceTimersByTime(300)
    await flushPromises()

    query<HTMLButtonElement>(getMountedRoot(), '.user-picker__item').click()
    query<HTMLFormElement>(getMountedRoot(), '.user-picker-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await flushPromises()

    expect(mockedChatsApi.addChatUser).toHaveBeenCalledWith({
      chatId: 1,
      users: [2],
    })

    jest.useRealTimers()
  })

  it('Открытие picker удаления пользователя и удаление', async () => {
    Store.setState('user', { ...users[0], id: 1 })

    mount(
      ChatHeader({
        chatName: 'Команда',
        onLeaveChat: jest.fn(),
      })
    )

    openOptionsMenu()
    clickMenuItem('Удалить пользователя')

    await flushPromises()

    query<HTMLButtonElement>(getMountedRoot(), '.user-picker__item').click()
    query<HTMLFormElement>(getMountedRoot(), '.user-picker-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await flushPromises()

    expect(mockedChatsApi.deleteChatUser).toHaveBeenCalledWith({
      chatId: 1,
      users: [2],
    })
  })

  it('Выход из чата при удалении себя', async () => {
    const onLeaveChat = jest.fn()
    Store.setState('user', users[0])

    mount(
      ChatHeader({
        chatName: 'Команда',
        onLeaveChat,
      })
    )

    openOptionsMenu()
    clickMenuItem('Удалить пользователя')

    await flushPromises()

    query<HTMLButtonElement>(getMountedRoot(), '.user-picker__item').click()
    query<HTMLFormElement>(getMountedRoot(), '.user-picker-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await flushPromises()

    expect(onLeaveChat).toHaveBeenCalled()
    expect(Store.getState().selectedChatId).toBeNull()
  })

  it('Удаление чата и вызов onLeaveChat', async () => {
    const onLeaveChat = jest.fn()

    mount(
      ChatHeader({
        chatName: 'Команда',
        onLeaveChat,
      })
    )

    openOptionsMenu()
    clickMenuItem('Удалить чат')

    await flushPromises()

    expect(mockedChatsApi.deleteChat).toHaveBeenCalledWith({ chatId: 1 })
    expect(onLeaveChat).toHaveBeenCalled()
    expect(Store.getState().selectedChatId).toBeNull()
  })

  it('Обработка ошибки удаления чата', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedChatsApi.deleteChat.mockRejectedValue(new Error('fail'))

    mount(
      ChatHeader({
        chatName: 'Команда',
        onLeaveChat: jest.fn(),
      })
    )

    openOptionsMenu()
    clickMenuItem('Удалить чат')

    await flushPromises()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('Закрытие модалки avatar', () => {
    mount(
      ChatHeader({
        chatName: 'Команда',
        onLeaveChat: jest.fn(),
      })
    )

    query<HTMLElement>(getMountedRoot(), '.chat-window__chat-header-user-info-avatar').click()
    expect(getMountedRoot().querySelector('.modal-window')).toBeTruthy()

    query<HTMLButtonElement>(getMountedRoot(), '.modal-close-btn').click()

    expect(getMountedRoot().querySelector('.modal-window')).toBeNull()
  })

  it('Обработка ошибки загрузки avatar', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedChatsApi.updateChatAvatar.mockRejectedValue(new Error('fail'))

    mount(
      ChatHeader({
        chatName: 'Команда',
        onLeaveChat: jest.fn(),
      })
    )

    query<HTMLElement>(getMountedRoot(), '.chat-window__chat-header-user-info-avatar').click()

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' })
    const input = query<HTMLInputElement>(getMountedRoot(), '#modal-file-input')

    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))

    await flushPromises()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('Обработка chats в store не массивом при удалении чата', async () => {
    const onLeaveChat = jest.fn()
    Store.setState('chats', null)

    mount(
      ChatHeader({
        chatName: 'Команда',
        onLeaveChat,
      })
    )

    openOptionsMenu()
    clickMenuItem('Удалить чат')

    await flushPromises()

    expect(onLeaveChat).toHaveBeenCalled()
    expect(Store.getState().chats).toEqual([])
  })

  it('Обработка chats в store не массивом при удалении себя', async () => {
    const onLeaveChat = jest.fn()
    Store.setState('user', users[0])
    Store.setState('chats', null)

    mount(
      ChatHeader({
        chatName: 'Команда',
        onLeaveChat,
      })
    )

    openOptionsMenu()
    clickMenuItem('Удалить пользователя')

    await flushPromises()

    query<HTMLButtonElement>(getMountedRoot(), '.user-picker__item').click()
    query<HTMLFormElement>(getMountedRoot(), '.user-picker-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await flushPromises()

    expect(onLeaveChat).toHaveBeenCalled()
    expect(Store.getState().chats).toEqual([])
  })
})
