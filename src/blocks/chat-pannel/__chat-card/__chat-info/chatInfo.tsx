import { h, Block, Fragment } from '@core/index'
import { TChatInfoProps } from './types'

export class ChatInfoBlock extends Block<TChatInfoProps> {
  render() {
    return (
      <div
        class="chat-pannel__chat-card__chat-info-container"
        data-chat-id="{{id}}"
      >
        <div class="chat-pannel__chat-card__chat-info-message-container">
          <h4 class="chat-pannel__chat-card__chat-info-title">
            {this.props.chatName}
          </h4>
          <p class="chat-pannel__chat-card__chat-info-message">
            {this.props.isOwnMessage ? (
              <>
                Вы:
                <span class="chat-pannel__chat-card__chat-info-text">
                  {this.props.message}
                </span>
              </>
            ) : (
              <span class="chat-pannel__chat-card__chat-info-text">
                {this.props.message}
              </span>
            )}
          </p>
        </div>
        <p class="chat-card__chat-info-time">{this.props.sendAt}</p>
      </div>
    )
  }
}

export function ChatInfo(props: TChatInfoProps) {
  return new ChatInfoBlock(props).element()
}
