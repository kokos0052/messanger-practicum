import './styles/main.scss'
import { Router } from '@shared/routing'
import { TAuthProps, TErrorProps } from '@layouts/index'
import AuthPage from '@pages/AuthPage'
import ChatPage from '@pages/MessangerPage'
import ProfilePage from '@pages/SettingsPage'
import ErrorPage from '@pages/ErrorPage'

const rootQuery = '#root'
const router = new Router(rootQuery)

router.use<TAuthProps>('/', AuthPage, { formType: 'loginForm' })
router.use<TAuthProps>('/sign-up', AuthPage, { formType: 'signupForm' })
router.protectedUse('/settings', ProfilePage)
router.protectedUse('/messenger', ChatPage)
router.use<TErrorProps>('/404', ErrorPage, {
  code: '404',
  message: 'Не туда попали',
})
router.use<TErrorProps>('/500', ErrorPage, {
  code: '500',
  message: 'Мы уже фиксим',
})
router.start()

export { router }
