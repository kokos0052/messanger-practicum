import { ChatSearch } from './chetSearch'
import { mount, query } from '../../../tests/helpers/mount'
import { goToLink } from '@shared/utils'

jest.mock('@shared/utils', () => ({
  ...jest.requireActual('@shared/utils'),
  goToLink: jest.fn(),
}))

describe('ChatSearch', () => {
  it('Отображение поля поиска и кнопки добавления чата', () => {
    const el = mount(ChatSearch({ addChatHander: jest.fn() }))

    expect(query(el, '.chat-pannel__chat-seach-input')).toBeTruthy()
    expect(query(el, '.chat-pannel__chat-add-chat').textContent).toBe(
      'Добавить чат'
    )
  })

  it('Вызов addChatHander при клике на кнопку добавления', () => {
    const addChatHander = jest.fn()
    const el = mount(ChatSearch({ addChatHander }))

    query<HTMLButtonElement>(el, '.chat-pannel__chat-add-chat').click()

    expect(addChatHander).toHaveBeenCalledTimes(1)
  })

  it('Переход в настройки по клику на профиль', () => {
    const el = mount(ChatSearch({ addChatHander: jest.fn() }))

    query(el, '.chat-pannel__chat-seach-profile-container').click()

    expect(goToLink).toHaveBeenCalledWith('/settings')
  })
})
