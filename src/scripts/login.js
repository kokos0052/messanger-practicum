import { AuthBlock } from '../layouts/auth/auth'

const authPage = new AuthBlock({
  formType: 'loginForm',
})

document.body.appendChild(authPage.element())
