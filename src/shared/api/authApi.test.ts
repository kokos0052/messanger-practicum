import { installMockXhr, MockXMLHttpRequest } from '../../tests/helpers/mockXhr'
import authApi from './authApi'

describe('authApi', () => {
  beforeEach(() => {
    installMockXhr()
  })

  const resolveLastRequest = (responseText = '{}') => {
    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = responseText
    xhr.onload?.()
  }

  it('Регистрация пользователя', async () => {
    const promise = authApi.signup({ login: 'ivan' })
    resolveLastRequest('{"id":1}')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('POST')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/auth/signup')
  })

  it('Вход пользователя', async () => {
    const promise = authApi.signin({ login: 'ivan', password: '123456' })
    resolveLastRequest('{"id":1}')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('POST')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/auth/signin')
  })

  it('Выход пользователя из системы', async () => {
    const promise = authApi.logout()
    resolveLastRequest('OK')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('POST')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/auth/logout')
  })

  it('Получение текущего пользователя', async () => {
    const promise = authApi.getUser()
    resolveLastRequest('{"id":1,"login":"ivan"}')
    await expect(promise).resolves.toEqual({ id: 1, login: 'ivan' })

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('GET')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/auth/user')
  })
})
