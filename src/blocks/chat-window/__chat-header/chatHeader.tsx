import { h, Block } from '@core/index'
import { Modal } from '@blocks/index'
import { TChatHeaderProps } from './type'
import Plus from './plus.svg'
import Cross from './cross.svg'
import Store from '@shared/store/store'
import { modalAddMock, modalDeleteMock } from './constants'
import { TChatResonseData } from './types'
import userApi from '@shared/api/userApi'
import chatsApi from '@shared/api/chatsApi'

export class ChatHeaderBlock extends Block<
  TChatHeaderProps,
  {
    showOptionsList: boolean
    showModal: boolean
    modalOptions: typeof modalAddMock
    modalAction?: (userData: TChatResonseData) => void
  }
> {
  constructor(props: TChatHeaderProps) {
    super(props)
    this.state = {
      showOptionsList: false,
      showModal: false,
      modalOptions: { ...modalAddMock },
    }
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
            <div
              class="chat-window__chat-header-options__list-element"
              onClick={this.showAddModal}
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
              onClick={this.showDeleteModal}
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
            {this.state.showModal && (
              <Modal
                {...this.state.modalOptions}
                onClose={() =>
                  this.setState((prevState) => ({
                    ...prevState,
                    showModal: false,
                  }))
                }
                action={this.state.modalAction}
              />
            )}
          </div>
        )}
      </div>
    )
  }

  private toggleOptionList() {
    this.setState({ showOptionsList: !this.state.showOptionsList })
  }

  showAddModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      showModal: true,
      modalOptions: modalAddMock,
      modalAction: this.addUser,
    }))
  }

  showDeleteModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      showModal: true,
      modalOptions: modalDeleteMock,
      modalAction: this.deleteUser,
    }))
  }

  getUser = async (userData: TChatResonseData) => {
    const chatId = Store.getState().selectedChatId as number
    console.log(userData, `userData`)
    try {
      const response = await userApi.searchUser(userData.login)
      const userId = response?.[0]?.id as number
      return { chatId, userId }
    } catch (error) {
      console.error('Ошибка:', error)
      return { chatId, userId: undefined }
    }
  }

  addUser = async (userData: TChatResonseData) => {
    try {
      const reqInfo = await this.getUser(userData)
      await chatsApi.addChatUser({
        users: [reqInfo?.userId as number],
        chatId: reqInfo.chatId,
      })
    } catch (error) {
      console.error('Ошибка:', error)
    } finally {
      this.setState((prevState) => ({ ...prevState, showModal: false }))
    }
  }

  deleteUser = async (userData: TChatResonseData) => {
    try {
      const reqInfo = await this.getUser(userData)
      await chatsApi.deleteChatUser({
        users: [reqInfo?.userId as number],
        chatId: reqInfo.chatId,
      })
    } catch (error) {
      console.error('Ошибка:', error)
    } finally {
      this.setState((prevState) => ({ ...prevState, showModal: false }))
    }
  }
}

export function ChatHeader(props: TChatHeaderProps) {
  return new ChatHeaderBlock(props).element()
}
