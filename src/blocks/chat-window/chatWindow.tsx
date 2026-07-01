import { h, Block } from '@core/index'
import { formatMessageDate } from '@blocks/chat-pannel/utils'
import chatsApi from '@shared/api/chatsApi'
import resourcesApi from '@shared/api/resourcesApi'
import {
  formatMessageTime,
  getSocket,
  mergeSocketMessages,
  normalizeSocketMessages,
  SOCKET_MESSAGE_TYPES,
  TSocketClient,
  TSocketMessage,
} from '@shared/socket'
import Store from '@shared/store/store'
import { TUser } from '@shared/types/user'
import {
  getResourceFileName,
  getResourceUrl,
  isImageResource,
  normalizeResourcePath,
} from '@shared/utils'
import { ChatHeader } from './__chat-header/chatHeader'
import { ChatInput } from './__chat-input/chatInput'
import { ChatMessages } from './__chat-messages/ChatMessages'
import { TChatMessage } from './__chat-messages/types'
import { TChatWindowProps } from './types'
import { getChatFromStore } from './utils'

type TChatWindowMessage = TChatMessage & { id: number }

type TChatWindowState = {
  isLoading: boolean
  chatTitle: string
  chatAvatar: string | null
  messages: TChatWindowMessage[]
  messagesDate: string
  isMessagesLoading: boolean
}

export class ChatWindowBlock extends Block<TChatWindowProps, TChatWindowState> {
  private unsubscribe: (() => void) | null = null
  private lastSyncedChatId: number | null = null
  private socketClient: TSocketClient | null = null
  private rawMessages: TSocketMessage[] = []

  constructor(props: TChatWindowProps) {
    super(props)
    this.state = {
      isLoading: false,
      chatTitle: '',
      chatAvatar: null,
      messages: [],
      messagesDate: '',
      isMessagesLoading: false,
    }
  }

  componentDidMount() {
    this.unsubscribe = Store.subscribe(this.onStoreChange)
    this.syncSelectedChat()
  }

  public destroy() {
    this.closeSocket()
    this.unsubscribe?.()
    this.unsubscribe = null
    super.destroy()
  }

  private onStoreChange = () => {
    this.syncSelectedChat()
  }

  private closeSocket() {
    this.socketClient?.close()
    this.socketClient = null
    this.rawMessages = []
  }

  private syncSelectedChat() {
    const selectedChatId = Store.getState().selectedChatId as number | undefined

    if (!selectedChatId) {
      this.lastSyncedChatId = null
      this.closeSocket()
      this.setState({
        isLoading: false,
        chatTitle: '',
        chatAvatar: null,
        messages: [],
        messagesDate: '',
        isMessagesLoading: false,
      })
      return
    }

    const info = getChatFromStore(selectedChatId)

    if (!info) {
      this.lastSyncedChatId = selectedChatId
      this.closeSocket()
      this.setState({
        isLoading: true,
        chatTitle: '',
        chatAvatar: null,
        messages: [],
        messagesDate: '',
        isMessagesLoading: false,
      })
      return
    }

    const shouldReconnect = this.lastSyncedChatId !== selectedChatId

    if (
      !shouldReconnect &&
      this.lastSyncedChatId === selectedChatId &&
      this.state.chatTitle === info.title &&
      this.state.chatAvatar === info.avatar &&
      !this.state.isLoading
    ) {
      return
    }

    this.lastSyncedChatId = selectedChatId
    this.setState({
      isLoading: false,
      chatTitle: info.title,
      chatAvatar: info.avatar,
      messages: shouldReconnect ? [] : this.state.messages,
      messagesDate: shouldReconnect ? '' : this.state.messagesDate,
      isMessagesLoading: shouldReconnect,
    })

    if (shouldReconnect) {
      void this.connectToChat(selectedChatId)
    }
  }

