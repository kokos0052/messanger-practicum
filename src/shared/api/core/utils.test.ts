import { queryStringify } from './utils'

describe('queryStringify', () => {
  it('Возврат пустой строки для пустого объекта', () => {
    expect(queryStringify({})).toBe('')
  })

  it('Сериализация query params', () => {
    expect(queryStringify({ login: 'ivan', role: 'user' })).toBe(
      '?login=ivan&role=user'
    )
  })

  it('Пропуск null и undefined значений', () => {
    expect(queryStringify({ a: '1', b: null, c: undefined })).toBe('?a=1&')
  })

  it('Выброс ошибки для невалидных данных', () => {
    expect(() => queryStringify(null as unknown as Record<string, unknown>)).toThrow(
      'Data must be a non-null object'
    )
  })
})
