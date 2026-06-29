import { ErrorBlock } from './error'
import { goToLink } from '@shared/utils'
import { getMountedRoot, mount, query } from '../../tests/helpers/mount'

jest.mock('@shared/utils', () => ({
  ...jest.requireActual('@shared/utils'),
  goToLink: jest.fn(),
}))

describe('ErrorBlock', () => {
  it('Отображение кода и сообщения ошибки', () => {
    mount(
      new ErrorBlock({
        code: '404',
        message: 'Страница не найдена',
      }).element()
    )

    const el = getMountedRoot()

    expect(query(el, '.error-code-heading').textContent).toBe('404')
    expect(query(el, '.header').textContent).toBe('Страница не найдена')
  })

  it('Возврат в messenger', () => {
    mount(
      new ErrorBlock({
        code: '500',
        message: 'Ошибка сервера',
      }).element()
    )

    query<HTMLButtonElement>(getMountedRoot(), '.btn-secondary').click()

    expect(goToLink).toHaveBeenCalledWith('/messenger')
  })
})
