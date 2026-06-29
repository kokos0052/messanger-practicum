import authApi from '@shared/api/authApi'
import userApi from '@shared/api/userApi'
import Store from '@shared/store/store'
import { TUser } from '@shared/types/user'
import { deleteAuthCookies, goToLink } from '@shared/utils'
import { ProfileContent, ProfileContentBlock } from './profileContent'
import { getMountedRoot, mount, query } from '../../tests/helpers/mount'

jest.mock('@shared/api/userApi', () => ({
  __esModule: true,
  default: {
    unpdateProfile: jest.fn(),
    changePassword: jest.fn(),
  },
}))

jest.mock('@shared/api/authApi', () => ({
  __esModule: true,
  default: {
    getUser: jest.fn(),
    logout: jest.fn(),
  },
}))

jest.mock('@shared/utils', () => ({
  ...jest.requireActual('@shared/utils'),
  goToLink: jest.fn(),
  deleteAuthCookies: jest.fn(),
}))

const mockUser: TUser = {
  id: 1,
  first_name: 'Иван',
  second_name: 'Иванов',
  display_name: 'Иван',
  login: 'ivan',
  avatar: null,
  email: 'ivan@mail.ru',
  phone: '79991234567',
}

function clickProfileButton(text: string) {
  const button = Array.from(
    getMountedRoot().querySelectorAll('.profile-content__cell-button')
  ).find((item) => item.textContent?.includes(text))

  button?.dispatchEvent(new Event('click', { bubbles: true }))
}

function fillCell(name: string, value: string) {
  const input = query<HTMLInputElement>(getMountedRoot(), `input[name="${name}"]`)
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('blur', { bubbles: true }))
}

