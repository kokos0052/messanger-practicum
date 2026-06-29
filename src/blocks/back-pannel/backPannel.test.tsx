import { BackPannel } from './backPannel'
import { mount, query } from '../../tests/helpers/mount'
import { goToLink } from '@shared/utils'

jest.mock('@shared/utils', () => ({
  ...jest.requireActual('@shared/utils'),
  goToLink: jest.fn(),
}))

describe('BackPannel', () => {
  it('Отображение кнопки назад', () => {
    const el = mount(BackPannel())

    expect(el.className).toBe('back-pannel')
    expect(query(el, '.back-pannel-button')).toBeTruthy()
  })

  it('Навигация к сообщениям по клику', () => {
    const el = mount(BackPannel())

    query<HTMLButtonElement>(el, '.back-pannel-button').click()

    expect(goToLink).toHaveBeenCalledWith('/messenger')
  })
})
