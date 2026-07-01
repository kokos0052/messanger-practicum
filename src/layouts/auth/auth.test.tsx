import { AuthBlock } from './auth'
import { goToLink } from '@shared/utils'
import { getMountedRoot, mount, query } from '../../tests/helpers/mount'

jest.mock('@shared/utils', () => ({
  ...jest.requireActual('@shared/utils'),
  goToLink: jest.fn(),
}))

describe('AuthBlock', () => {
  it('Отображение формы входа', () => {
    mount(new AuthBlock({ formType: 'loginForm' }).element())

    const el = getMountedRoot()

    expect(el.className).toBe('centered-content-container')
    expect(query(el, '.header').textContent).toBe('Вход')
    expect(query<HTMLInputElement>(el, 'input[name="login"]')).toBeTruthy()
    expect(query<HTMLInputElement>(el, 'input[name="password"]')).toBeTruthy()
    expect(query(el, '.button-container-auth__login')).toBeTruthy()
  })

  it('Отображение формы регистрации со всеми полями', () => {
    mount(new AuthBlock({ formType: 'signupForm' }).element())

    const el = getMountedRoot()

    expect(query(el, '.header').textContent).toBe('Регистрация')
    expect(query<HTMLInputElement>(el, 'input[name="email"]')).toBeTruthy()
    expect(query<HTMLInputElement>(el, 'input[name="phone"]')).toBeTruthy()
    expect(query<HTMLInputElement>(el, 'input[name="password_two"]')).toBeTruthy()
    expect(query(el, '.button-container-auth__signin')).toBeTruthy()
  })

  it('Отключение кнопки submit по умолчанию', () => {
    mount(new AuthBlock({ formType: 'loginForm' }).element())

    const submit = query<HTMLButtonElement>(
      getMountedRoot(),
      '.button-container .btn-primary'
    )

    expect(submit.disabled).toBe(true)
  })

  it('Переход на sign-up из формы входа', () => {
    mount(new AuthBlock({ formType: 'loginForm' }).element())

    query<HTMLButtonElement>(getMountedRoot(), '.btn-secondary').dispatchEvent(
      new Event('click', { bubbles: true })
    )

    expect(goToLink).toHaveBeenCalledWith('/sign-up')
  })

  it('Переход на login из формы регистрации', () => {
    mount(new AuthBlock({ formType: 'signupForm' }).element())

    query<HTMLButtonElement>(getMountedRoot(), '.btn-secondary').dispatchEvent(
      new Event('click', { bubbles: true })
    )

    expect(goToLink).toHaveBeenCalledWith('/')
  })
})
