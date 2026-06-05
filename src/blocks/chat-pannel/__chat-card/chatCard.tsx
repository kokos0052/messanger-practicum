import { h, Block } from '../../../core/index'
import { ChatInfo } from './__chat-info/chatInfo'
import { TChatCardProps } from './types'

export class ChatCardBlock extends Block<TChatCardProps> {
  render() {
    return (
      <div class="chat-pannel__chat-card-container">
        <div class="chat-pannel__chat-card__avatar"></div>
        <ChatInfo
          chatName={this.props.chatName}
          isOwnMessage={this.props.isOwnMessage}
          message={this.props.message}
          sendAt={this.props.sendAt}
        />
        {this.props.unreadMessagesCount && (
          <div class="chat-pannel__chat-card-unread-count">
            {this.props.unreadMessagesCount}
          </div>
        )}
      </div>
    )
  }
}

export function ChatCard(props: TChatCardProps) {
  return new ChatCardBlock(props).element()
}
