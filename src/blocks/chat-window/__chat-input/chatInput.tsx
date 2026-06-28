import { h, Block } from '@core/index'
import File from '@shared/static/file.svg'
import Content from '@shared/static/content.svg'
import Location from '@shared/static/location.svg'

export class ChatInputBlock extends Block<{}, { showInputOptions: boolean }> {
  constructor() {
    super()
    this.state = { showInputOptions: false }
  }

  render() {
    return (
      <div class="chat-window__chat-input-container">
        <button
          class="chat-window__chat-input-pin-button"
          onClick={() => this.toggleInputOptions()}
        ></button>
        <input
          class="chat-window__chat-input-texarea"
          placeholder="Сообщение"
          type="text"
        />
        <button class="chat-window__chat-input-send-button"></button>
        {this.state.showInputOptions && (
          <div class="chat-window__chat-input-options__list">
            <div class="chat-window__chat-input-options__list-element">
              <img
                class="chat-window__chat-input-options__list-element-icon"
                src={Content}
                height="22px"
                width="22px"
                alt="Прикрепить медиа"
              />
              <p class="chat-window__chat-input-options__list-element-text">
                Фото или Видео
              </p>
            </div>
            <div class="chat-window__chat-input-options__list-element">
              <img
                class="chat-window__chat-input-options__list-element-icon"
                src={File}
                height="22px"
                width="22px"
                alt="Приекрепить файл"
              />
              <p class="chat-window__chat-input-options__list-element-text">
                Файл
              </p>
            </div>
            <div class="chat-window__chat-input-options__list-element">
              <img
                class="chat-window__chat-input-options__list-element-icon"
                src={Location}
                height="22px"
                width="22px"
                alt="Указать местоположение"
              />
              <p class="chat-window__chat-input-options__list-element-text">
                Локация
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  private toggleInputOptions() {
    this.setState({ showInputOptions: !this.state.showInputOptions })
  }
}

export function ChatInput() {
  return new ChatInputBlock().element()
}
