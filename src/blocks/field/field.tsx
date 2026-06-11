import { h, Block } from '../../core'
import { TFieldProps } from './types'

export class FiledBlock extends Block<
  TFieldProps,
  { value: string; error: string | null }
> {
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
            onChange={this.onChange}
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

  private validate(value: string): string | null {
    const { validators } = this.props
    if (!validators || !Array.isArray(validators)) return null

    for (const rule of validators) {
      if (rule.required && !value.trim()) {
        return 'Поле обязательно для заполнения'
      }
      if (rule.minLength && value.length < rule.minLength) {
        return `Минимальная длина ${rule.minLength} символов`
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return `Максимальная длина ${rule.maxLength} символов`
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        return 'Неверный формат'
      }
      if (rule.custom) {
        const customError = rule.custom(value)
        if (customError) return customError
      }
    }
    return null
  }

  private onChange = (e: Event) => {
    const input = e.target as HTMLInputElement
    const newValue = input.value

    this.setState((prevState) => ({ ...prevState, value: newValue }))

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e)
    }
  }

  private onBlur = (e: Event) => {
    const error = this.validate(this.state.value)
    this.setState((prevState) => ({ ...prevState, error }))
    console.log(this.state, `state`)

    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(e)
    }
  }
}

export function Field(props: TFieldProps) {
  return new FiledBlock(props).element()
}
