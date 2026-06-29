import chatsApi from '@shared/api/chatsApi'
import Store from '@shared/store/store'
import { ChatPannel, ChatPannelBlock } from './chatPannel'
import { getMountedRoot, mount, query } from '../../tests/helpers/mount'
import { flushPromises } from '../../tests/helpers/mockXhr'

jest.mock('@shared/api/chatsApi', () => ({
  __esModule: true,
  default: {
    getChats: jest.fn(),
    createChat: jest.fn(),
  },
}))

const mockedChatsApi = chatsApi as jest.Mocked<typeof chatsApi>

describe('ChatPannel', () => {
  beforeEach(() => {
    mockedChatsApi.getChats.mockResolvedValue([])
  })

  it('Отображение пустого state когда нет чатов', async () => {
    Store.setState('chats', [])

    const el = mount(ChatPannel({ setChatWindow: jest.fn() }))

    expect(query(el, '.chat-panner-havent-chats').textContent).toBe(
      'У вас еще нет чатов'
    )
  })

  it('Отображение карточек чатов из store', () => {
    Store.setState('chats', [
      {
        id: 1,
        title: 'Чат 1',
        type: 'chat',
        unread_count: 0,
      },
      {
        id: 2,
        title: 'Чат 2',
        type: 'chat',
        unread_count: 1,
      },
    ])

    const el = mount(ChatPannel({ setChatWindow: jest.fn() }))

    expect(
      el.querySelectorAll('.chat-pannel__chat-card-container').length
    ).toBe(2)
  })

  it('Открытие модалки создания чата', () => {
    Store.setState('chats', [])

    mount(ChatPannel({ setChatWindow: jest.fn() }))

    query<HTMLButtonElement>(
      getMountedRoot(),
      '.chat-pannel__chat-add-chat'
    ).click()

    const el = getMountedRoot()

    expect(query(el, '.modal-window')).toBeTruthy()
    expect(query(el, '.modal-title').textContent).toBe('Добавить Чат')
  })

  it('Закрытие модалки при загрузке чатов', async () => {
    Store.setState('chats', undefined)
    let resolveLoad: (value: unknown[]) => void = () => {}
    mockedChatsApi.getChats.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLoad = resolve
        })
    )

    mount(ChatPannel({ setChatWindow: jest.fn() }))

    query<HTMLButtonElement>(
      getMountedRoot(),
      '.chat-pannel__chat-add-chat'
    ).click()
    query<HTMLButtonElement>(getMountedRoot(), '.modal-close-btn').click()

    expect(getMountedRoot().querySelector('.modal-window')).toBeNull()

    resolveLoad([])
    await flushPromises()
  })

  it('Закрытие модалки создания чата после загрузки', () => {
    Store.setState('chats', [])

    mount(ChatPannel({ setChatWindow: jest.fn() }))

    query<HTMLButtonElement>(
      getMountedRoot(),
      '.chat-pannel__chat-add-chat'
    ).click()
    query<HTMLButtonElement>(getMountedRoot(), '.modal-close-btn').click()

    expect(getMountedRoot().querySelector('.modal-window')).toBeNull()
  })

  it('Загрузка чатов при монтировании, когда store пустой', async () => {
    Store.setState('chats', undefined)
    mockedChatsApi.getChats.mockResolvedValue([
      { id: 1, title: 'Новый', type: 'chat', unread_count: 0 },
    ])

    mount(ChatPannel({ setChatWindow: jest.fn() }))

    expect(getMountedRoot().textContent).toContain('Загрузка...')
    await flushPromises()

    expect(mockedChatsApi.getChats).toHaveBeenCalled()
    expect(getMountedRoot().textContent).toContain('Новый')
  })

  it('Создание чата из формы модалки', async () => {
    Store.setState('chats', [])
    mockedChatsApi.createChat.mockResolvedValue(undefined)
    mockedChatsApi.getChats.mockResolvedValue([
      { id: 3, title: 'Созданный', type: 'chat', unread_count: 0 },
    ])

    mount(ChatPannel({ setChatWindow: jest.fn() }))

    query<HTMLButtonElement>(
      getMountedRoot(),
      '.chat-pannel__chat-add-chat'
    ).click()

    const input = query<HTMLInputElement>(
      getMountedRoot(),
      'input[name="chatName"]'
    )
    input.value = 'Созданный'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    query<HTMLFormElement>(getMountedRoot(), '.modal-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await flushPromises()

    expect(mockedChatsApi.createChat).toHaveBeenCalledWith({
      title: 'Созданный',
    })
    expect(getMountedRoot().querySelector('.modal-window')).toBeNull()
  })

  it('Обработка ошибки создания чата', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    Store.setState('chats', [])
    mockedChatsApi.createChat.mockRejectedValue(new Error('fail'))

    mount(ChatPannel({ setChatWindow: jest.fn() }))

    query<HTMLButtonElement>(
      getMountedRoot(),
      '.chat-pannel__chat-add-chat'
    ).click()

    const input = query<HTMLInputElement>(
      getMountedRoot(),
      'input[name="chatName"]'
    )
    input.value = 'Ошибка'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    query<HTMLFormElement>(getMountedRoot(), '.modal-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await flushPromises()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('Вызов setChatWindow при клике на карточку чата', () => {
    const setChatWindow = jest.fn()

    Store.setState('chats', [
      { id: 5, title: 'Чат', type: 'chat', unread_count: 0 },
    ])

    mount(ChatPannel({ setChatWindow }))

    query<HTMLElement>(getMountedRoot(), '.chat-pannel__chat-card-container').click()

    expect(setChatWindow).toHaveBeenCalled()
    expect(Store.getState().selectedChatId).toBe(5)
  })

  it('Перерисовка при изменении store', () => {
    Store.setState('chats', [])

    mount(ChatPannel({ setChatWindow: jest.fn() }))

    Store.setState('chats', [
      { id: 1, title: 'Появился', type: 'chat', unread_count: 0 },
    ])

    expect(getMountedRoot().textContent).toContain('Появился')
  })

  it('Обработка chats в store не в виде массива', () => {
    Store.setState('chats', null as unknown as undefined)

    mount(ChatPannel({ setChatWindow: jest.fn() }))

    expect(getMountedRoot().textContent).toContain('У вас еще нет чатов')
  })

  it('Повторное использование promise загрузки чатов', async () => {
    Store.setState('chats', undefined)
    let resolveLoad: (value: unknown[]) => void = () => {}
    mockedChatsApi.getChats.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLoad = resolve
        })
    )

    const block = new ChatPannelBlock({ setChatWindow: jest.fn() })
    mount(block.element())

    const firstPromise = block.reloadChats()
    const secondPromise = block.reloadChats()

    expect(secondPromise).toBe(firstPromise)

    resolveLoad([])
    await flushPromises()
  })

  it('Отписка при destroy', () => {
    Store.setState('chats', [])

    const block = new ChatPannelBlock({ setChatWindow: jest.fn() })
    const renderSpy = jest.spyOn(
      block as never as { renderComponent: () => void },
      'renderComponent'
    )

    mount(block.element())
    block.destroy()

    Store.setState('chats', [
      { id: 99, title: 'Не должен', type: 'chat', unread_count: 0 },
    ])

    expect(renderSpy).not.toHaveBeenCalled()
    renderSpy.mockRestore()
  })
})
