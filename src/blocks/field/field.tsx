import { h, Block } from '../../core'
import { TFieldProps } from './types'

export class FiledBlock extends Block<TFieldProps> {
  constructor(props: TFieldProps = {} as TFieldProps) {
    const defaults = { onChange: null }
    super({ ...defaults, ...props } as TFieldProps)
  }

  render() {
    return (
      <div class="form-input">
        <input
          id={this.props.id}
          class="form-input__field"
          type={this.props.type}
          name={this.props.name}
          onChange={this.props.onChange}
          placeholder=" "
        />
        <label class="form-input__label" for={this.props.id}>
          {this.props.label}
        </label>
      </div>
    )
  }
}

export function Field(props: TFieldProps) {
  return new FiledBlock(props).element()
}
