import { h, Block } from '../../../core'

export class ChatSearchBlock extends Block<{}> {
  render() {
    return (
      <div class="chat-pannel__chat-seach-container">
        <div class="chat-pannel__chat-seach-profile-container">
          <a class="chat-pannel__chat-seach-profile" href="/profile">
            Профиль
          </a>
          <div class="chat-pannel__chat-seach-icon"></div>
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

export function ChatSearch() {
  return new ChatSearchBlock().element()
}
