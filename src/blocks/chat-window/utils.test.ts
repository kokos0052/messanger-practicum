import Store from '@shared/store/store'
import { getChatFromStore } from './utils'

describe('getChatFromStore', () => {
  it('Возврат информации о чате, когда чат существует', () => {
    Store.setState('chats', [
      {
        id: 10,
        title: 'Рабочий чат',
        type: 'chat',
        avatar: '/avatar.png',
        unread_count: 0,
      },
    ])

    expect(getChatFromStore(10)).toEqual({
      title: 'Рабочий чат',
      avatar: '/avatar.png',
    })
  })

  it('Возврат null, когда чат не найден', () => {
    Store.setState('chats', [])

    expect(getChatFromStore(999)).toBeNull()
  })

  it('Нормализация отсутствующего avatar в null', () => {
    Store.setState('chats', [
      {
        id: 1,
        title: 'Без аватара',
        type: 'chat',
        unread_count: 0,
      },
    ])

    expect(getChatFromStore(1)?.avatar).toBeNull()
  })

  it('Возврат null, когда chats в store не массив', () => {
    Store.setState('chats', null as unknown as undefined)

    expect(getChatFromStore(1)).toBeNull()
  })
})
