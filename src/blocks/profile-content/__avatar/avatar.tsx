import { h, Block } from '@core/index'
import { TAvatarProps } from './types'
import AvatarImage from './avatar.png'

export class AvatarBlock extends Block<TAvatarProps> {
  render() {
    return (
      <div class="profile-content__avatar-container">
        <div
          class="profile-content__avatar-image"
          onClick={this.props.onChangeAvatar}
        >
          <img src={AvatarImage} alt="Аватар пользователя" />
        </div>
        <h4 class="profile-content__avatar-name">{this.props.userName}</h4>
      </div>
    )
  }
}

export function Avatar(props: TAvatarProps) {
  return new AvatarBlock(props).element()
}
