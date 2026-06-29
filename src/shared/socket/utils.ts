import { TSocketMessage } from './types'

export function parseSocketData(data: unknown): TSocketMessage | TSocketMessage[] {
  try {
    const parsed =
      typeof data === 'string'
        ? (JSON.parse(data) as TSocketMessage | TSocketMessage[])
        : data

    if (Array.isArray(parsed)) {
      return parsed.filter(isSocketMessage)
    }

    if (isSocketMessage(parsed)) {
      return parsed
    }
  } catch {
    return []
  }

  return []
}

export function normalizeSocketMessages(
  data: TSocketMessage | TSocketMessage[]
): TSocketMessage[] {
  return Array.isArray(data) ? data : [data]
}

export function isSocketMessage(value: unknown): value is TSocketMessage {
  if (!value || typeof value !== 'object') return false

  const message = value as TSocketMessage

  return (
    typeof message.id === 'number' &&
    typeof message.user_id === 'number' &&
    typeof message.content === 'string' &&
    typeof message.time === 'string'
  )
}

export function formatMessageTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function sortSocketMessages(messages: TSocketMessage[]): TSocketMessage[] {
  return [...messages].sort((left, right) => {
    const timeDiff =
      new Date(left.time).getTime() - new Date(right.time).getTime()

    if (timeDiff !== 0) return timeDiff

    return left.id - right.id
  })
}

export function mergeSocketMessages(
  current: TSocketMessage[],
  incoming: TSocketMessage[]
): TSocketMessage[] {
  const map = new Map<number, TSocketMessage>()

  ;[...current, ...incoming].forEach((message) => {
    map.set(message.id, message)
  })

  return sortSocketMessages(Array.from(map.values()))
}
