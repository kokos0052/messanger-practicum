import { h, Block } from '@core/index'
import { Button } from '@blocks/index'
import userApi from '@shared/api/userApi'
import authApi from '@shared/api/authApi'
import Store from '@shared/store/store'
import { deleteAuthCookies, goToLink } from '@shared/utils'
import { profileInfo } from '@mocks/profileInfo'
import { Avatar } from './__avatar/avatar'
import { Cell } from './__cell/cell'
import { CellButton } from './__cell/cellButton'
import { EProfileTypes, TProfileContentProps } from './types'

export class ProfileContentBlock extends Block<
  TProfileContentProps,
  { profileType: EProfileTypes }
> {
  private cellButtonActions

  constructor(props: TProfileContentProps) {
    super(props)
    this.state = { profileType: EProfileTypes.DEFAULT }
    this.cellButtonActions = [
      () => this.setProfileType(EProfileTypes.CHANGE_INFO),
      () => this.setProfileType(EProfileTypes.PASSWORD),
      this.logout,
    ]
  }

  render() {
    if (this.state.profileType === EProfileTypes.CHANGE_INFO) {
      return (
        <section class="profile-content-container">
          <Avatar
            userName={profileInfo.userName}
            onChangeAvatar={this.props.onChangeAvatar}
          />
          <form class="profile-content-cells" onSubmit={this.handleSubmit}>
            {profileInfo.cells.map((cell) => (
              <Cell {...cell} />
            ))}
            <div class="profile-content-button-container">
              <Button variant="primary" label="Сохранить" type="submit" />
            </div>
          </form>
        </section>
      )
    }

    if (this.state.profileType === EProfileTypes.PASSWORD) {
      return (
        <section class="profile-content-container">
          <Avatar
            userName={profileInfo.userName}
            onChangeAvatar={this.props.onChangeAvatar}
          />
          <form class="profile-content-cells" onSubmit={this.handleSubmit}>
            {profileInfo.passwordCells.map((cell) => (
              <Cell {...cell} />
            ))}
            <div class="profile-content-password-button-container">
              <Button variant="primary" label="Сохранить" type="submit" />
            </div>
          </form>
        </section>
      )
    }

    return (
      <section class="profile-content-container">
        <Avatar
          userName={profileInfo.userName}
          onChangeAvatar={this.props.onChangeAvatar}
        />
        <div class="profile-content-cells">
          {profileInfo.cells.map((cell) => (
            <Cell {...cell} isActive={false} />
          ))}
        </div>
        <div class="profile-content-cells">
          {profileInfo.cellButtons.map((cellButton, index) => (
            <CellButton
              {...cellButton}
              isFirst={index === 0}
              isLast={index === profileInfo.cellButtons.length - 1}
              action={this.cellButtonActions[index]}
            />
          ))}
        </div>
      </section>
    )
  }

  private setProfileType = (type: EProfileTypes) => {
    this.setState((prevState) => ({ ...prevState, profileType: type }))
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

    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const data: Record<string, string> = {}

    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    try {
      if (this.state.profileType === EProfileTypes.CHANGE_INFO) {
        await userApi.unpdateProfile(data)
        this.setProfileType(EProfileTypes.DEFAULT)
        return
      }

      if (this.state.profileType === EProfileTypes.PASSWORD) {
        if (data.new_password !== data.new_password_again) {
          alert('Пароли не совпадают')
          return
        }

        await userApi.changePassword({
          oldPassword: data.old_password,
          newPassword: data.new_password,
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
