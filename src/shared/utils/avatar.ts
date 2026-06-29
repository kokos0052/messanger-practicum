import { getResourceUrl } from './resources'

export function getAvatarUrl(avatar: string | null | undefined): string | null {
  return getResourceUrl(avatar)
}
