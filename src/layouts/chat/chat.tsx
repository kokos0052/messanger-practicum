import { h, Block } from '../../core/index'
import { ChatPannel, ChooseChat, ChatWindow, Modal } from '../../blocks'
import { TChatProps } from './types'
import { modalMock } from '../../mocks/chatModal'

export class ChatBlock extends Block<TChatProps, { showModal: boolean }> {
  constructor(props: TChatProps) {
    super(props)
    this.state = { showModal: false }
  }

  render() {
    return (
      <main class="chat-container">
        <ChatPannel />
        {this.props.chatContent === 'chatWindow' ? (
          <ChatWindow toggleModal={() => this.setState({ showModal: true })} />
        ) : (
          <ChooseChat />
        )}
        {this.state.showModal && (
          <Modal
            {...modalMock}
            onClose={() => this.setState({ showModal: false })}
          />
        )}
      </main>
    )
  }
}
