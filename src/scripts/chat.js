import { ChatBlock } from '../layouts/chat/chat'

const chatPage = new ChatBlock({
  chatContent: 'chatWindow',
})

document.body.appendChild(chatPage.element())
