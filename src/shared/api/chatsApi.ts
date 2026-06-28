import { BASE_URL } from './constants'
import { BaseAPI, HTTPTransport } from './core'

const chatsApiInstance = new HTTPTransport(`${BASE_URL}/chats`)

class ChatsApi extends BaseAPI {
  getChats() {
    return chatsApiInstance.get('/')
  }

  createChat(data: Record<string, unknown>) {
    return chatsApiInstance.post('/', { data })
  }

  deleteChat(data: Record<string, unknown>) {
    return chatsApiInstance.delete('/', { data })
  }

  getChatSentFiles(id: string) {
    return chatsApiInstance.get(`/${id}/files`)
  }

  getArchiveChat() {
    return chatsApiInstance.get('/archive')
  }

  archiveChat(data: Record<string, unknown>) {
    return chatsApiInstance.post('/archive', { data })
  }

  unarchiveChat(data: Record<string, unknown>) {
    return chatsApiInstance.post('/unarchive', { data })
  }

  getCommonChat(id: string) {
    return chatsApiInstance.get(`/${id}/common`)
  }

  getChatUsers(id: string) {
    return chatsApiInstance.get(`/${id}/users`)
  }

  getNewMessagesCount(id: string) {
    return chatsApiInstance.get(`/new/${id}`)
  }

  updateChatAvatar(data: FormData | Record<string, unknown>) {
    return chatsApiInstance.put('/avatar', { data })
  }

  addChatUser(data: { users: number[]; chatId: number }) {
    return chatsApiInstance.put('/users', { data })
  }

  deleteChatUser(data: { users: number[]; chatId: number }) {
    return chatsApiInstance.delete('/users', { data })
  }

  setChatToken(id: string, data: Record<string, unknown>) {
    return chatsApiInstance.post(`/token/${id}`, { data })
  }
}

export default new ChatsApi()
