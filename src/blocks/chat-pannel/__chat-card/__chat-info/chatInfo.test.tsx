import { ChatInfo } from './chatInfo'
import { mount, query } from '../../../../tests/helpers/mount'

describe('ChatInfo', () => {
  it('Отображение имени чата и сообщения', () => {
    const el = mount(
      ChatInfo({
        chatName: 'Команда',
        message: 'Привет!',
        sendAt: '12:30',
        isOwnMessage: false,
      })
    )

    expect(query(el, '.chat-pannel__chat-card__chat-info-title').textContent).toBe(
      'Команда'
    )
    expect(query(el, '.chat-pannel__chat-card__chat-info-text').textContent).toBe(
      'Привет!'
    )
    expect(query(el, '.chat-card__chat-info-time').textContent).toBe('12:30')
  })

  it('Префикс «Вы:» для своих сообщений', () => {
    const el = mount(
      ChatInfo({
        chatName: 'Команда',
        message: 'Моё сообщение',
        sendAt: '13:00',
        isOwnMessage: true,
      })
    )

    expect(el.textContent).toContain('Вы:')
    expect(el.textContent).toContain('Моё сообщение')
  })
})
