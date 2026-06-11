import { ErrorBlock } from '../layouts/error/error'

const errorPage = new ErrorBlock({
  code: '404',
  message: 'Не туда попали',
})

document.body.appendChild(errorPage.element())
