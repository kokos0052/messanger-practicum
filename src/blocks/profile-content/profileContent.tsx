import { h, Block } from '@core/index'
import { Button } from '@blocks/index'
import userApi from '@shared/api/userApi'
import authApi from '@shared/api/authApi'
import Store from '@shared/store/store'
import { TUser } from '@shared/types/user'
import {
  deleteAuthCookies,
  goToLink,
  isFormValid,
  normalizePhoneForApi,
  ValidationRule,
} from '@shared/utils'
import {
  buildPasswordFormValues,
  buildProfileCells,
  buildProfileFormValues,
  getPasswordFormFields,
  getProfileFormFields,
  getUserDisplayName,
  passwordCells,
  profileCellButtons,
} from './constants'
import { Avatar } from './__avatar/avatar'
import { Cell } from './__cell/cell'
import { CellButton } from './__cell/cellButton'
import { EProfileTypes, TProfileContentProps } from './types'

export class ProfileContentBlock extends Block<
  TProfileContentProps,
  { profileType: EProfileTypes }
> {
  private cellButtonActions
  private formValues: Record<string, string> = {}
  private lastFormValid = false

  constructor(props: TProfileContentProps) {
    super(props)
    this.state = { profileType: EProfileTypes.DEFAULT }
    this.cellButtonActions = [
      () => this.setProfileType(EProfileTypes.CHANGE_INFO),
      () => this.setProfileType(EProfileTypes.PASSWORD),
      this.logout,
    ]
  }

  private getUser(): TUser {
    return Store.getState().user as TUser
  }

  private getPasswordAgainValidators = (): ValidationRule[] => [
    { required: true },
    { minLength: 6 },
    {
      custom: (value) =>
        value !== this.formValues.new_password ? 'Пароли не совпадают' : null,
    },
  ]

  private checkFormValid(
    profileType: EProfileTypes = this.state.profileType
  ): boolean {
    if (profileType === EProfileTypes.CHANGE_INFO) {
      return isFormValid(this.formValues, getProfileFormFields())
    }

    if (profileType === EProfileTypes.PASSWORD) {
      const baseValid = isFormValid(this.formValues, getPasswordFormFields())
      return (
        baseValid &&
        this.formValues.new_password === this.formValues.new_password_again
      )
    }

    return true
  }

  private handleCellChange = (name: string, value: string) => {
    this.formValues[name] = value
    this.updateSaveButtonState()
  }

  private updateSaveButtonState() {
    const isValid = this.checkFormValid()
    if (isValid === this.lastFormValid) return

    this.lastFormValid = isValid

    const btn = this.domElement?.querySelector(
      '.profile-content-button-container button, .profile-content-password-button-container button'
    ) as HTMLButtonElement | null

    if (btn) {
      btn.disabled = !isValid
    }
  }

  private renderEditableCells(cells: ReturnType<typeof buildProfileCells>) {
    return cells.map((cell) => (
      <Cell {...cell} onChange={this.handleCellChange} />
    ))
  }

  private renderPasswordCells() {
    return passwordCells.map((cell) => (
      <Cell
        {...cell}
        onChange={this.handleCellChange}
        resolveValidators={
          cell.cellName === 'new_password_again'
            ? this.getPasswordAgainValidators
            : undefined
        }
      />
    ))
  }

  render() {
    const user = this.getUser()
    const cells = buildProfileCells(user)
    const userName = getUserDisplayName(user)
    const isSaveDisabled = !this.checkFormValid()

    if (this.state.profileType === EProfileTypes.CHANGE_INFO) {
      return (
        <section class="profile-content-container">
          <Avatar
            userName={userName}
            avatar={user.avatar}
            onChangeAvatar={this.props.onChangeAvatar}
          />
          <form class="profile-content-cells" onSubmit={this.handleSubmit}>
            {this.renderEditableCells(cells)}
            <div class="profile-content-button-container">
              <Button
                variant="primary"
                label="Сохранить"
                type="submit"
                disabled={isSaveDisabled}
              />
            </div>
          </form>
        </section>
      )
    }

    if (this.state.profileType === EProfileTypes.PASSWORD) {
      return (
        <section class="profile-content-container">
          <Avatar
            userName={userName}
            avatar={user.avatar}
            onChangeAvatar={this.props.onChangeAvatar}
          />
          <form class="profile-content-cells" onSubmit={this.handleSubmit}>
            {this.renderPasswordCells()}
            <div class="profile-content-password-button-container">
              <Button
                variant="primary"
                label="Сохранить"
                type="submit"
                disabled={isSaveDisabled}
              />
            </div>
          </form>
        </section>
      )
    }

    return (
      <section class="profile-content-container">
        <Avatar
          userName={userName}
          avatar={user.avatar}
          onChangeAvatar={this.props.onChangeAvatar}
        />
        <div class="profile-content-cells">
          {cells.map((cell) => (
            <Cell {...cell} isActive={false} />
          ))}
        </div>
        <div class="profile-content-cells">
          {profileCellButtons.map((cellButton, index) => (
            <CellButton
              {...cellButton}
              isFirst={index === 0}
              isLast={index === profileCellButtons.length - 1}
              action={this.cellButtonActions[index]}
            />
          ))}
        </div>
      </section>
    )
  }

  private setProfileType = (type: EProfileTypes) => {
    if (type === EProfileTypes.CHANGE_INFO) {
      this.formValues = buildProfileFormValues(this.getUser())
    } else if (type === EProfileTypes.PASSWORD) {
      this.formValues = buildPasswordFormValues()
    } else {
      this.formValues = {}
    }

    this.lastFormValid = this.checkFormValid(type)
    this.setState({ profileType: type })
  }

  private logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Ошибка выхода:', error)
    } finally {
      deleteAuthCookies()
      Store.setState('user', null)
      goToLink('/')
    }
  }

  private handleSubmit = async (e: Event) => {
    e.preventDefault()

    if (!this.checkFormValid()) return

    try {
      if (this.state.profileType === EProfileTypes.CHANGE_INFO) {
        await userApi.unpdateProfile({
          ...this.formValues,
          phone: normalizePhoneForApi(this.formValues.phone ?? ''),
        })
        const response = await authApi.getUser()
        Store.setState('user', response)
        this.setProfileType(EProfileTypes.DEFAULT)
        return
      }

      if (this.state.profileType === EProfileTypes.PASSWORD) {
        await userApi.changePassword({
          oldPassword: this.formValues.old_password,
          newPassword: this.formValues.new_password,
        })
        this.setProfileType(EProfileTypes.DEFAULT)
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
  }
}

export function ProfileContent(props: TProfileContentProps) {
  return new ProfileContentBlock(props).element()
}
