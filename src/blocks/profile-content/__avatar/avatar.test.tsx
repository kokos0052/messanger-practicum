import { Avatar } from './avatar'
import { mount, query } from '../../../tests/helpers/mount'

describe('Avatar', () => {
  it('Отображение имени пользователя', () => {
    const el = mount(
      Avatar({
        userName: 'Иван Иванов',
        avatar: null,
        onChangeAvatar: jest.fn(),
      })
    )

    expect(query(el, '.profile-content__avatar-name').textContent).toBe(
      'Иван Иванов'
    )
  })

  it('Вызов onChangeAvatar по клику на изображение', () => {
    const onChangeAvatar = jest.fn()

    const el = mount(
      Avatar({
        userName: 'Иван',
        avatar: '/user.png',
        onChangeAvatar,
      })
    )

    query(el, '.profile-content__avatar-image').click()

    expect(onChangeAvatar).toHaveBeenCalledTimes(1)
  })
})
