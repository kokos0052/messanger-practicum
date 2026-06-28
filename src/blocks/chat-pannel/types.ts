export type TChatPannelProps = {
  setChatWindow: () => void
}

export type TLastMessage = {
  content: string
  id: number
  time: string
}

export type TChat = {
  created_by: number
  id: number
  title: string
  unread_count: number
  last_message?: TLastMessage | null
  avatar?: string | null
}

export type TChatResonseData = {
  chatName: string
}
