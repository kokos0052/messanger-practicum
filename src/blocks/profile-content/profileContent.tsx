import { h, Block } from '../../core/index'
import { profileInfo } from '../../mocks/profileInfo'
import { Button } from '../button'
import { Avatar } from './__avatar/avatar'
import { Cell } from './__cell/cell'
import { CellButton } from './__cell/cellButton'
import { TProfileContentProps } from './types'

export class ProfileContentBlock extends Block<TProfileContentProps> {
  render() {
    if (this.props.profileType === 'changeInfo') {
      return (
        <section class="profile-content-container">
          <Avatar
            userName={profileInfo.userName}
            onChangeAvatar={this.props.onChangeAvatar}
          />
          <div class="profile-content-cells">
            {profileInfo.cells.map((cell) => (
              <Cell {...cell} />
            ))}
            <div class="profile-content-button-container">
              {<Button variant="primary" label="Сохранить" />}
            </div>
          </div>
        </section>
      )
    }

    if (this.props.profileType === 'password') {
      return (
        <section class="profile-content-container">
          <Avatar
            userName={profileInfo.userName}
            onChangeAvatar={this.props.onChangeAvatar}
          />
          <div class="profile-content-cells">
            {profileInfo.passwordCells.map((cell) => (
              <Cell {...cell} />
            ))}
            <div class="profile-content-password-button-container">
              {<Button variant="primary" label="Сохранить" />}
            </div>
          </div>
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
            <Cell {...cell} />
          ))}
        </div>
        <div class="profile-content-cells">
          {profileInfo.cellButtons.map((cellButton, index) => (
            <CellButton
              {...cellButton}
              isFirst={index === 0}
              isLast={index === profileInfo.cellButtons.length - 1}
            />
          ))}
        </div>
      </section>
    )
  }
}

export function ProfileContent(props: TProfileContentProps) {
  return new ProfileContentBlock(props).element()
}
