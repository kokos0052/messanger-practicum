import { AuthBlock, TAuthProps } from '@layouts/auth'
import authApi from '@shared/api/authApi'
import store from '@shared/store/store'
import { goToLink } from '@shared/utils'

export function withAuthForm(Component: typeof AuthBlock) {
  return class extends Component {
    constructor(props: TAuthProps) {
      super(props)
      this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
      super.componentDidMount()
      const form = this.element().querySelector('form')
      if (form) {
        form.addEventListener('submit', this.handleSubmit)
        const submitBtn = form.querySelector('.button-container button')
        if (submitBtn) {
          submitBtn.setAttribute('type', 'submit')
        }
      }
    }

    componentWillUnmount() {
      const form = this.element().querySelector('form')
      if (form) {
        form.removeEventListener('submit', this.handleSubmit)
      }
      super.componentWillUnmount()
    }

    async handleSubmit(e: Event) {
      e.preventDefault()
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)

      const data: Record<string, string> = {}
      formData.forEach((value, key) => {
        data[key] = value.toString()
      })

      if (this.props.formType === 'signupForm') {
        if (data.password !== data.password_two) {
          alert('Пароли не совпадают')
          return
        }
      }

      try {
        if (this.props.formType === 'loginForm') {
          const response = await authApi.signin(data)
          store.setState('user', response)
          goToLink('/messenger')
        } else {
          const response = await authApi.signup(data)
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
