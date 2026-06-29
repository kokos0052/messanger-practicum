import chatsApi from '@shared/api/chatsApi'
import Store from '@shared/store/store'
import { TUser } from '@shared/types/user'
import { ProfileBlock } from './profile'
import userApi from '@shared/api/userApi'
import authApi from '@shared/api/authApi'
import { getMountedRoot, mount, query } from '../../tests/helpers/mount'

jest.mock('@shared/api/userApi', () => ({
  __esModule: true,
  default: {
    updateAvatar: jest.fn(),
  },
}))

jest.mock('@shared/api/authApi', () => ({
  __esModule: true,
  default: {
    getUser: jest.fn(),
  },
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

describe('ProfileBlock', () => {
  beforeEach(() => {
    Store.setState('user', mockUser)
  })

  it('Отображение layout профиля', () => {
    mount(new ProfileBlock().element())

    const el = getMountedRoot()

    expect(el.className).toBe('profile-container')
    expect(query(el, '.back-pannel')).toBeTruthy()
    expect(query(el, '.profile-content-container')).toBeTruthy()
  })

  it('Открытие модалки загрузки avatar', () => {
    mount(new ProfileBlock().element())

    query(getMountedRoot(), '.profile-content__avatar-image').click()

    const el = getMountedRoot()

    expect(query(el, '.modal-window')).toBeTruthy()
    expect(query(el, '.modal-title').textContent).toBe('Загрузите файл')
  })

  it('Загрузка avatar и обновление user в store', async () => {
    const updatedUser = { ...mockUser, avatar: '/new-avatar.png' }

    ;(userApi.updateAvatar as jest.Mock).mockResolvedValue(undefined)
    ;(authApi.getUser as jest.Mock).mockResolvedValue(updatedUser)

    mount(new ProfileBlock().element())

    query(getMountedRoot(), '.profile-content__avatar-image').click()

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' })
    const input = query<HTMLInputElement>(getMountedRoot(), '#modal-file-input')

    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))

    await Promise.resolve()
    await Promise.resolve()

    expect(userApi.updateAvatar).toHaveBeenCalled()
    expect(authApi.getUser).toHaveBeenCalled()
    expect(Store.getState().user).toEqual(updatedUser)
  })

  it('Обработка ошибки загрузки avatar', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(userApi.updateAvatar as jest.Mock).mockRejectedValue(new Error('fail'))

    mount(new ProfileBlock().element())

    query(getMountedRoot(), '.profile-content__avatar-image').click()

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' })
    const input = query<HTMLInputElement>(getMountedRoot(), '#modal-file-input')

    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))

    await Promise.resolve()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('Закрытие модалки avatar', () => {
    mount(new ProfileBlock().element())

    query(getMountedRoot(), '.profile-content__avatar-image').click()
    query<HTMLButtonElement>(getMountedRoot(), '.modal-close-btn').click()

    expect(getMountedRoot().querySelector('.modal-window')).toBeNull()
  })
})
