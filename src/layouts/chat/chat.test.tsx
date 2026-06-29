import chatsApi from '@shared/api/chatsApi'
import Store from '@shared/store/store'
import { ChatBlock } from './chat'
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

describe('ChatBlock', () => {
  beforeEach(() => {
    mockedChatsApi.getChats.mockResolvedValue([])
    Store.setState('chats', [
      {
        id: 1,
        title: 'Рабочий чат',
        type: 'chat',
        unread_count: 0,
      },
    ])
  })

  it('Отображение панели чатов и placeholder выбора чата', () => {
    mount(new ChatBlock().element())

    const el = getMountedRoot()

    expect(el.className).toBe('chat-container')
    expect(query(el, '.chat-pannel-container')).toBeTruthy()
    expect(query(el, '.choose-chat-container')).toBeTruthy()
  })

  it('Открытие окна чата после выбора чата', () => {
    mount(new ChatBlock().element())

    query(getMountedRoot(), '.chat-pannel__chat-card-container').click()

    const el = getMountedRoot()

    expect(el.querySelector('.choose-chat-container')).toBeNull()
    expect(query(el, '.chat-window')).toBeTruthy()
  })

  it('Не переключает окно чата повторно', () => {
    const block = new ChatBlock()
    mount(block.element())

    query(getMountedRoot(), '.chat-pannel__chat-card-container').click()
    block['setChatWindow']()

    expect(getMountedRoot().querySelectorAll('.chat-window').length).toBe(1)
  })

  it('Возврат к экрану выбора чата при leave', async () => {
    const block = new ChatBlock()
    mount(block.element())

    query(getMountedRoot(), '.chat-pannel__chat-card-container').click()
    block['handleLeaveChat']()

    await flushPromises()

    const el = getMountedRoot()

    expect(query(el, '.choose-chat-container')).toBeTruthy()
    expect(el.querySelector('.chat-window')).toBeNull()
  })

  it('Отображение модалки через toggle окна чата', () => {
    Store.setState('selectedChatId', 1)

    const block = new ChatBlock()
    mount(block.element())

    query(getMountedRoot(), '.chat-pannel__chat-card-container').click()
    block['chatWindow']['props'].toggleModal()

    expect(getMountedRoot().querySelector('.modal-window')).toBeTruthy()
  })

  it('Закрытие модалки из окна чата', () => {
    const block = new ChatBlock()
    mount(block.element())

    block['setState']({ showModal: true })

    query<HTMLButtonElement>(getMountedRoot(), '.modal-close-btn').click()

    expect(getMountedRoot().querySelector('.modal-window')).toBeNull()
  })

  it('Уничтожение вложенных блоков', () => {
    const block = new ChatBlock()
    mount(block.element())

    expect(() => block.destroy()).not.toThrow()
  })
})
