import { h, Block } from '../../../core'
import { TCellButtonProps } from './types'

function goToLink(link: string) {
  window.location.href = link
}

export class CellButtonBlock extends Block<TCellButtonProps> {
  render() {
    return (
      <button
        class="profile-content__cell-button profile-content__cell-container-not-spasing profile-content__cell-button-border"
        onClick={() => goToLink(this.props.actionLink)}
      >
        <p class="profile-content__cell-key">{this.props.actionName}</p>
      </button>
    )
  }
}

export function CellButton(props: TCellButtonProps) {
  return new CellButtonBlock(props).element()
}
