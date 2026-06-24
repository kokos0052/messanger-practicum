import { h, Block } from '../../../core'
import { TCellBlockProps } from './types'

export class CellBlock extends Block<TCellBlockProps> {
  render() {
    const isDisabled = this.props.isActive === false

    return (
      <div class="profile-content__cell-container profile-content__cell-container-not-spasing profile-content__cell-with-border">
        <label class="profile-content__cell-key" for={this.props.cellId}>
          {this.props.cellKey}
        </label>
        {isDisabled ? (
          <input
            id={this.props.cellId}
            class="profile-content__cell-value"
            placeholder={this.props.cellValue}
            type={this.props.cellType}
            name={this.props.cellName}
            disabled
          />
        ) : (
          <input
            id={this.props.cellId}
            class="profile-content__cell-value"
            placeholder={this.props.cellValue}
            type={this.props.cellType}
            name={this.props.cellName}
          />
        )}
      </div>
    )
  }
}

export function Cell(props: TCellBlockProps) {
  return new CellBlock(props).element()
}
