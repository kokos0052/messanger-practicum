import { h, Block } from '@core/index'
import { ChooseChat, ChatWindow, Modal, ChatPannelBlock } from '@blocks/index'
import { modalMock } from '@mocks/chatModal'
import { EChatContent } from './types'

export class ChatBlock extends Block<
  {},
  { showModal: boolean; chatContent: EChatContent; isLoading?: boolean }
> {
  private chatPannel: ChatPannelBlock

  constructor() {
    super()
    this.state = { showModal: false, chatContent: EChatContent.CHOOSE_CHAT }
    this.chatPannel = new ChatPannelBlock({ setChatWindow: this.setChatWindow })
  }

  public destroy() {
    this.chatPannel.destroy()
    super.destroy()
  }

  render() {
    return (
      <main class="chat-container">
        {this.chatPannel.element()}
        {this.state.chatContent === EChatContent.CHAT_WINDOW ? (
          <ChatWindow
            toggleModal={() =>
              this.setState((prevState) => ({ ...prevState, showModal: true }))
            }
          />
        ) : (
          <ChooseChat />
        )}
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
    this.setState((prevState) => ({
      ...prevState,
      chatContent: EChatContent.CHAT_WINDOW,
    }))
  }
}
