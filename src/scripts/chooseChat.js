import { ChatBlock } from '../layouts/chat/chat'

const chatPage = new ChatBlock({
  chatContent: 'chooseChat',
})

document.body.appendChild(chatPage.element())
