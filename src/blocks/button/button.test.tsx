import { Button } from './button'
import { mount } from '../../tests/helpers/mount'

describe('Button', () => {
  it('Отрисовка label и variant', () => {
    const button = mount(
      Button({
        label: 'Войти',
        variant: 'primary',
        type: 'submit',
      })
    ) as HTMLButtonElement

    expect(button.textContent).toBe('Войти')
    expect(button.className).toContain('btn-primary')
    expect(button.type).toBe('submit')
  })

  it('Вызов onClick', () => {
    const onClick = jest.fn()
    const button = mount(
      Button({
        label: 'Нажми',
        variant: 'secondary',
        type: 'button',
        onClick,
      })
    ) as HTMLButtonElement

    button.click()

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('Может ли кнопка быть отключена', () => {
    const button = mount(
      Button({
        label: 'Сохранить',
        variant: 'primary',
        type: 'submit',
        disabled: true,
      })
    ) as HTMLButtonElement

    expect(button.disabled).toBe(true)
  })
})
