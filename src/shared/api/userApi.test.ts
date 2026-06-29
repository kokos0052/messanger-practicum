import { installMockXhr, MockXMLHttpRequest } from '../../tests/helpers/mockXhr'
import userApi from './userApi'

describe('userApi', () => {
  beforeEach(() => {
    installMockXhr()
  })

  const resolveLastRequest = (responseText = '{}') => {
    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = responseText
    xhr.onload?.()
  }

  it('Обновление профиля', async () => {
    const promise = userApi.unpdateProfile({ first_name: 'Иван' })
    resolveLastRequest('{"id":1}')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('PUT')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/user/profile')
  })

  it('Обновление avatar', async () => {
    const formData = new FormData()
    formData.append('avatar', 'file')

    const promise = userApi.updateAvatar(formData)
    resolveLastRequest('OK')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('PUT')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/user/profile/avatar')
    expect(MockXMLHttpRequest.last?.sentBody).toBe(formData)
  })

  it('Смена пароля', async () => {
    const promise = userApi.changePassword({
      oldPassword: '123456',
      newPassword: '654321',
    })
    resolveLastRequest('OK')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('PUT')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/user/password')
  })

  it('Поиск пользователей по login', async () => {
    const promise = userApi.searchUser('anna')
    resolveLastRequest('[]')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('POST')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/user/search')
    expect(MockXMLHttpRequest.last?.sentBody).toBe(
      JSON.stringify({ login: 'anna' })
    )
  })
})
