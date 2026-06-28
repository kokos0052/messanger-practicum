import { h, Block } from '../../../core/index'
import { getAvatarUrl } from '@shared/utils'
import { formatMessageDate } from '../utils'
import { ChatInfo } from './__chat-info/chatInfo'
import { TChatCardProps } from './types'

export class ChatCardBlock extends Block<TChatCardProps> {
  render() {
    const avatarSrc = getAvatarUrl(this.props.avatar)

    return (
      <div
        class={`chat-pannel__chat-card-container${
          this.props.isActive ? ' chat-pannel__chat-card-container_active' : ''
        }`}
        onClick={() => this.props.onClick()}
      >
        <div class="chat-pannel__chat-card__avatar">
          {avatarSrc && (
            <img
              class="chat-pannel__chat-card__avatar-image"
              src={avatarSrc}
              alt={`Аватар чата ${this.props.title}`}
            />
          )}
        </div>
        <ChatInfo
          chatName={this.props.title}
          isOwnMessage={false}
          message={
            this.props?.last_message?.content
              ? this.props?.last_message?.content
              : ''
          }
          sendAt={
            this.props.last_message?.time
              ? formatMessageDate(this.props.last_message?.time)
              : ''
          }
        />
        {Boolean(this.props.unread_count) && (
          <div class="chat-pannel__chat-card-unread-count">
            {this.props.unread_count}
          </div>
        )}
      </div>
    )
  }
}

export function ChatCard(props: TChatCardProps) {
  return new ChatCardBlock(props).element()
}
