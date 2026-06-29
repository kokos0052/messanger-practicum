import { installMockXhr, MockXMLHttpRequest } from '../../tests/helpers/mockXhr'
import chatsApi from './chatsApi'

describe('chatsApi', () => {
  beforeEach(() => {
    installMockXhr()
  })

  const resolveLastRequest = (responseText = '[]') => {
    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = responseText
    xhr.onload?.()
  }

  it('Получение списка чатов', async () => {
    const promise = chatsApi.getChats()
    resolveLastRequest('[{"id":1}]')
    await expect(promise).resolves.toEqual([{ id: 1 }])

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('GET')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/chats/')
  })

  it('Создание чата', async () => {
    const promise = chatsApi.createChat({ title: 'Новый чат' })
    resolveLastRequest('{"id":2}')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('POST')
    expect(MockXMLHttpRequest.last?.sentBody).toBe(
      JSON.stringify({ title: 'Новый чат' })
    )
  })

  it('Удаление чата', async () => {
    const promise = chatsApi.deleteChat({ chatId: 1 })
    resolveLastRequest('OK')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('DELETE')
    expect(MockXMLHttpRequest.last?.sentBody).toBe(JSON.stringify({ chatId: 1 }))
  })

  it('Получение пользователей чата', async () => {
    const promise = chatsApi.getChatUsers('10')
    resolveLastRequest('[]')
    await promise

    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/chats/10/users')
  })

  it('Добавление пользователей в чат', async () => {
    const promise = chatsApi.addChatUser({ chatId: 1, users: [2, 3] })
    resolveLastRequest('OK')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('PUT')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/chats/users')
  })

  it('Удаление пользователей из чата', async () => {
    const promise = chatsApi.deleteChatUser({ chatId: 1, users: [2] })
    resolveLastRequest('OK')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('DELETE')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/chats/users')
  })

  it('Обновление avatar чата', async () => {
    const formData = new FormData()
    formData.append('chatId', '1')
    formData.append('avatar', 'file')

    const promise = chatsApi.updateChatAvatar(formData)
    resolveLastRequest('OK')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('PUT')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/chats/avatar')
    expect(MockXMLHttpRequest.last?.sentBody).toBe(formData)
  })

  it('Установка token чата', async () => {
    const promise = chatsApi.setChatToken('5', { token: 'abc' })
    resolveLastRequest('OK')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('POST')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/chats/token/5')
  })

  it('Получение отправленных файлов чата', async () => {
    const promise = chatsApi.getChatSentFiles('3')
    resolveLastRequest('[]')
    await promise

    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/chats/3/files')
  })

  it('Получение архивных чатов', async () => {
    const promise = chatsApi.getArchiveChat()
    resolveLastRequest('[]')
    await promise

    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/chats/archive')
  })

  it('Архивация чата', async () => {
    const promise = chatsApi.archiveChat({ chatId: 1 })
    resolveLastRequest('OK')
    await promise

    expect(MockXMLHttpRequest.last?.openedMethod).toBe('POST')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/chats/archive')
  })

  it('Разархивация чата', async () => {
    const promise = chatsApi.unarchiveChat({ chatId: 1 })
    resolveLastRequest('OK')
    await promise

    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/chats/unarchive')
  })

  it('Получение common chat', async () => {
    const promise = chatsApi.getCommonChat('7')
    resolveLastRequest('{}')
    await promise

    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/chats/7/common')
  })

  it('Получение количества новых сообщений', async () => {
    const promise = chatsApi.getNewMessagesCount('8')
    resolveLastRequest('0')
    await promise

    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/chats/new/8')
  })
})
