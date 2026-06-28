import { TChat } from '@blocks/chat-pannel/types'
import Store from '@shared/store/store'

export type TSelectedChatInfo = {
  title: string
  avatar: string | null
}

export function getChatFromStore(chatId: number): TSelectedChatInfo | null {
  const rawChats = Store.getState().chats
  const chats: TChat[] = Array.isArray(rawChats) ? rawChats : []
  const chat = chats.find(({ id }) => id === chatId)

  if (!chat) return null

  return {
    title: chat.title,
    avatar: chat.avatar ?? null,
  }
}
