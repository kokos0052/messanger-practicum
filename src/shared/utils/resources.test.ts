import {
  getResourceFileName,
  getResourceUrl,
  isImageResource,
  normalizeResourcePath,
} from './resources'

describe('resources utils', () => {
  it('Формирование resource url', () => {
    expect(getResourceUrl('/avatar.png')).toBe(
      'https://ya-praktikum.tech/api/v2/resources/avatar.png'
    )
    expect(getResourceUrl('avatar.png')).toBe(
      'https://ya-praktikum.tech/api/v2/resources/avatar.png'
    )
    expect(getResourceUrl('http://cdn.test/file.png')).toBe('http://cdn.test/file.png')
    expect(getResourceUrl('https://cdn.test/file.png')).toBe(
      'https://cdn.test/file.png'
    )
    expect(getResourceUrl(null)).toBeNull()
  })

  it('Нормализация ответа upload', () => {
    expect(normalizeResourcePath('/file.png')).toBe('/file.png')
    expect(normalizeResourcePath({ id: 10 })).toBe('10')
    expect(() => normalizeResourcePath({})).toThrow('Invalid resource upload response')
  })

  it('Определение image-ресурсов и имён файлов', () => {
    expect(isImageResource('/images/photo.jpg')).toBe(true)
    expect(isImageResource('/docs/report.pdf')).toBe(false)
    expect(getResourceFileName('/docs/report.pdf')).toBe('report.pdf')
    expect(getResourceFileName('/')).toBe('Файл')
  })
})
