import { formatMessageDate } from './utils'

describe('formatMessageDate', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-06-24T15:00:00'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('Возврат времени для сегодняшних сообщений', () => {
    const result = formatMessageDate('2026-06-24T10:30:00')

    expect(result).toMatch(/\d{2}:\d{2}/)
  })

  it('Возврат «вчера» для вчерашних сообщений', () => {
    expect(formatMessageDate('2026-06-23T10:30:00')).toBe('вчера')
  })

  it('Возврат дня недели для сообщений в пределах недели', () => {
    const result = formatMessageDate('2026-06-20T10:30:00')

    expect(result.length).toBeGreaterThan(0)
    expect(result).not.toBe('вчера')
  })

  it('Выброс ошибки при невалидной дате', () => {
    expect(() => formatMessageDate('invalid-date')).toThrow('Invalid date string')
  })

  it('Возврат полной даты для будущих сообщений', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-06-24T15:00:00'))

    const result = formatMessageDate('2026-07-01T10:00:00')

    expect(result).toContain('2026')

    jest.useRealTimers()
  })

  it('Возврат полной даты для сообщений старше недели', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-06-24T15:00:00'))

    const result = formatMessageDate('2026-06-01T10:00:00')

    expect(result).toContain('2026')

    jest.useRealTimers()
  })
})
