import { h, Block } from '@core/index'
import { TCellButtonProps } from './types'

export class CellButtonBlock extends Block<TCellButtonProps> {
  render() {
    return (
      <button
        class={`profile-content__cell-button ${this.props.isFirst ? 'profile-content__cell-container-not-spasing' : ''} ${this.props.isLast ? '' : 'profile-content__cell-button-border'}`}
        onClick={this.props.action}
      >
        <p class="profile-content__cell-key">{this.props.actionName}</p>
      </button>
    )
  }
}

export function CellButton(props: TCellButtonProps) {
  return new CellButtonBlock(props).element()
}
