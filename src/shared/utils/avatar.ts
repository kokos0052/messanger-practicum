const RESOURCES_BASE = 'https://ya-praktikum.tech/api/v2/resources'

export function getAvatarUrl(avatar: string | null | undefined): string | null {
  if (!avatar) return null
  return `${RESOURCES_BASE}${avatar}`
}
