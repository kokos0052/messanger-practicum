import chatsApi from '@shared/api/chatsApi'
import userApi from '@shared/api/userApi'
import { TUser } from '@shared/types/user'
import { UserPicker, UserPickerBlock } from './userPicker'
import { getMountedRoot, mount, query } from '../../tests/helpers/mount'
import { flushPromises } from '../../tests/helpers/mockXhr'

jest.mock('@shared/api/chatsApi', () => ({
  __esModule: true,
  default: {
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
    id: 1,
    first_name: 'Анна',
    second_name: 'Петрова',
    display_name: 'Анна',
    login: 'anna',
    avatar: null,
    email: 'anna@mail.ru',
    phone: '79990001122',
  },
]

describe('UserPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Загрузка пользователей чата в list mode', async () => {
    mockedChatsApi.getChatUsers.mockResolvedValue(users)

    mount(
      UserPicker({
        mode: 'list',
        chatId: 10,
        title: 'Удалить пользователя',
        buttonText: 'Удалить',
        onClose: jest.fn(),
        onSelect: jest.fn(),
      })
    )

    await flushPromises()

    expect(mockedChatsApi.getChatUsers).toHaveBeenCalledWith('10')
    expect(getMountedRoot().textContent).toContain('Анна (@anna)')
  })

  it('Отображение ошибки, когда chat id отсутствует в list mode', async () => {
    mount(
      UserPicker({
        mode: 'list',
        chatId: 0,
        title: 'Удалить пользователя',
        buttonText: 'Удалить',
        onClose: jest.fn(),
        onSelect: jest.fn(),
      })
    )

    await flushPromises()

    expect(getMountedRoot().textContent).toContain('Чат не выбран')
  })

  it('Обработка ошибки загрузки пользователей чата', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedChatsApi.getChatUsers.mockRejectedValue(new Error('fail'))

    mount(
      UserPicker({
        mode: 'list',
        chatId: 10,
        title: 'Удалить пользователя',
        buttonText: 'Удалить',
        onClose: jest.fn(),
        onSelect: jest.fn(),
      })
    )

    await flushPromises()

    expect(getMountedRoot().textContent).toContain(
      'Не удалось загрузить участников чата'
    )
    consoleSpy.mockRestore()
  })

  it('Отображение сообщения о пустом списке пользователей чата', async () => {
    mockedChatsApi.getChatUsers.mockResolvedValue([])

    mount(
      UserPicker({
        mode: 'list',
        chatId: 10,
        title: 'Удалить пользователя',
        buttonText: 'Удалить',
        onClose: jest.fn(),
        onSelect: jest.fn(),
      })
    )

    await flushPromises()

    expect(getMountedRoot().textContent).toContain('В чате нет пользователей')
  })

  it('Поиск пользователей в search mode', async () => {
    jest.useFakeTimers()
    mockedUserApi.searchUser.mockResolvedValue(users)

    mount(
      UserPicker({
        mode: 'search',
        chatId: 10,
        title: 'Добавить пользователя',
        buttonText: 'Добавить',
        onClose: jest.fn(),
        onSelect: jest.fn(),
      })
    )

    const input = query<HTMLInputElement>(getMountedRoot(), '.user-picker__input')
    input.value = 'anna'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    jest.advanceTimersByTime(300)
    await flushPromises()

    expect(mockedUserApi.searchUser).toHaveBeenCalledWith('anna')
    expect(getMountedRoot().textContent).toContain('Анна (@anna)')

    jest.useRealTimers()
  })

  it('Очистка пользователей при пустом поисковом запросе', async () => {
    jest.useFakeTimers()
    mockedUserApi.searchUser.mockResolvedValue(users)

    mount(
      UserPicker({
        mode: 'search',
        chatId: 10,
        title: 'Добавить пользователя',
        buttonText: 'Добавить',
        onClose: jest.fn(),
        onSelect: jest.fn(),
      })
    )

    const input = query<HTMLInputElement>(getMountedRoot(), '.user-picker__input')
    input.value = 'anna'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    jest.advanceTimersByTime(300)
    await flushPromises()

    input.value = ''
    input.dispatchEvent(new Event('input', { bubbles: true }))

    expect(getMountedRoot().querySelector('.user-picker__list')).toBeNull()

    jest.useRealTimers()
  })

  it('Отображение сообщения «не найдено» для пустого результата поиска', async () => {
    jest.useFakeTimers()
    mockedUserApi.searchUser.mockResolvedValue([])

    mount(
      UserPicker({
        mode: 'search',
        chatId: 10,
        title: 'Добавить пользователя',
        buttonText: 'Добавить',
        onClose: jest.fn(),
        onSelect: jest.fn(),
      })
    )

    const input = query<HTMLInputElement>(getMountedRoot(), '.user-picker__input')
    input.value = 'missing'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    jest.advanceTimersByTime(300)
    await flushPromises()

    expect(getMountedRoot().textContent).toContain('Пользователи не найдены')

    jest.useRealTimers()
  })

  it('Обработка ошибки поиска', async () => {
    jest.useFakeTimers()
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedUserApi.searchUser.mockRejectedValue(new Error('fail'))

    mount(
      UserPicker({
        mode: 'search',
        chatId: 10,
        title: 'Добавить пользователя',
        buttonText: 'Добавить',
        onClose: jest.fn(),
        onSelect: jest.fn(),
      })
    )

    const input = query<HTMLInputElement>(getMountedRoot(), '.user-picker__input')
    input.value = 'anna'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    jest.advanceTimersByTime(300)
    await flushPromises()

    expect(getMountedRoot().textContent).toContain('Не удалось выполнить поиск')
    consoleSpy.mockRestore()

    jest.useRealTimers()
  })

  it('Отправка выбранного пользователя', async () => {
    mockedChatsApi.getChatUsers.mockResolvedValue(users)
    const onSelect = jest.fn().mockResolvedValue(undefined)
    const onClose = jest.fn()

    mount(
      UserPicker({
        mode: 'list',
        chatId: 10,
        title: 'Удалить пользователя',
        buttonText: 'Удалить',
        onClose,
        onSelect,
      })
    )

    await flushPromises()

    query<HTMLButtonElement>(getMountedRoot(), '.user-picker__item').click()
    query<HTMLFormElement>(getMountedRoot(), '.user-picker-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await flushPromises()

    expect(onSelect).toHaveBeenCalledWith(users[0])
    expect(onClose).toHaveBeenCalled()
  })

  it('Обработка ошибки submit', async () => {
    mockedChatsApi.getChatUsers.mockResolvedValue(users)
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const onSelect = jest.fn().mockRejectedValue(new Error('fail'))

    mount(
      UserPicker({
        mode: 'list',
        chatId: 10,
        title: 'Удалить пользователя',
        buttonText: 'Удалить',
        onClose: jest.fn(),
        onSelect,
      })
    )

    await flushPromises()

    query<HTMLButtonElement>(getMountedRoot(), '.user-picker__item').click()
    query<HTMLFormElement>(getMountedRoot(), '.user-picker-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await flushPromises()

    expect(getMountedRoot().textContent).toContain('Не удалось выполнить действие')
    consoleSpy.mockRestore()
  })

  it('Закрытие по клику на overlay', async () => {
    mockedChatsApi.getChatUsers.mockResolvedValue(users)
    const onClose = jest.fn()

    mount(
      UserPicker({
        mode: 'list',
        chatId: 10,
        title: 'Удалить пользователя',
        buttonText: 'Удалить',
        onClose,
        onSelect: jest.fn(),
      })
    )

    getMountedRoot().dispatchEvent(new Event('click', { bubbles: true }))

    expect(onClose).toHaveBeenCalled()
  })

  it('Закрытие по клику на кнопку закрытия', async () => {
    mockedChatsApi.getChatUsers.mockResolvedValue(users)
    const onClose = jest.fn()

    mount(
      UserPicker({
        mode: 'list',
        chatId: 10,
        title: 'Удалить пользователя',
        buttonText: 'Удалить',
        onClose,
        onSelect: jest.fn(),
      })
    )

    query<HTMLButtonElement>(getMountedRoot(), '.modal-close-btn').click()

    expect(onClose).toHaveBeenCalled()
  })

  it('Не отправляет, когда пользователь не выбран', async () => {
    mockedChatsApi.getChatUsers.mockResolvedValue(users)
    const onSelect = jest.fn()

    mount(
      UserPicker({
        mode: 'list',
        chatId: 10,
        title: 'Удалить пользователя',
        buttonText: 'Удалить',
        onClose: jest.fn(),
        onSelect,
      })
    )

    await flushPromises()

    query<HTMLFormElement>(getMountedRoot(), '.user-picker-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await flushPromises()

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('Пропуск поиска, когда запрос стал пустым до request', async () => {
    jest.useFakeTimers()

    const block = new UserPickerBlock({
      mode: 'search',
      chatId: 10,
      title: 'Добавить',
      buttonText: 'Добавить',
      onClose: jest.fn(),
      onSelect: jest.fn(),
    })

    mount(block.element())

    const input = query<HTMLInputElement>(getMountedRoot(), '.user-picker__input')
    input.value = 'a'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    ;(block as unknown as { query: string }).query = ''
    await (block as unknown as { searchUsers: () => Promise<void> }).searchUsers()

    expect(mockedUserApi.searchUser).not.toHaveBeenCalled()

    jest.useRealTimers()
  })

  it('Очистка таймера поиска при destroy', () => {
    jest.useFakeTimers()
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    const block = new UserPickerBlock({
      mode: 'search',
      chatId: 10,
      title: 'Добавить',
      buttonText: 'Добавить',
      onClose: jest.fn(),
      onSelect: jest.fn(),
    })

    mount(block.element())

    const input = query<HTMLInputElement>(getMountedRoot(), '.user-picker__input')
    input.value = 'a'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    block.destroy()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
    jest.useRealTimers()
  })
})
