import { h, Block } from '@core/index'
import { TChatMessagesProps } from './types'

export class ChatMessagesBlock extends Block<TChatMessagesProps> {
  private renderMessageContent(text: string, media: TChatMessagesProps['messages'][number]['media']) {
    if (media?.type === 'image') {
      return (
        <img
          class="chat-window__chat-messages-media chat-window__chat-messages-media--image"
          src={media.url}
          alt={media.name ?? 'Изображение'}
        />
      )
    }

    if (media?.type === 'video') {
      return (
        <video
          class="chat-window__chat-messages-media chat-window__chat-messages-media--video"
          src={media.url}
          controls
        />
      )
    }

    if (media?.type === 'file') {
      return (
        <a
          class="chat-window__chat-messages-file-link"
          href={media.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {media.name ?? 'Скачать файл'}
        </a>
      )
    }

    return text
  }

  render() {
    return (
      <div class="chat-window__chat-messages-container">
        {this.props.date && (
          <p class="chat-window__chat-messages-date">{this.props.date}</p>
        )}
        <div class="chat-window__chat-messages-messages">
          {this.props.messages.length ? (
            this.props.messages.map(({ isOwn, text, time, media }) =>
              isOwn ? (
                <div class="message-container message-container-own">
                  <div class="chat-window__chat-messages-message chat-window__chat-messages-own-message">
                    {this.renderMessageContent(text, media)}
                    <span class="chat-window__chat-messages-time chat-window__chat-messages-own-time">
                      {time}
                    </span>
                  </div>
                </div>
              ) : (
                <div class="chat-window__chat-messages-message-container">
                  <div class="chat-window__chat-messages-message chat-window__chat-messages-other-message">
                    {this.renderMessageContent(text, media)}
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
