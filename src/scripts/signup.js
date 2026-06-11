import { AuthBlock } from '../layouts/auth/auth'

const authPage = new AuthBlock({
  formType: 'signupForm',
})

document.body.appendChild(authPage.element())
