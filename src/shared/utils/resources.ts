const RESOURCES_BASE = 'https://ya-praktikum.tech/api/v2/resources'

export function getResourceUrl(path: string | null | undefined): string | null {
  if (!path) return null

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${RESOURCES_BASE}${path.startsWith('/') ? path : `/${path}`}`
}

export function normalizeResourcePath(response: unknown): string {
  if (typeof response === 'string') {
    return response
  }

  if (
    response &&
    typeof response === 'object' &&
    'id' in response &&
    typeof (response as { id: unknown }).id === 'number'
  ) {
    return String((response as { id: number }).id)
  }

  throw new Error('Invalid resource upload response')
}

export function isImageResource(path: string): boolean {
  return /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(path)
}

export function getResourceFileName(path: string): string {
  const parts = path.split('/')
  return parts[parts.length - 1] || 'Файл'
}
