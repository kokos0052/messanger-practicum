import { AuthBlock, TAuthProps } from '@layouts/auth'
import { getAuthFormFields } from '@layouts/auth/constants'
import authApi from '@shared/api/authApi'
import store from '@shared/store/store'
import {
  goToLink,
  isFormValid,
  normalizePhoneForApi,
  validateValue,
} from '@shared/utils'

function getFormValues(form: HTMLFormElement): Record<string, string> {
  const data: Record<string, string> = {}
  const formData = new FormData(form)

  formData.forEach((value, key) => {
    data[key] = value.toString()
  })

  return data
}

export function withAuthForm(Component: typeof AuthBlock) {
  return class extends Component {
    constructor(props: TAuthProps) {
      super(props)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.updateSubmitState = this.updateSubmitState.bind(this)
    }

    componentDidMount() {
      super.componentDidMount()
      const form = this.element().querySelector('form')

      if (form) {
        form.addEventListener('submit', this.handleSubmit)
        form.addEventListener('input', this.updateSubmitState)
        form.addEventListener('blur', this.updateSubmitState, true)
        this.updateSubmitState()
      }
    }

    componentWillUnmount() {
      const form = this.element().querySelector('form')

      if (form) {
        form.removeEventListener('submit', this.handleSubmit)
        form.removeEventListener('input', this.updateSubmitState)
        form.removeEventListener('blur', this.updateSubmitState, true)
      }

      super.componentWillUnmount()
    }

    updateSubmitState() {
      const form = this.element().querySelector('form')
      const submitBtn = form?.querySelector(
        '.button-container .btn-primary'
      ) as HTMLButtonElement | null

      if (!form || !submitBtn) return

      const data = getFormValues(form)
      const fields = getAuthFormFields(this.props.formType)
      let isValid = isFormValid(data, fields)

      if (this.props.formType === 'signupForm') {
        isValid =
          isValid && data.password === data.password_two && Boolean(data.password)
      }

      submitBtn.disabled = !isValid
    }

    validateForm(form: HTMLFormElement): boolean {
      const fields = getAuthFormFields(this.props.formType)
      let isValid = true

      fields.forEach(({ name, validators }) => {
        const input = form.querySelector(
          `[name="${name}"]`
        ) as HTMLInputElement | null

        if (!input) return

        const error = validateValue(input.value, validators)

        if (error) {
          isValid = false
          input.dispatchEvent(new FocusEvent('blur', { bubbles: true }))
        }
      })

      const data = getFormValues(form)

      if (
        this.props.formType === 'signupForm' &&
        data.password !== data.password_two
      ) {
        isValid = false
        alert('Пароли не совпадают')
      }

      return isValid
    }

    async handleSubmit(e: Event) {
      e.preventDefault()
      const form = e.target as HTMLFormElement

      if (!this.validateForm(form)) {
        this.updateSubmitState()
        return
      }

      const data = getFormValues(form)

      try {
        if (this.props.formType === 'loginForm') {
          const response = await authApi.signin(data)
          store.setState('user', response)
          goToLink('/messenger')
        } else {
          const response = await authApi.signup({
            ...data,
            phone: normalizePhoneForApi(data.phone),
          })
          store.setState('user', response)
          goToLink('/messenger')
        }

        await authApi.getUser()
      } catch (error) {
        console.error('Ошибка авторизации:', error)
      }
    }
  }
}
