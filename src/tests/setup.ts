import Store from '@shared/store/store'

export function resetStore() {
  Store.setState('user', undefined)
  Store.setState('chats', undefined)
  Store.setState('selectedChatId', undefined)
}

beforeEach(() => {
  document.body.innerHTML = ''
  resetStore()
})
