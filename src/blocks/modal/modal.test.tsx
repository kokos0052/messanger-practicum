import { Modal } from './modal'
import { getMountedRoot, mount, query } from '../../tests/helpers/mount'

describe('Modal', () => {
  it('Отображение form-модалки с полями', () => {
    const onClose = jest.fn()
    const action = jest.fn()

    const el = mount(
      Modal({
        modalTitle: 'Новый чат',
        buttonText: 'Создать',
        modalFields: [{ fieldId: 'chatName', fieldLabel: 'Название' }],
        onClose,
        action,
      })
    )

    expect(query(el, '.modal-title').textContent).toBe('Новый чат')
    expect(query(el, 'form')).toBeTruthy()
    expect(query<HTMLInputElement>(el, 'input[name="chatName"]')).toBeTruthy()
  })

  it('Вызов onClose при клике на кнопку закрытия', () => {
    const onClose = jest.fn()

    const el = mount(
      Modal({
        modalTitle: 'Заголовок',
        buttonText: 'OK',
        onClose,
      })
    )

    query<HTMLButtonElement>(el, '.modal-close-btn').click()

    expect(onClose).toHaveBeenCalled()
  })

  it('Отображение file-варианта модалки', () => {
    const action = jest.fn()

    const el = mount(
      Modal<File>({
        modalTitle: 'Загрузите файл',
        buttonText: 'Сохранить',
        link: 'Выбрать файл',
        variant: 'file',
        onClose: jest.fn(),
        action,
      })
    )

    expect(query<HTMLInputElement>(el, '#modal-file-input').type).toBe('file')
    expect(el.textContent).toContain('Выбрать файл')
  })

  it('Закрытие по клику на overlay', () => {
    const onClose = jest.fn()

    mount(
      Modal({
        modalTitle: 'Заголовок',
        buttonText: 'OK',
        onClose,
      })
    )

    getMountedRoot().dispatchEvent(new Event('click', { bubbles: true }))

    expect(onClose).toHaveBeenCalled()
  })

  it('Отправка данных формы через action', () => {
    const action = jest.fn()

    mount(
      Modal({
        modalTitle: 'Новый чат',
        buttonText: 'Создать',
        modalFields: [{ fieldId: 'chatName', fieldLabel: 'Название' }],
        onClose: jest.fn(),
        action,
      })
    )

    const input = query<HTMLInputElement>(getMountedRoot(), 'input[name="chatName"]')
    input.value = 'Команда'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    query<HTMLFormElement>(getMountedRoot(), '.modal-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    expect(action).toHaveBeenCalledWith({ chatName: 'Команда' })
  })

  it('Вызов action с выбранным файлом', () => {
    const action = jest.fn()

    mount(
      Modal<File>({
        modalTitle: 'Файл',
        buttonText: 'OK',
        variant: 'file',
        onClose: jest.fn(),
        action,
      })
    )

    const file = new File(['data'], 'file.png', { type: 'image/png' })
    const input = query<HTMLInputElement>(getMountedRoot(), '#modal-file-input')

    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))

    expect(action).toHaveBeenCalledWith(file)
  })

  it('Отображение ссылки для non-file модалки без полей', () => {
    mount(
      Modal({
        modalTitle: 'Инфо',
        buttonText: 'OK',
        link: 'Подробнее',
        onClose: jest.fn(),
      })
    )

    expect(query(getMountedRoot(), 'a.modal-link').textContent).toBe('Подробнее')
  })

  it('Игнорирование change file input без файла', () => {
    const action = jest.fn()

    mount(
      Modal<File>({
        modalTitle: 'Файл',
        buttonText: 'OK',
        variant: 'file',
        onClose: jest.fn(),
        action,
      })
    )

    query<HTMLInputElement>(getMountedRoot(), '#modal-file-input').dispatchEvent(
      new Event('change', { bubbles: true })
    )

    expect(action).not.toHaveBeenCalled()
  })

  it('Игнорирование file input, когда action отсутствует', () => {
    mount(
      Modal({
        modalTitle: 'Файл',
        buttonText: 'OK',
        variant: 'file',
        onClose: jest.fn(),
      })
    )

    const file = new File(['data'], 'file.png', { type: 'image/png' })
    const input = query<HTMLInputElement>(getMountedRoot(), '#modal-file-input')

    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))
  })
})
