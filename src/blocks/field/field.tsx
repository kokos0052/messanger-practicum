import { h, Block } from '@core/index'
import { validateValue } from '@shared/utils'
import { TFieldProps } from './types'

export class FiledBlock extends Block<
  TFieldProps,
  { value: string; error: string | null }
> {
  private unsubscribeFromStore?: () => void

  constructor(props: TFieldProps = {} as TFieldProps) {
    const defaults = {
      onChange: null,
      onBlur: null,
      value: '',
    }
    super({ ...defaults, ...props } as TFieldProps)
    this.state = {
      value: props.value || '',
      error: null,
    }
  }

  protected componentDidMount() {
    if (this.props.store) {
      this.unsubscribeFromStore = this.props.store.subscribe(this.onStoreChange)
    }
  }

  protected componentWillUnmount() {
    this.unsubscribeFromStore?.()
  }

  private onStoreChange = () => {
    if (!this.props.store) return
    const storeValue = this.props.store.getState()[this.props.name] as
      | string
      | undefined
    if (storeValue !== undefined && storeValue !== this.state.value) {
      this.setState((prev) => ({ ...prev, value: storeValue }))
    }
  }

  render() {
    return (
      <div class={`form-input${this.state.error ? ' form-input--error' : ''}`}>
        <div class="form-input__field-wrapper">
          <input
            id={this.props.id}
            class="form-input__field"
            type={this.props.type}
            name={this.props.name}
            value={this.state.value}
            onInput={this.onInput}
            onChange={this.onInput}
            onBlur={this.onBlur}
            placeholder=" "
          />
          <label class="form-input__label" for={this.props.id}>
            {this.props.label}
          </label>

          {this.state.error && (
            <span class="form-input__error" for={this.props.id}>
              {this.state.error}
            </span>
          )}
        </div>
      </div>
    )
  }

  private onInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    const newValue = input.value

    this.state.value = newValue
    this.props.store?.setState(this.props.name, newValue)

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e)
    }
  }

  private onBlur = (e: Event) => {
    const input = e.target as HTMLInputElement
    const value = input.value
    const error = validateValue(value, this.props.validators)

    this.state.value = value

    if (error !== this.state.error) {
      this.setState({ error })
    }

    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(e)
    }
  }
}

export function Field(props: TFieldProps) {
  return new FiledBlock(props).element()
}
