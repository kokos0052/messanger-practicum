export function formatMessageDate(
  dateString: string,
  locale: string = 'ru-RU'
): string {
  const msgDate = new Date(dateString)
  if (isNaN(msgDate.getTime())) {
    throw new Error('Invalid date string')
  }

  const now = new Date()

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const msgDay = new Date(
    msgDate.getFullYear(),
    msgDate.getMonth(),
    msgDate.getDate()
  )

  const diffDays = Math.floor(
    (today.getTime() - msgDay.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays < 0) {
    return formatFullDate(msgDate, locale)
  }

  if (diffDays === 0) {
    return msgDate.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (diffDays === 1) {
    return 'вчера'
  }

  if (diffDays < 7) {
    return msgDate.toLocaleDateString(locale, {
      weekday: 'long',
    })
  }

  return formatFullDate(msgDate, locale)
}

function formatFullDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
