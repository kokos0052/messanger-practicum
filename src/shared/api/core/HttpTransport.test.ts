import { HTTPTransport } from './HttpTransport'
import { METHODS } from './constaints'
import { installMockXhr, MockXMLHttpRequest } from '../../../tests/helpers/mockXhr'

describe('HTTPTransport', () => {
  beforeEach(() => {
    installMockXhr()
  })

  it('GET-запрос и парсинг JSON-ответа', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.get('/users')

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = '{"id":1}'
    xhr.onload?.()

    await expect(promise).resolves.toEqual({ id: 1 })
    expect(xhr.open).toHaveBeenCalledWith('GET', 'https://example.com/api/users')
    expect(xhr.withCredentials).toBe(true)
  })

  it('Добавление query string для GET с data', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.get('/search', { data: { login: 'ivan' } })

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = '[]'
    xhr.onload?.()

    await promise

    expect(xhr.openedUrl).toBe('https://example.com/api/search?login=ivan')
  })

  it('Отправка JSON body для POST-запроса', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.post('/signin', {
      data: { login: 'ivan', password: '123456' },
    })

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 201
    xhr.responseText = '{"id":1}'
    xhr.onload?.()

    await promise

    expect(xhr.openedMethod).toBe(METHODS.POST)
    expect(xhr.sentBody).toBe(JSON.stringify({ login: 'ivan', password: '123456' }))
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/json'
    )
  })

  it('Отправка FormData без изменений', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const formData = new FormData()
    formData.append('avatar', 'file')

    const promise = transport.put('/avatar', { data: formData })

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = 'OK'
    xhr.onload?.()

    await promise

    expect(xhr.sentBody).toBe(formData)
  })

  it('Отклонение promise при HTTP error status', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.delete('/chats', { data: { chatId: 1 } })

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 500
    xhr.statusText = 'Internal Server Error'
    xhr.responseText = 'error'
    xhr.onload?.()

    await expect(promise).rejects.toMatchObject({
      status: 500,
      statusText: 'Internal Server Error',
    })
  })

  it('Отклонение promise при network error', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.get('/user')

    const xhr = MockXMLHttpRequest.last!
    xhr.onerror?.()

    await expect(promise).rejects.toMatchObject({ reason: 'Network error' })
  })

  it('Использование absolute url без base prefix', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.get('https://other.com/data')

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = 'ok'
    xhr.onload?.()

    await promise

    expect(xhr.openedUrl).toBe('https://other.com/data')
  })

  it('Возврат plain text, когда content type не json', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.get('/text')

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = 'plain-response'
    xhr.getResponseHeader = jest.fn((header: string) =>
      header === 'Content-Type' ? 'text/plain' : null
    ) as typeof xhr.getResponseHeader
    xhr.onload?.()

    await expect(promise).resolves.toBe('plain-response')
  })

  it('Отклонение promise, когда method отсутствует', async () => {
    const transport = new HTTPTransport('https://example.com/api')

    await expect(
      transport.request('/broken', {})
    ).rejects.toThrow('HTTP method is required')
  })

  it('Отклонение promise при timeout и abort', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const timeoutPromise = transport.get('/slow')
    MockXMLHttpRequest.last!.ontimeout?.()
    await expect(timeoutPromise).rejects.toMatchObject({ reason: 'Request timeout' })

    const abortPromise = transport.get('/abort')
    MockXMLHttpRequest.last!.onabort?.()
    await expect(abortPromise).rejects.toMatchObject({ reason: 'Request aborted' })
  })

  it('Использование custom headers и responseType', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.get('/blob', {
      headers: { Authorization: 'Bearer token' },
      responseType: 'blob',
    })

    const xhr = MockXMLHttpRequest.last!
    xhr.responseType = 'blob'
    xhr.response = new Blob(['data'])
    xhr.status = 200
    xhr.onload?.()

    await expect(promise).resolves.toBeInstanceOf(Blob)
    expect(xhr.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer token')
  })

  it('Отправка primitive request body', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.post('/raw', {
      data: 'plain-body' as unknown as Record<string, unknown>,
    })

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = 'OK'
    xhr.onload?.()

    await promise

    expect(xhr.sentBody).toBe('plain-body')
  })

  it('Пустой base url и нормализация relative paths', async () => {
    const transport = new HTTPTransport()
    const promise = transport.get('users')

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = '[]'
    xhr.onload?.()

    await promise

    expect(xhr.openedUrl).toBe('users')
  })

  it('Удаление trailing slash из base url', async () => {
    const transport = new HTTPTransport('https://example.com/api/')
    const promise = transport.get('/users')

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = '[]'
    xhr.onload?.()

    await promise

    expect(xhr.openedUrl).toBe('https://example.com/api/users')
  })

  it('Поддержка put и delete без options', async () => {
    const transport = new HTTPTransport('https://example.com/api')

    const putPromise = transport.put('/resource')
    MockXMLHttpRequest.last!.status = 200
    MockXMLHttpRequest.last!.responseText = 'OK'
    MockXMLHttpRequest.last!.onload?.()
    await putPromise

    const deletePromise = transport.delete('/resource')
    MockXMLHttpRequest.last!.status = 200
    MockXMLHttpRequest.last!.responseText = 'OK'
    MockXMLHttpRequest.last!.onload?.()
    await deletePromise
  })

  it('Возврат plain text при ошибке парсинга json', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.get('/broken-json')

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = '{invalid'
    xhr.getResponseHeader = jest.fn((header: string) =>
      header === 'Content-Type' ? 'application/json' : null
    ) as typeof xhr.getResponseHeader
    xhr.onload?.()

    await expect(promise).resolves.toBe('{invalid')
  })

  it('Сохранение custom content type для json body', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.post('/custom', {
      data: { value: 1 },
      headers: { 'Content-Type': 'text/plain' },
    })

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = 'OK'
    xhr.onload?.()

    await promise

    expect(xhr.setRequestHeader).not.toHaveBeenCalledWith(
      'Content-Type',
      'application/json'
    )
  })

  it('Использование request options по умолчанию', async () => {
    const transport = new HTTPTransport('https://example.com/api')

    await expect(transport.request('/slow')).rejects.toThrow(
      'HTTP method is required'
    )
  })

  it('Использование request timeout по умолчанию', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.request('/slow', { method: METHODS.GET })

    const xhr = MockXMLHttpRequest.last!
    expect(xhr.timeout).toBe(5000)

    xhr.status = 200
    xhr.responseText = 'ok'
    xhr.onload?.()

    await promise
  })

  it('Добавление slash для relative path с base url', async () => {
    const transport = new HTTPTransport('https://example.com/api')
    const promise = transport.get('users')

    const xhr = MockXMLHttpRequest.last!
    xhr.status = 200
    xhr.responseText = '[]'
    xhr.onload?.()

    await promise

    expect(xhr.openedUrl).toBe('https://example.com/api/users')
  })
})
