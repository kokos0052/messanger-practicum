import { ChooseChat } from './chooseChat'
import { mount } from '../../tests/helpers/mount'

describe('ChooseChat', () => {
  it('Отображение placeholder-текста', () => {
    const el = mount(ChooseChat())

    expect(el.className).toBe('choose-chat-container')
    expect(el.textContent).toContain('Выберите чат чтобы отправить сообщение')
  })
})
