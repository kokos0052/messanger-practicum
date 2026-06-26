import { h, Block } from '@core/index'
import { UserPicker } from '@blocks/user-picker'
import { TUserPickerMode } from '@blocks/user-picker/types'
import { TChat } from '@blocks/chat-pannel/types'
import { getAvatarUrl } from '@shared/utils'
import { TUser } from '@shared/types/user'
import { TChatHeaderProps } from './type'
import Plus from './plus.svg'
import Cross from './cross.svg'
import Store from '@shared/store/store'
import chatsApi from '@shared/api/chatsApi'

export class ChatHeaderBlock extends Block<
  TChatHeaderProps,
  {
    showOptionsList: boolean
    showPicker: boolean
    pickerMode: TUserPickerMode | null
  }
> {
  constructor(props: TChatHeaderProps) {
    super(props)
    this.state = {
      showOptionsList: false,
      showPicker: false,
      pickerMode: null,
    }
  }

  render() {
    const avatarSrc = getAvatarUrl(this.props.chatAvatar)
    const selectedChatId = Store.getState().selectedChatId as number | undefined

    return (
      <div class="chat-window__chat-header-container">
        <div class="chat-window__chat-header-user-info">
          <div class="chat-window__chat-header-user-info-avatar">
            {avatarSrc && (
              <img
                class="chat-window__chat-header-user-info-avatar-image"
                src={avatarSrc}
                alt="Аватар чата"
              />
            )}
          </div>
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
            <div
              class="chat-window__chat-header-options__list-element"
              onClick={this.showAddPicker}
            >
              <img
                class="chat-window__chat-header-options__list-element-icon"
                src={Plus}
                height="11px"
                width="11px"
                alt="Добавить пользователя"
              />
              <p class="chat-window__chat-header-options__list-element-text">
                Добавить пользователя
              </p>
            </div>
            <div
              class="chat-window__chat-header-options__list-element"
              onClick={this.showDeletePicker}
            >
              <img
                class="chat-window__chat-header-options__list-element-icon"
                src={Cross}
                height="11px"
                width="11px"
                alt="Удалить пользователя"
              />
              <p class="chat-window__chat-header-options__list-element-text">
                Удалить пользователя
              </p>
            </div>
          </div>
        )}
        {this.state.showPicker && this.state.pickerMode && selectedChatId && (
          <UserPicker
            mode={this.state.pickerMode}
            chatId={selectedChatId}
            title={
              this.state.pickerMode === 'search'
                ? 'Добавить пользователя'
                : 'Удалить пользователя'
            }
            buttonText={
              this.state.pickerMode === 'search' ? 'Добавить' : 'Удалить'
            }
            onClose={this.closePicker}
            onSelect={
              this.state.pickerMode === 'search'
                ? this.addUser
                : this.deleteUser
            }
          />
        )}
      </div>
    )
  }

  private toggleOptionList() {
    this.setState({ showOptionsList: !this.state.showOptionsList })
  }

  private closePicker = () => {
    this.setState({
      showPicker: false,
      pickerMode: null,
      showOptionsList: false,
    })
  }

  showAddPicker = () => {
    this.setState({
      showPicker: true,
      pickerMode: 'search',
      showOptionsList: false,
    })
  }

  showDeletePicker = () => {
    this.setState({
      showPicker: true,
      pickerMode: 'list',
      showOptionsList: false,
    })
  }

  private addUser = async (user: TUser) => {
    const chatId = Store.getState().selectedChatId as number

    await chatsApi.addChatUser({
      users: [user.id],
      chatId,
    })
  }

  private deleteUser = async (user: TUser) => {
    const chatId = Store.getState().selectedChatId as number
    const currentUser = Store.getState().user as TUser | undefined

    await chatsApi.deleteChatUser({
      users: [user.id],
      chatId,
    })

    if (currentUser && user.id === currentUser.id) {
      const rawChats = Store.getState().chats
      const chats: TChat[] = Array.isArray(rawChats)
        ? rawChats.filter(({ id }) => id !== chatId)
        : []

      Store.setState('chats', chats)
      Store.setState('selectedChatId', null)
      this.props.onLeaveChat()
    }
  }
}

export function ChatHeader(props: TChatHeaderProps) {
  return new ChatHeaderBlock(props).element()
}
