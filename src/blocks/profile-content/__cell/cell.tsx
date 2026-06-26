import { h, Block } from '../../../core'
import { validateValue } from '@shared/utils'
import { TCellBlockProps } from './types'

export class CellBlock extends Block<
  TCellBlockProps,
  { value: string; error: string | null }
> {
  constructor(props: TCellBlockProps) {
    super(props)
    this.state = {
      value: props.cellValue,
      error: null,
    }
  }

  private getValidators() {
    return this.props.resolveValidators?.() ?? this.props.validators
  }

  private onInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    this.state.value = input.value
    this.props.onChange?.(this.props.cellName, input.value)
  }

  private onBlur = (e: Event) => {
    const input = e.target as HTMLInputElement
    const value = input.value
    const error = validateValue(value, this.getValidators())

    this.state.value = value

    if (error !== this.state.error) {
      this.setState({ error })
    }

    this.props.onChange?.(this.props.cellName, value)
  }

  render() {
    const isDisabled = this.props.isActive === false
    const { cellType } = this.props
    const { value, error } = this.state
    const hasError = Boolean(error)

    return (
      <div
        class={`profile-content__cell-container profile-content__cell-container-not-spasing profile-content__cell-with-border${
          hasError ? ' profile-content__cell-container--error' : ''
        }`}
      >
        <label class="profile-content__cell-key" for={this.props.cellId}>
          {this.props.cellKey}
        </label>
        <div class="profile-content__cell-field">
          {isDisabled ? (
            <input
              id={this.props.cellId}
              class="profile-content__cell-value"
              type={cellType}
              name={this.props.cellName}
              value={value}
              disabled
            />
          ) : (
            <input
              id={this.props.cellId}
              class="profile-content__cell-value"
              type={cellType}
              name={this.props.cellName}
              value={value}
              onInput={this.onInput}
              onBlur={this.onBlur}
            />
          )}
          {hasError && (
            <span class="profile-content__cell-error">{error}</span>
          )}
        </div>
      </div>
    )
  }
}

export function Cell(props: TCellBlockProps) {
  return new CellBlock(props).element()
}
