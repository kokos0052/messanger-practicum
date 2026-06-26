import { h, Block } from '@core/index'
import { ChooseChat, Modal, ChatPannelBlock, ChatWindowBlock } from '@blocks/index'
import { modalMock } from '@mocks/chatModal'
import { EChatContent } from './types'

export class ChatBlock extends Block<
  {},
  { showModal: boolean; chatContent: EChatContent; isLoading?: boolean }
> {
  private chatPannel: ChatPannelBlock
  private chatWindow: ChatWindowBlock

  constructor() {
    super()
    this.state = { showModal: false, chatContent: EChatContent.CHOOSE_CHAT }
    this.chatPannel = new ChatPannelBlock({ setChatWindow: this.setChatWindow })
    this.chatWindow = new ChatWindowBlock({
      toggleModal: () => this.setState({ showModal: true }),
      onLeaveChat: this.handleLeaveChat,
    })
  }

  public destroy() {
    this.chatPannel.destroy()
    this.chatWindow.destroy()
    super.destroy()
  }

  render() {
    return (
      <main class="chat-container">
        {this.chatPannel.element()}
        {this.state.chatContent === EChatContent.CHAT_WINDOW
          ? this.chatWindow.element()
          : ChooseChat()}
        {this.state.showModal && (
          <Modal
            {...modalMock}
            onClose={() =>
              this.setState((prevState) => ({ ...prevState, showModal: false }))
            }
          />
        )}
      </main>
    )
  }

  private setChatWindow = () => {
    if (this.state.chatContent === EChatContent.CHAT_WINDOW) return

    this.setState((prevState) => ({
      ...prevState,
      chatContent: EChatContent.CHAT_WINDOW,
    }))
  }

  private handleLeaveChat = () => {
    this.setState({ chatContent: EChatContent.CHOOSE_CHAT })
    void this.chatPannel.reloadChats()
  }
}
