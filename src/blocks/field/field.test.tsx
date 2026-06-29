import { Store } from '@shared/store'
import { Field, FiledBlock } from './field'
import { getMountedRoot, mount, query } from '../../tests/helpers/mount'
import { REQUIRED_VALIDATORS } from '@shared/utils'

describe('Field', () => {
  it('Отображение label и input', () => {
    const el = mount(
      Field({
        id: 'email',
        name: 'email',
        label: 'Почта',
        type: 'text',
      })
    )

    expect(query<HTMLInputElement>(el, 'input').id).toBe('email')
    expect(query<HTMLLabelElement>(el, 'label').textContent).toBe('Почта')
  })

  it('Отображение ошибки валидации на blur', () => {
    mount(
      Field({
        id: 'login',
        name: 'login',
        label: 'Логин',
        type: 'text',
        validators: REQUIRED_VALIDATORS,
      })
    )

    const input = query<HTMLInputElement>(getMountedRoot(), 'input')
    input.dispatchEvent(new Event('blur'))

    const el = getMountedRoot()

    expect(el.querySelector('.form-input__error')?.textContent).toBe(
      'Поле обязательно для заполнения'
    )
    expect(el.className).toContain('form-input--error')
  })

  it('Placeholder телефона для phone mask', () => {
    mount(
      Field({
        id: 'phone',
        name: 'phone',
        label: 'Телефон',
        type: 'tel',
        mask: 'phone',
      })
    )

    expect(query<HTMLInputElement>(getMountedRoot(), 'input').placeholder).toBe(
      '+7 (___) ___-__-__'
    )
  })

  it('Синхронизация value с внешним store', () => {
    const store = new Store()
    store.setState('login', 'initial')

    mount(
      Field({
        id: 'login',
        name: 'login',
        label: 'Логин',
        type: 'text',
        store,
      })
    )

    store.setState('login', 'updated')

    expect(query<HTMLInputElement>(getMountedRoot(), 'input').value).toBe(
      'updated'
    )
  })

  it('Вызов onChange и onBlur callbacks', () => {
    const onChange = jest.fn()
    const onBlur = jest.fn()

    mount(
      Field({
        id: 'login',
        name: 'login',
        label: 'Логин',
        type: 'text',
        onChange,
        onBlur,
      })
    )

    const input = query<HTMLInputElement>(getMountedRoot(), 'input')
    input.value = 'ivan'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('blur', { bubbles: true }))

    expect(onChange).toHaveBeenCalled()
    expect(onBlur).toHaveBeenCalled()
  })

  it('Обновление store при input', () => {
    const store = new Store()

    mount(
      Field({
        id: 'login',
        name: 'login',
        label: 'Логин',
        type: 'text',
        store,
      })
    )

    const input = query<HTMLInputElement>(getMountedRoot(), 'input')
    input.value = 'new-login'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    expect(store.getState().login).toBe('new-login')
  })

  it('Применение phone mask при input', () => {
    const store = new Store()
    mount(
      Field({
        id: 'phone',
        name: 'phone',
        label: 'Телефон',
        type: 'tel',
        mask: 'phone',
        store,
      })
    )

    const input = query<HTMLInputElement>(getMountedRoot(), 'input')
    input.value = '79991234567'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    expect(store.getState().phone).toMatch(/^\+7/)
  })

  it('Отписка от store при destroy', () => {
    const store = new Store()
    const block = new FiledBlock({
      id: 'login',
      name: 'login',
      label: 'Логин',
      type: 'text',
      store,
    })

    mount(block.element())
    block.destroy()

    expect(() => store.setState('login', 'value')).not.toThrow()
  })

  it('Игнорирование обновлений store для того же value', () => {
    const store = new Store()
    store.setState('login', 'same')

    const block = new FiledBlock({
      id: 'login',
      name: 'login',
      label: 'Логин',
      type: 'text',
      store,
    })

    mount(block.element())
    store.setState('login', 'same')

    expect(query<HTMLInputElement>(getMountedRoot(), 'input').value).toBe('same')
    block.destroy()
  })

  it('Поддержка props конструктора по умолчанию', () => {
    const block = new FiledBlock()

    expect(block).toBeInstanceOf(FiledBlock)
  })

  it('Игнорирование store callback, когда store не передан', () => {
    const block = new FiledBlock({
      id: 'login',
      name: 'login',
      label: 'Логин',
      type: 'text',
    })

    expect(() =>
      (block as unknown as { onStoreChange: () => void }).onStoreChange()
    ).not.toThrow()
  })
})
