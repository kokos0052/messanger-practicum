import { h, Block } from '@core/index'
import { getAvatarUrl } from '@shared/utils'
import { TAvatarProps } from './types'
import AvatarImage from '@shared/static/avatar.png'

export class AvatarBlock extends Block<TAvatarProps> {
  render() {
    const avatarSrc = getAvatarUrl(this.props.avatar) ?? AvatarImage

    return (
      <div class="profile-content__avatar-container">
        <div
          class="profile-content__avatar-image"
          onClick={this.props.onChangeAvatar}
        >
          <img
            src={avatarSrc}
            class="profile-content__avatar-content"
            alt="Аватар пользователя"
          />
        </div>
        <h4 class="profile-content__avatar-name">{this.props.userName}</h4>
      </div>
    )
  }
}

export function Avatar(props: TAvatarProps) {
  return new AvatarBlock(props).element()
}