describe('ProfileContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Store.setState('user', mockUser)
  })

  it('Отображение профиля пользователя в режиме по умолчанию', () => {
    const el = mount(ProfileContent({ onChangeAvatar: jest.fn() }))

    expect(query(el, '.profile-content__avatar-name').textContent).toBe('Иван')
    expect(el.textContent).toContain('Изменить данные')
    expect(el.textContent).toContain('Выйти')
    expect(query<HTMLInputElement>(el, 'input[name="email"]').value).toBe(
      'ivan@mail.ru'
    )
  })

  it('Вызов onChangeAvatar callback', () => {
    const onChangeAvatar = jest.fn()
    mount(ProfileContent({ onChangeAvatar }))

    query(getMountedRoot(), '.profile-content__avatar-image').click()

    expect(onChangeAvatar).toHaveBeenCalledTimes(1)
  })

  it('Переключение в режим изменения информации', () => {
    mount(ProfileContent({ onChangeAvatar: jest.fn() }))

    clickProfileButton('Изменить данные')

    const el = getMountedRoot()

    expect(query(el, 'form.profile-content-cells')).toBeTruthy()
    expect(query(el, 'button.btn-primary').textContent).toBe('Сохранить')
    expect(query<HTMLInputElement>(el, 'input[name="email"]').disabled).toBe(
      false
    )
  })

  it('Переключение в режим смены пароля', () => {
    mount(ProfileContent({ onChangeAvatar: jest.fn() }))

    clickProfileButton('Изменить пароль')

    const el = getMountedRoot()

    expect(query(el, 'form.profile-content-cells')).toBeTruthy()
    expect(query(el, 'input[name="old_password"]')).toBeTruthy()
    expect(query(el, 'input[name="new_password_again"]')).toBeTruthy()
  })

  it('Отправка изменений профиля', async () => {
    const updatedUser = { ...mockUser, first_name: 'Пётр' }

    ;(userApi.unpdateProfile as jest.Mock).mockResolvedValue(undefined)
    ;(authApi.getUser as jest.Mock).mockResolvedValue(updatedUser)

    mount(ProfileContent({ onChangeAvatar: jest.fn() }))
    clickProfileButton('Изменить данные')

    query<HTMLFormElement>(getMountedRoot(), 'form.profile-content-cells').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await Promise.resolve()
    await Promise.resolve()

    expect(userApi.unpdateProfile).toHaveBeenCalled()
    expect(authApi.getUser).toHaveBeenCalled()
    expect(Store.getState().user).toEqual(updatedUser)
    expect(getMountedRoot().textContent).toContain('Изменить пароль')
  })

  it('Отправка смены пароля', async () => {
    ;(userApi.changePassword as jest.Mock).mockResolvedValue(undefined)

    mount(ProfileContent({ onChangeAvatar: jest.fn() }))
    clickProfileButton('Изменить пароль')

    fillCell('old_password', '123456')
    fillCell('new_password', '654321')
    fillCell('new_password_again', '654321')

    query<HTMLFormElement>(getMountedRoot(), 'form.profile-content-cells').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await Promise.resolve()
    await Promise.resolve()

    expect(userApi.changePassword).toHaveBeenCalledWith({
      oldPassword: '123456',
      newPassword: '654321',
    })
    expect(getMountedRoot().textContent).toContain('Изменить пароль')
  })

  it('Выход пользователя из системы', async () => {
    ;(authApi.logout as jest.Mock).mockResolvedValue(undefined)

    mount(ProfileContent({ onChangeAvatar: jest.fn() }))
    clickProfileButton('Выйти')

    await Promise.resolve()

    expect(authApi.logout).toHaveBeenCalled()
    expect(deleteAuthCookies).toHaveBeenCalled()
    expect(Store.getState().user).toBeNull()
    expect(goToLink).toHaveBeenCalledWith('/')
  })

  it('Обработка ошибок сохранения', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(userApi.unpdateProfile as jest.Mock).mockRejectedValue(new Error('fail'))

    mount(ProfileContent({ onChangeAvatar: jest.fn() }))
    clickProfileButton('Изменить данные')

    query<HTMLFormElement>(getMountedRoot(), 'form.profile-content-cells').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await Promise.resolve()
    await Promise.resolve()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('Обработка ошибки logout с редиректом', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(authApi.logout as jest.Mock).mockRejectedValue(new Error('fail'))

    mount(ProfileContent({ onChangeAvatar: jest.fn() }))
    clickProfileButton('Выйти')

    await Promise.resolve()

    expect(consoleSpy).toHaveBeenCalled()
    expect(goToLink).toHaveBeenCalledWith('/')
    consoleSpy.mockRestore()
  })

  it('Не отправляет невалидную форму пароля', async () => {
    mount(ProfileContent({ onChangeAvatar: jest.fn() }))
    clickProfileButton('Изменить пароль')

    query<HTMLFormElement>(getMountedRoot(), 'form.profile-content-cells').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    await Promise.resolve()

    expect(userApi.changePassword).not.toHaveBeenCalled()
  })

  it('Валидация несовпадения подтверждения пароля', () => {
    mount(ProfileContent({ onChangeAvatar: jest.fn() }))
    clickProfileButton('Изменить пароль')

    fillCell('new_password', '654321')
    fillCell('new_password_again', '111111')

    expect(
      getMountedRoot().querySelector('.profile-content__cell-error')?.textContent
    ).toBe('Пароли не совпадают')
  })

  it('Отправка профиля без значения phone', async () => {
    ;(userApi.unpdateProfile as jest.Mock).mockResolvedValue(undefined)
    ;(authApi.getUser as jest.Mock).mockResolvedValue(mockUser)

    const block = new ProfileContentBlock({ onChangeAvatar: jest.fn() })
    mount(block.element())
    clickProfileButton('Изменить данные')

    const profileBlock = block as unknown as {
      formValues: Record<string, string>
      checkFormValid: () => boolean
      handleSubmit: (e: Event) => Promise<void>
    }

    delete profileBlock.formValues.phone
    jest.spyOn(profileBlock, 'checkFormValid').mockReturnValue(true)

    await profileBlock.handleSubmit(new Event('submit'))

    expect(userApi.unpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ phone: '' })
    )
  })
})
