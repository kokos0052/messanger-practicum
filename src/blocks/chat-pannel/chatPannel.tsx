import { h, Block } from '../../core/index'
import { ChatSearch } from './__chat-search/chetSearch'
import { ChatCard } from './__chat-card/chatCard'
import { chats } from '../../mocks/chats'

export class ChatPannelBlock extends Block<{}> {
  render() {
    return (
      <section class="chat-pannel-container">
        <ChatSearch />
        {chats.map((chat) => (
          <ChatCard {...chat} />
        ))}
      </section>
    )
  }
}

export function ChatPannel() {
  return new ChatPannelBlock().element()
}
