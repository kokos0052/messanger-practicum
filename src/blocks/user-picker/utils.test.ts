import { TUser } from '@shared/types/user'
import { getUserLabel, normalizeUsers } from './utils'

describe('user-picker utils', () => {
  describe('normalizeUsers', () => {
    it('Возврат пустого массива для non-array input', () => {
      expect(normalizeUsers(null)).toEqual([])
      expect(normalizeUsers({})).toEqual([])
    })

    it('Возврат массива users без изменений', () => {
      const users = [{ id: 1, login: 'user1' }]

      expect(normalizeUsers(users)).toEqual(users)
    })
  })

  describe('getUserLabel', () => {
    const baseUser: TUser = {
      id: 1,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: null,
      login: 'ivan',
      avatar: null,
      email: 'ivan@mail.ru',
      phone: '79991234567',
    }

    it('Использование display_name, когда доступен', () => {
      expect(
        getUserLabel({ ...baseUser, display_name: 'Vanya' })
      ).toBe('Vanya (@ivan)')
    })

    it('Использование first_name и second_name, если display_name пустой', () => {
      expect(getUserLabel(baseUser)).toBe('Иван Иванов (@ivan)')
    })

    it('Использование login, когда имя пустое', () => {
      expect(
        getUserLabel({
          ...baseUser,
          first_name: '',
          second_name: '',
          display_name: null,
        })
      ).toBe('ivan')
    })
  })
})
