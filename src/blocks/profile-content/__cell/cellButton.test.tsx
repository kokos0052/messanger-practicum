import { CellButton } from './cellButton'
import { mount, query } from '../../../tests/helpers/mount'

describe('CellButton', () => {
  it('Отображение названия action', () => {
    const el = mount(
      CellButton({
        actionName: 'Изменить данные',
        action: jest.fn(),
        isFirst: true,
        isLast: false,
      })
    )

    expect(query(el, '.profile-content__cell-key').textContent).toBe(
      'Изменить данные'
    )
    expect(el.className).toContain('profile-content__cell-container-not-spasing')
    expect(el.className).toContain('profile-content__cell-button-border')
  })

  it('Вызов action по клику', () => {
    const action = jest.fn()

    const button = mount(
      CellButton({
        actionName: 'Выйти',
        action,
        isFirst: false,
        isLast: true,
      })
    ) as HTMLButtonElement

    button.click()

    expect(action).toHaveBeenCalledTimes(1)
  })
})
