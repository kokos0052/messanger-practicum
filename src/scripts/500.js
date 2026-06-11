import { ErrorBlock } from '../layouts/error/error'

const errorPage = new ErrorBlock({
  code: '500',
  message: 'Мы уже фиксим',
})

document.body.appendChild(errorPage.element())
