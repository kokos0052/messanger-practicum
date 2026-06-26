import { h, Block } from '@core/index'
import Store from '@shared/store/store'
import { ChatHeader } from './__chat-header/chatHeader'
import { ChatInput } from './__chat-input/chatInput'
import { ChatMessages } from './__chat-messages/ChatMessages'
import { TChatWindowProps } from './types'
import { getChatFromStore } from './utils'

type TChatWindowState = {
  isLoading: boolean
  chatTitle: string
  chatAvatar: string | null
}

export class ChatWindowBlock extends Block<TChatWindowProps, TChatWindowState> {
  private unsubscribe: (() => void) | null = null
  private lastSyncedChatId: number | null = null

  constructor(props: TChatWindowProps) {
    super(props)
    this.state = {
      isLoading: false,
      chatTitle: '',
      chatAvatar: null,
    }
  }

  componentDidMount() {
    this.unsubscribe = Store.subscribe(this.onStoreChange)
    this.syncSelectedChat()
  }

  public destroy() {
    this.unsubscribe?.()
    this.unsubscribe = null
    super.destroy()
  }

  private onStoreChange = () => {
    this.syncSelectedChat()
  }

  private syncSelectedChat() {
    const selectedChatId = Store.getState().selectedChatId as number | undefined

    if (!selectedChatId) {
      this.lastSyncedChatId = null
      this.setState({
        isLoading: false,
        chatTitle: '',
        chatAvatar: null,
      })
      return
    }

    const info = getChatFromStore(selectedChatId)

    if (!info) {
      this.lastSyncedChatId = selectedChatId
      this.setState({
        isLoading: true,
        chatTitle: '',
        chatAvatar: null,
      })
      return
    }

    if (
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
    })
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
        <ChatMessages date="" messages={[]} />
        <ChatInput />
      </section>
    )
  }
}

export function ChatWindow(props: TChatWindowProps) {
  return new ChatWindowBlock(props).element()
}
