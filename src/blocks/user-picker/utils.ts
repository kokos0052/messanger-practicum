import { TUser } from '@shared/types/user'

export function normalizeUsers(data: unknown): TUser[] {
  if (!Array.isArray(data)) return []
  return data as TUser[]
}

export function getUserLabel(user: TUser): string {
  const name =
    user.display_name ?? `${user.first_name} ${user.second_name}`.trim()

  return name ? `${name} (@${user.login})` : user.login
}
