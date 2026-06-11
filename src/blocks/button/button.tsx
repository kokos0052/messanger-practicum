import { h, Block } from '../../core'
import { TButtonProps } from './types'

export class ButtonBlock extends Block<TButtonProps> {
  render() {
    return (
      <button
        class={`btn btn-${this.props.variant}`}
        onClick={this.props.onClick}
      >
        {this.props.label}
      </button>
    )
  }
}

export function Button(props: TButtonProps) {
  return new ButtonBlock(props).element()
}