  private async connectToChat(chatId: number) {
    const user = Store.getState().user as TUser | undefined

    if (!user?.id) {
      this.setState({ isMessagesLoading: false })
      return
    }

    this.closeSocket()

    try {
      const response = (await chatsApi.setChatToken(String(chatId), {})) as {
        token: string
      }

      this.socketClient = getSocket({
        userId: String(user.id),
        chatId: String(chatId),
        tokenValue: response.token,
        loadHistoryOnOpen: true,
        onMessage: (data) => {
          this.handleSocketMessages(data, user.id)
        },
        onClose: () => {
          if (this.lastSyncedChatId === chatId) {
            this.socketClient = null
          }
        },
      })
    } catch (error) {
      console.error('Ошибка подключения к чату:', error)
      this.setState({ isMessagesLoading: false })
    }
  }

  private handleSocketMessages(
    data: TSocketMessage | TSocketMessage[],
    currentUserId: number
  ) {
    const incoming = normalizeSocketMessages(data)

    if (!incoming.length) {
      this.setState({ isMessagesLoading: false })
      return
    }

    this.rawMessages = mergeSocketMessages(this.rawMessages, incoming)

    const messages = this.rawMessages.map((message) =>
      this.mapMessageToView(message, currentUserId)
    )

    const lastMessage = this.rawMessages[this.rawMessages.length - 1]

    this.setState({
      messages,
      messagesDate: lastMessage ? formatMessageDate(lastMessage.time) : '',
      isMessagesLoading: false,
    })

    this.scrollMessagesToBottom()
  }

  private scrollMessagesToBottom() {
    requestAnimationFrame(() => {
      const container = this.domElement?.querySelector<HTMLElement>(
        '.chat-window__chat-messages-container'
      )

      if (container) {
        container.scrollTop = container.scrollHeight
      }
    })
  }

  private mapMessageToView(
    message: TSocketMessage,
    currentUserId: number
  ): TChatWindowMessage {
    const isAttachment = message.type === SOCKET_MESSAGE_TYPES.FILE
    const resourceUrl = isAttachment ? getResourceUrl(message.content) : null

    return {
      id: message.id,
      isOwn: message.user_id === currentUserId,
      text: isAttachment ? '' : message.content,
      time: formatMessageTime(message.time),
      media: resourceUrl
        ? {
            url: resourceUrl,
            type: this.getAttachmentType(message.content),
            name: getResourceFileName(message.content),
          }
        : null,
    }
  }

  private getAttachmentType(path: string): 'image' | 'video' | 'file' {
    if (/\.(mp4|webm|ogg|mov)$/i.test(path)) {
      return 'video'
    }

    if (isImageResource(path)) {
      return 'image'
    }

    return 'file'
  }

  private handleSendMessage = (message: string) => {
    const trimmed = message.trim()

    if (!trimmed || !this.socketClient) return

    this.socketClient.sendMessage(trimmed)
  }

  private handleSendAttachment = async (file: File) => {
    if (!this.socketClient) return

    try {
      const formData = new FormData()
      formData.append('resource', file)

      const response = await resourcesApi.uploadResource(formData)
      const resourcePath = normalizeResourcePath(response)

      this.socketClient.sendFile(resourcePath)
    } catch (error) {
      console.error('Ошибка отправки вложения:', error)
    }
  }

  render() {
    if (this.state.isLoading) {
      return <section class="chat-window-loader">Загрузка...</section>
    }

    return (
      <section class="chat-window">
        <ChatHeader
          chatName={this.state.chatTitle}
          chatAvatar={this.state.chatAvatar}
          onLeaveChat={this.props.onLeaveChat}
        />
        <ChatMessages
          date={this.state.messagesDate}
          messages={this.state.messages}
        />
        {this.state.isMessagesLoading && (
          <p class="chat-window__messages-loader">Загрузка сообщений...</p>
        )}
        <ChatInput
          onSendMessage={this.handleSendMessage}
          onAttachMedia={this.handleSendAttachment}
          onAttachFile={this.handleSendAttachment}
        />
      </section>
    )
  }
}

export function ChatWindow(props: TChatWindowProps) {
  return new ChatWindowBlock(props).element()
}
