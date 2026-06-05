import { h, Block } from '../../../core'
import { TChatHeaderProps } from './type'

export class ChatHeaderBlock extends Block<
  TChatHeaderProps,
  { showOptionsList: boolean }
> {
  constructor(props: TChatHeaderProps) {
    super(props)
    this.state = { showOptionsList: false }
  }

  render() {
    return (
      <div class="chat-window__chat-header-container">
        <div class="chat-window__chat-header-user-info">
          <div class="chat-window__chat-header-user-info-avatar"></div>
          <p class="chat-window__chat-header-user-info-name">
            {this.props.chatName}
          </p>
        </div>
        <button
          class="chat-window__chat-header-options-button"
          onClick={() => this.toggleOptionList()}
        ></button>
        {this.state.showOptionsList && (
          <div class="chat-window__chat-header-options__list">
            <div class="chat-window__chat-header-options__list-element">
              <img
                class="chat-window__chat-header-options__list-element-icon"
                src="./plus.svg"
                height="22px"
                width="22px"
                alt="Добавить пользователя"
              />
              <p
                class="chat-window__chat-header-options__list-element-text"
                onClick={this.props.toggleModal}
              >
                Добавить пользователя
              </p>
            </div>
            <div class="chat-window__chat-header-options__list-element">
              <img
                class="chat-window__chat-header-options__list-element-icon"
                src="./cross.svg"
                height="22px"
                width="22px"
                alt="Удалить пользователя"
              />
              <p
                class="chat-window__chat-header-options__list-element-text"
                onClick={this.props.toggleModal}
              >
                Удалить пользователя
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  private toggleOptionList() {
    this.setState({ showOptionsList: !this.state.showOptionsList })
  }
}

export function ChatHeader(props: TChatHeaderProps) {
  return new ChatHeaderBlock(props).element()
}
