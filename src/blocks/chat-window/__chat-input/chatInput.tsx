import { h, Block } from '@core/index'
import File from '@shared/static/file.svg'
import Content from '@shared/static/content.svg'
import Location from '@shared/static/location.svg'
import { TChatInputProps } from './types'

export class ChatInputBlock extends Block<
  TChatInputProps,
  { showInputOptions: boolean; message: string }
> {
  constructor(props: TChatInputProps = {}) {
    super(props)
    this.state = {
      showInputOptions: false,
      message: '',
    }
  }

  render() {
    return (
      <div class="chat-window__chat-input-container">
        <button
          type="button"
          class="chat-window__chat-input-pin-button"
          onClick={this.toggleInputOptions}
        ></button>
        <form class="chat-window__chat-input-form" onSubmit={this.handleSubmit}>
          <input
            class="chat-window__chat-input-texarea"
            placeholder="Сообщение"
            type="text"
            name="message"
            value={this.state.message}
            onInput={this.handleInputChange}
          />
          <button
            type="submit"
            class="chat-window__chat-input-send-button"
            aria-label="Отправить сообщение"
          ></button>
        </form>
        <input
          id="chat-media-input"
          class="chat-window__chat-input-file-input"
          type="file"
          accept="image/*,video/*"
          onChange={this.handleMediaChange}
        />
        <input
          id="chat-file-input"
          class="chat-window__chat-input-file-input"
          type="file"
          onChange={this.handleFileChange}
        />
        {this.state.showInputOptions && (
          <div class="chat-window__chat-input-options__list">
            <button
              type="button"
              class="chat-window__chat-input-options__list-element"
              onClick={this.openMediaPicker}
            >
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
            </button>
            <button
              type="button"
              class="chat-window__chat-input-options__list-element"
              onClick={this.openFilePicker}
            >
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
            </button>
            <div class="chat-window__chat-input-options__list-element chat-window__chat-input-options__list-element--disabled">
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

  private toggleInputOptions = () => {
    this.setState({ showInputOptions: !this.state.showInputOptions })
  }

  private handleInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement
    this.state.message = input.value
  }

  private handleSubmit = (e: Event) => {
    e.preventDefault()

    const message = this.state.message.trim()

    if (!message) return

    this.props.onSendMessage?.(message)
    this.setState({ message: '' })
  }

  private openMediaPicker = () => {
    this.setState({ showInputOptions: false })
    this.domElement
      ?.querySelector<HTMLInputElement>('#chat-media-input')
      ?.click()
  }

  private openFilePicker = () => {
    this.setState({ showInputOptions: false })
    this.domElement
      ?.querySelector<HTMLInputElement>('#chat-file-input')
      ?.click()
  }

  private handleMediaChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]

    if (!file) return

    void Promise.resolve(this.props.onAttachMedia?.(file))
    ;(e.target as HTMLInputElement).value = ''
  }

  private handleFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]

    if (!file) return

    void Promise.resolve(this.props.onAttachFile?.(file))
    ;(e.target as HTMLInputElement).value = ''
  }
}

export function ChatInput(props: TChatInputProps = {}) {
  return new ChatInputBlock(props).element()
}
