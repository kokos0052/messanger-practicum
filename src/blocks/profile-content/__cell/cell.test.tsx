import { Cell } from './cell'
import { getMountedRoot, mount, query } from '../../../tests/helpers/mount'
import { REQUIRED_VALIDATORS } from '@shared/utils'

describe('Cell', () => {
  it('Отображение disabled-ячейки со value', () => {
    const el = mount(
      Cell({
        cellKey: 'Почта',
        cellId: 'info_mail',
        cellName: 'email',
        cellType: 'text',
        cellValue: 'test@mail.ru',
        isActive: false,
      })
    )

    const input = query<HTMLInputElement>(el, 'input')

    expect(input.value).toBe('test@mail.ru')
    expect(input.disabled).toBe(true)
    expect(query(el, '.profile-content__cell-key').textContent).toBe('Почта')
  })

  it('Валидация обязательного поля на blur', () => {
    const onChange = jest.fn()

    mount(
      Cell({
        cellKey: 'Логин',
        cellId: 'info_login',
        cellName: 'login',
        cellType: 'text',
        cellValue: '',
        validators: REQUIRED_VALIDATORS,
        onChange,
      })
    )

    query<HTMLInputElement>(getMountedRoot(), 'input').dispatchEvent(
      new Event('blur')
    )

    const el = getMountedRoot()

    expect(el.className).toContain('profile-content__cell-container--error')
    expect(el.querySelector('.profile-content__cell-error')?.textContent).toBe(
      'Поле обязательно для заполнения'
    )
  })

  it('Вызов onChange при input с phone mask', () => {
    const onChange = jest.fn()

    mount(
      Cell({
        cellKey: 'Телефон',
        cellId: 'info_phone',
        cellName: 'phone',
        cellType: 'tel',
        cellValue: '',
        mask: 'phone',
        onChange,
      })
    )

    const input = query<HTMLInputElement>(getMountedRoot(), 'input')
    input.value = '79991234567'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    expect(onChange).toHaveBeenCalledWith('phone', expect.stringMatching(/^\+7/))
  })
})
