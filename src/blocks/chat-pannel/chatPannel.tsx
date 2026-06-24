import { h, Block } from '@core/index'
import { ChatSearch } from './__chat-search/chetSearch'
import { ChatCard } from './__chat-card/chatCard'
import { TChat, TChatPannelProps, TChatResonseData } from './types'
import Store from '@shared/store/store'
import { Modal } from '@blocks/modal'
import { modalMock } from './constants'
import chatsApi from '@shared/api/chatsApi'

export class ChatPannelBlock extends Block<
  TChatPannelProps,
  { showModal: boolean; isLoading: boolean }
> {
  private unsubscribe: (() => void) | null = null
  private loadingPromise: Promise<void> | null = null

  constructor(props: TChatPannelProps) {
    super(props)
    this.state = { showModal: false, isLoading: false }
    this.unsubscribe = Store.subscribe(this.onStoreChange)
  }

  private onStoreChange = () => {
    if (this.domElement) {
      this.renderComponent()
    }
  }

  componentDidMount() {
    if (Store.getState().chats === undefined) {
      this.loadChats()
    }
  }

  private loadChats() {
    if (this.loadingPromise) return this.loadingPromise

    this.loadingPromise = (async () => {
      this.setState({ isLoading: true })
      try {
        const response = await chatsApi.getChats()
        Store.setState('chats', response)
      } finally {
        this.setState({ isLoading: false })
        this.loadingPromise = null
      }
    })()

    return this.loadingPromise
  }

  public destroy() {
    this.unsubscribe?.()
    this.unsubscribe = null
    super.destroy()
  }

  render() {
    const rawChats = Store.getState().chats
    const chats: TChat[] = Array.isArray(rawChats) ? rawChats : []

    if (this.state.isLoading) {
      return (
        <section class="chat-pannel-container">
          <ChatSearch addChatHander={this.revealModal} />
          <div class="chat-panner-havent-chats">Загрузка...</div>
          {this.state.showModal && (
            <Modal
              {...modalMock}
              onClose={() =>
                this.setState((prevState) => ({
                  ...prevState,
                  showModal: false,
                }))
              }
              action={this.createChat}
            />
          )}
        </section>
      )
    }

    return (
      <section class="chat-pannel-container">
        <ChatSearch addChatHander={this.revealModal} />
        {chats.length ? (
          chats.map((chat) => (
            <ChatCard
              {...chat}
              onClick={() => {
                this.props.setChatWindow()
                Store.setState('selectedChatId', chat.id)
              }}
            />
          ))
        ) : (
          <div class="chat-panner-havent-chats">У вас еще нет чатов</div>
        )}
        {this.state.showModal && (
          <Modal
            {...modalMock}
            onClose={() =>
              this.setState((prevState) => ({ ...prevState, showModal: false }))
            }
            action={this.createChat}
          />
        )}
      </section>
    )
  }

  revealModal = () => {
    this.setState((prevState) => ({ ...prevState, showModal: true }))
  }

  createChat = async (chatData: TChatResonseData) => {
    try {
      await chatsApi.createChat({ title: chatData.chatName })
      await this.loadChats()
      this.setState({ showModal: false })
    } catch (error) {
      console.error('Ошибка создания чата:', error)
    }
  }
}

export function ChatPannel(props: TChatPannelProps) {
  return new ChatPannelBlock(props).element()
}
