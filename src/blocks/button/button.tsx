import { h, Block } from '@core/index'
import { TButtonProps } from './types'

export class ButtonBlock extends Block<TButtonProps> {
  render() {
    return (
      <button
        type={this.props.type}
        class={`btn btn-${this.props.variant}`}
        {...(this.props.disabled ? { disabled: true } : {})}
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
