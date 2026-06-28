import { h, Block } from '@core/index'
import { TChatMessagesProps } from './types'

export class ChatMessagesBlock extends Block<TChatMessagesProps> {
  render() {
    return (
      <div class="chat-window__chat-messages-container">
        {this.props.date && (
          <p class="chat-window__chat-messages-date">{this.props.date}</p>
        )}
        <div class="chat-window__chat-messages-messages">
          {this.props.messages.length ? (
            this.props.messages.map(({ isOwn, text, time }) =>
              isOwn ? (
                <div class="message-container message-container-own">
                  <div class="chat-window__chat-messages-message chat-window__chat-messages-own-message">
                    {text}
                    <span class="chat-window__chat-messages-time chat-window__chat-messages-own-time">
                      {time}
                    </span>
                  </div>
                </div>
              ) : (
                <div class="chat-window__chat-messages-message-container">
                  <div class="chat-window__chat-messages-message chat-window__chat-messages-other-message">
                    {text}
                    <span class="chat-window__chat-messages-time chat-window__chat-messages-other-time">
                      {time}
                    </span>
                  </div>
                </div>
              )
            )
          ) : (
            <p class="chat-window__chat-messages-empty">Сообщений пока нет</p>
          )}
        </div>
      </div>
    )
  }
}

export function ChatMessages(props: TChatMessagesProps) {
  return new ChatMessagesBlock(props).element()
}
