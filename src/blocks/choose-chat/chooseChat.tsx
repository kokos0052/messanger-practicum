import { h, Block } from '@core/index'

export class ChooseChatBlock extends Block<{}> {
  render() {
    return (
      <section class="choose-chat-container">
        Выберите чат чтобы отправить сообщение
      </section>
    )
  }
}

export function ChooseChat() {
  return new ChooseChatBlock().element()
}
