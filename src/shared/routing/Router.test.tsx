import { h, Block } from '@core/index'
import authApi from '@shared/api/authApi'
import Store from '@shared/store/store'
import { Router } from './Router'
import { flushPromises } from '../../tests/helpers/mockXhr'

jest.mock('@shared/api/authApi', () => ({
  __esModule: true,
  default: {
    getUser: jest.fn(),
  },
}))

const mockedAuthApi = authApi as jest.Mocked<typeof authApi>

class TestBlock extends Block<{ label?: string }> {
  render() {
    return <div class="router-test-block">{this.props.label ?? 'page'}</div>
  }
}

function resetRouter() {
  ;(Router as unknown as { __instance: Router | null }).__instance = null
}

describe('Router', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetRouter()
    document.body.innerHTML = '<div id="app"></div>'
    window.history.replaceState({}, '', '/')
  })

  it('Отображение подходящего route', async () => {
    const router = new Router('#app')
    router.use('/home', TestBlock, { label: 'Home' })

    router.go('/home')
    await flushPromises()

    expect(document.querySelector('.router-test-block')?.textContent).toBe('Home')
  })

  it('Отображение 404 route для неизвестного path', async () => {
    const router = new Router('#app')
    router.use('/404', TestBlock, { label: 'Not found' })

    router.go('/unknown')
    await flushPromises()

    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'Not found'
    )
  })

  it('Редирект неавторизованного пользователя с protected route на login', async () => {
    mockedAuthApi.getUser.mockRejectedValue(new Error('Unauthorized'))

    const replaceStateSpy = jest.spyOn(window.history, 'replaceState')

    const router = new Router('#app')
    router.use('/', TestBlock, { label: 'Login' })
    router.protectedUse('/messenger', TestBlock, { label: 'Messenger' })

    router.go('/messenger')
    await flushPromises()

    expect(replaceStateSpy).toHaveBeenCalledWith({}, '', '/')
    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'Login'
    )
  })

  it('Редирект авторизованного пользователя с guest route в messenger', async () => {
    mockedAuthApi.getUser.mockResolvedValue({ id: 1, login: 'ivan' })
    const replaceStateSpy = jest.spyOn(window.history, 'replaceState')

    const router = new Router('#app')
    router.guestUse('/', TestBlock, { label: 'Login' })
    router.use('/messenger', TestBlock, { label: 'Messenger' })

    router.go('/')
    await flushPromises()

    expect(replaceStateSpy).toHaveBeenCalledWith({}, '', '/messenger')
    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'Messenger'
    )
    expect(Store.getState().user).toEqual({ id: 1, login: 'ivan' })
  })

  it('Очистка selectedChatId при выходе из messenger', async () => {
    Store.setState('selectedChatId', 10)

    const router = new Router('#app')
    router.use('/settings', TestBlock)

    router.go('/settings')
    await flushPromises()

    expect(Store.getState().selectedChatId).toBeNull()
  })

  it('Сохранение selectedChatId на route messenger', async () => {
    Store.setState('selectedChatId', 10)

    const router = new Router('#app')
    router.use('/messenger', TestBlock)

    router.go('/messenger')
    await flushPromises()

    expect(Store.getState().selectedChatId).toBe(10)
  })

  it('Использование wildcard route как fallback', async () => {
    const router = new Router('#app')
    router.use('*', TestBlock, { label: 'Fallback' })

    router.go('/anything')
    await flushPromises()

    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'Fallback'
    )
  })

  it('Выход из предыдущего route при навигации', async () => {
    const router = new Router('#app')
    router.use('/first', TestBlock, { label: 'First' })
    router.use('/second', TestBlock, { label: 'Second' })

    router.go('/first')
    await flushPromises()
    router.go('/second')
    await flushPromises()

    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'Second'
    )
  })

  it('Старт на текущем pathname', async () => {
    const router = new Router('#app')
    router.use('/pop', TestBlock, { label: 'Popstate' })

    window.history.pushState({}, '', '/pop')
    router.start()
    await flushPromises()

    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'Popstate'
    )
  })

  it('Пропуск auth-проверок для публичных error-страниц', async () => {
    const router = new Router('#app')
    router.use('/404', TestBlock, { label: '404 page' })

    router.go('/404')
    await flushPromises()

    expect(mockedAuthApi.getUser).not.toHaveBeenCalled()
    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      '404 page'
    )
  })

  it('Возврат singleton-экземпляра router', () => {
    resetRouter()
    const router = new Router('#app')

    expect(Router.getInstance()).toBe(router)
    expect(new Router('#other')).toBe(router)
  })

  it('Не редиректит guest, когда пользователь не авторизован', async () => {
    mockedAuthApi.getUser.mockRejectedValue(new Error('Unauthorized'))

    const router = new Router('#app')
    router.guestUse('/', TestBlock, { label: 'Login' })

    router.go('/')
    await flushPromises()

    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'Login'
    )
  })

  it('Выход из текущего route при отображении 404', async () => {
    const router = new Router('#app')
    router.use('/home', TestBlock, { label: 'Home' })
    router.use('/404', TestBlock, { label: 'Not found' })

    router.go('/home')
    await flushPromises()
    router.go('/unknown')
    await flushPromises()

    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'Not found'
    )
  })

  it('Выход из текущего route при редиректе авторизованного guest', async () => {
    mockedAuthApi.getUser.mockResolvedValue({ id: 1, login: 'ivan' })

    const router = new Router('#app')
    router.guestUse('/', TestBlock, { label: 'Login' })
    router.use('/settings', TestBlock, { label: 'Settings' })
    router.use('/messenger', TestBlock, { label: 'Messenger' })

    router.go('/settings')
    await flushPromises()
    router.go('/')
    await flushPromises()

    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'Messenger'
    )
  })

  it('Игнорирование concurrent route checks', async () => {
    mockedAuthApi.getUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ id: 1, login: 'ivan' }), 50)
        })
    )

    const router = new Router('#app')
    router.protectedUse('/messenger', TestBlock, { label: 'Messenger' })

    router.go('/messenger')
    router.go('/messenger')

    await flushPromises()
    await new Promise((resolve) => setTimeout(resolve, 60))

    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'Messenger'
    )
  })

  it('Доступ к protected route для авторизованного пользователя', async () => {
    mockedAuthApi.getUser.mockResolvedValue({ id: 1, login: 'ivan' })

    const router = new Router('#app')
    router.protectedUse('/messenger', TestBlock, { label: 'Messenger' })

    router.go('/messenger')
    await flushPromises()

    expect(Store.getState().user).toEqual({ id: 1, login: 'ivan' })
    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'Messenger'
    )
  })

  it('Обработка back/forward браузера через popstate', async () => {
    const router = new Router('#app')
    router.use('/first', TestBlock, { label: 'First' })
    router.use('/second', TestBlock, { label: 'Second' })

    window.history.replaceState({}, '', '/first')
    router.start()
    await flushPromises()

    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'First'
    )

    router.go('/second')
    await flushPromises()

    window.history.replaceState({}, '', '/first')
    window.onpopstate?.(new PopStateEvent('popstate'))
    await flushPromises()

    expect(document.querySelector('.router-test-block')?.textContent).toBe(
      'First'
    )
  })
})
