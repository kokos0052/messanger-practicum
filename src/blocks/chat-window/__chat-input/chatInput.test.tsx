import { ChatInput, ChatInputBlock } from './chatInput'
import { getMountedRoot, mount, query } from '../../../tests/helpers/mount'

describe('ChatInput', () => {
  it('Отображение поля ввода сообщения', () => {
    const el = mount(ChatInput())
    const blockEl = mount(new ChatInputBlock().element())

    expect(query<HTMLInputElement>(el, '.chat-window__chat-input-texarea')).toBeTruthy()
    expect(query<HTMLInputElement>(blockEl, '.chat-window__chat-input-texarea')).toBeTruthy()
    expect(
      query<HTMLInputElement>(el, '.chat-window__chat-input-texarea').placeholder
    ).toBe('Сообщение')
  })

  it('Переключение списка опций вложений', () => {
    mount(ChatInput())

    expect(
      getMountedRoot().querySelector('.chat-window__chat-input-options__list')
    ).toBeNull()

    query<HTMLButtonElement>(
      getMountedRoot(),
      '.chat-window__chat-input-pin-button'
    ).click()

    const el = getMountedRoot()

    expect(query(el, '.chat-window__chat-input-options__list')).toBeTruthy()
    expect(el.textContent).toContain('Фото или Видео')
    expect(el.textContent).toContain('Локация')
  })

  it('Отправка сообщения по submit', () => {
    const onSendMessage = jest.fn()

    mount(ChatInput({ onSendMessage }))

    const input = query<HTMLInputElement>(
      getMountedRoot(),
      '.chat-window__chat-input-texarea'
    )

    input.value = 'Привет'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    query<HTMLFormElement>(getMountedRoot(), '.chat-window__chat-input-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    expect(onSendMessage).toHaveBeenCalledWith('Привет')
    expect(query<HTMLInputElement>(getMountedRoot(), '.chat-window__chat-input-texarea').value).toBe(
      ''
    )
  })

  it('Игнорирование отправки пустого сообщения', () => {
    const onSendMessage = jest.fn()

    mount(ChatInput({ onSendMessage }))

    query<HTMLFormElement>(getMountedRoot(), '.chat-window__chat-input-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    expect(onSendMessage).not.toHaveBeenCalled()
  })

  it('Передача выбранного медиафайла в callback', () => {
    const onAttachMedia = jest.fn()
    const file = new File(['media'], 'photo.png', { type: 'image/png' })

    mount(ChatInput({ onAttachMedia }))

    const input = query<HTMLInputElement>(getMountedRoot(), '#chat-media-input')

    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))

    expect(onAttachMedia).toHaveBeenCalledWith(file)
    expect(input.value).toBe('')
  })

  it('Передача выбранного файла в callback', () => {
    const onAttachFile = jest.fn()
    const file = new File(['doc'], 'report.pdf', { type: 'application/pdf' })

    mount(ChatInput({ onAttachFile }))

    const input = query<HTMLInputElement>(getMountedRoot(), '#chat-file-input')

    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))

    expect(onAttachFile).toHaveBeenCalledWith(file)
  })

  it('Игнорирование change без выбранного файла', () => {
    const onAttachMedia = jest.fn()
    const onAttachFile = jest.fn()

    mount(ChatInput({ onAttachMedia, onAttachFile }))

    query<HTMLInputElement>(getMountedRoot(), '#chat-media-input').dispatchEvent(
      new Event('change', { bubbles: true })
    )
    query<HTMLInputElement>(getMountedRoot(), '#chat-file-input').dispatchEvent(
      new Event('change', { bubbles: true })
    )

    expect(onAttachMedia).not.toHaveBeenCalled()
    expect(onAttachFile).not.toHaveBeenCalled()
  })

  it('Открытие picker из меню опций', () => {
    const clickSpy = jest.spyOn(HTMLInputElement.prototype, 'click')

    mount(ChatInput())

    query<HTMLButtonElement>(
      getMountedRoot(),
      '.chat-window__chat-input-pin-button'
    ).click()

    const optionButtons = getMountedRoot().querySelectorAll<HTMLButtonElement>(
      '.chat-window__chat-input-options__list-element'
    )

    optionButtons[0].click()
    optionButtons[1].click()

    expect(clickSpy).toHaveBeenCalledTimes(2)
    expect(
      getMountedRoot().querySelector('.chat-window__chat-input-options__list')
    ).toBeNull()

    clickSpy.mockRestore()
  })
})
