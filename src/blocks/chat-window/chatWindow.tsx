import { h, Block } from '../../core/index'
import { ChatHeader } from './__chat-header/chatHeader'
import { ChatInput } from './__chat-input/chatInput'
import { ChatMessages } from './__chat-messages/ChatMessages'
import { chatInfo } from '../../mocks/chatInfo'
import { TChatWindowProps } from './types'

export class ChatWindowBlock extends Block<TChatWindowProps> {
  render() {
    return (
      <section class="chat-window">
        <ChatHeader
          chatName={chatInfo.chatName}
          toggleModal={this.props.toggleModal}
        />
        <ChatMessages date={chatInfo.date} messages={chatInfo.messages} />
        <ChatInput />
      </section>
    )
  }
}

export function ChatWindow(props: TChatWindowProps) {
  return new ChatWindowBlock(props).element()
}
