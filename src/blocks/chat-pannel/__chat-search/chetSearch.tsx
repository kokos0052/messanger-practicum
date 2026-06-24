import { h, Block } from '@core/index'
import RightArrow from './right-arrow.svg'
import { goToLink } from '@shared/utils'
import { TChatSearchBlockProps } from './types'

export class ChatSearchBlock extends Block<TChatSearchBlockProps> {
  render() {
    return (
      <div class="chat-pannel__chat-seach-container">
        <div class="chat-pannel__chat-search-actions">
          <button
            class="chat-pannel__chat-add-chat"
            onClick={this.props.addChatHander}
          >
            Добавить чат
          </button>
          <div
            class="chat-pannel__chat-seach-profile-container"
            onClick={() => goToLink('/settings')}
          >
            <a class="chat-pannel__chat-seach-profile">Профиль</a>
            <img src={RightArrow} height="8px" width="8px" alt="Профиль" />
          </div>
        </div>
        <input
          class="chat-pannel__chat-seach-input"
          placeholder="Поиск"
          type="text"
        />
      </div>
    )
  }
}

export function ChatSearch(props: TChatSearchBlockProps) {
  return new ChatSearchBlock(props).element()
}
