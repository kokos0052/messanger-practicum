import { h, Block } from '@core/index'
import { Button } from '@blocks/index'
import chatsApi from '@shared/api/chatsApi'
import userApi from '@shared/api/userApi'
import { TUser } from '@shared/types/user'
import Cross from '@shared/static/cross.svg'
import { TUserPickerProps } from './types'
import { getUserLabel, normalizeUsers } from './utils'

type TUserPickerState = {
  users: TUser[]
  selectedUserId: number | null
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
}

export class UserPickerBlock extends Block<TUserPickerProps, TUserPickerState> {
  private searchTimer: ReturnType<typeof setTimeout> | null = null
  private query = ''

  constructor(props: TUserPickerProps) {
    super(props)
    this.state = {
      users: [],
      selectedUserId: null,
      isLoading: props.mode === 'list',
      isSubmitting: false,
      error: null,
    }
  }

  componentDidMount() {
    if (this.props.mode === 'list') {
      void this.loadChatUsers()
    }
  }

  componentWillUnmount() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
  }

  private handleOverlayClick = (e: Event) => {
    if (e.target === e.currentTarget) {
      this.props.onClose()
    }
  }

  private handleWindowClick = (e: Event) => {
    e.stopPropagation()
  }

  private onSearchInput = (e: Event) => {
    this.query = (e.target as HTMLInputElement).value.trim()
    this.scheduleSearch()
  }

  private scheduleSearch() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }

    if (!this.query) {
      this.setState({
        users: [],
        selectedUserId: null,
        isLoading: false,
        error: null,
      })
      return
    }

    this.setState({ isLoading: true, error: null })

    this.searchTimer = setTimeout(() => {
      void this.searchUsers()
    }, 300)
  }

  private async searchUsers() {
    const query = this.query

    if (!query) return

    try {
      const response = await userApi.searchUser(query)
      const users = normalizeUsers(response)

      this.setState({
        users,
        selectedUserId: null,
        isLoading: false,
        error: users.length ? null : 'Пользователи не найдены',
      })
    } catch (error) {
      console.error('Ошибка поиска пользователя:', error)
      this.setState({
        users: [],
        selectedUserId: null,
        isLoading: false,
        error: 'Не удалось выполнить поиск',
      })
    }
  }

  private async loadChatUsers() {
    const { chatId } = this.props

    if (!chatId) {
      this.setState({
        isLoading: false,
        error: 'Чат не выбран',
      })
      return
    }

    try {
      const response = await chatsApi.getChatUsers(String(chatId))
      const users = normalizeUsers(response)

      this.setState({
        users,
        selectedUserId: null,
        isLoading: false,
        error: users.length ? null : 'В чате нет пользователей',
      })
    } catch (error) {
      console.error('Ошибка загрузки участников:', error)
      this.setState({
        users: [],
        selectedUserId: null,
        isLoading: false,
        error: 'Не удалось загрузить участников чата',
      })
    }
  }

  private selectUser = (userId: number) => {
    this.setState({ selectedUserId: userId, error: null })
  }

  private handleSubmit = async (e: Event) => {
    e.preventDefault()

    const selectedUser = this.state.users.find(
      ({ id }) => id === this.state.selectedUserId
    )

    if (!selectedUser) return

    this.setState({ isSubmitting: true })

    try {
      await this.props.onSelect(selectedUser)
      this.props.onClose()
    } catch (error) {
      console.error('Ошибка действия с пользователем:', error)
      this.setState({
        isSubmitting: false,
        error: 'Не удалось выполнить действие',
      })
    }
  }

  private renderUserList() {
    const { users, selectedUserId } = this.state

    if (!users.length) return null

    return (
      <div class="user-picker__list">
        {users.map((user) => (
          <button
            type="button"
            class={`user-picker__item${
              selectedUserId === user.id ? ' user-picker__item_selected' : ''
            }`}
            onClick={() => this.selectUser(user.id)}
          >
            {getUserLabel(user)}
          </button>
        ))}
      </div>
    )
  }

  render() {
    const { title, buttonText, mode } = this.props
    const { isLoading, isSubmitting, error } = this.state
    const isSubmitDisabled =
      !this.state.selectedUserId || isSubmitting || isLoading

    return (
      <div class="modal-overlay" onClick={this.handleOverlayClick}>
        <div class="modal-window" onClick={this.handleWindowClick}>
          <h4 class="modal-title">{title}</h4>
          <form class="user-picker-form" onSubmit={this.handleSubmit}>
            {mode === 'search' && (
              <div class="user-picker__search">
                <input
                  class="user-picker__input"
                  type="text"
                  name="login"
                  placeholder="Введите логин"
                  onInput={this.onSearchInput}
                />
              </div>
            )}
            {isLoading && <p class="user-picker__status">Загрузка...</p>}
            {!isLoading && error && (
              <p class="user-picker__status user-picker__status_error">
                {error}
              </p>
            )}
            {!isLoading && this.renderUserList()}
            <Button
              type="submit"
              variant="primary"
              label={buttonText}
              disabled={isSubmitDisabled}
            />
          </form>
          <button
            class="modal-close-btn"
            onClick={(e: Event) => {
              e.preventDefault()
              this.props.onClose()
            }}
          >
            <img src={Cross} />
          </button>
        </div>
      </div>
    )
  }
}

export function UserPicker(props: TUserPickerProps) {
  return new UserPickerBlock(props).element()
}
