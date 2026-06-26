import authApi from '@shared/api/authApi'
import { Route } from './Route'
import type { TBlockConstructor } from './types'
import Store from '@shared/store/store'

const PUBLIC_ERROR_PAGES = new Set(['/404', '/500'])
const MESSENGER_PATH = '/messenger'

export class Router {
  private static __instance: Router | null = null
  private routes: Route[] = []
  private history: History = window.history
  private _currentRoute: Route | null = null
  private _rootQuery: string = ''
  private _protectedPaths: Set<string> = new Set()
  private _guestPaths: Set<string> = new Set()
  private _isChecking: boolean = false

  constructor(rootQuery: string) {
    if (Router.__instance) return Router.__instance
    this._rootQuery = rootQuery
    Router.__instance = this
  }

  public use<PropsType>(
    pathname: string,
    block: TBlockConstructor,
    blockProps?: PropsType
  ): this {
    const route = new Route(pathname, block, {
      rootQuery: this._rootQuery,
      blockProps: blockProps as object,
    })
    this.routes.push(route)
    return this
  }

  public protectedUse<PropsType>(
    pathname: string,
    block: TBlockConstructor,
    blockProps?: PropsType
  ): this {
    this._protectedPaths.add(pathname)
    return this.use(pathname, block, blockProps)
  }

  public guestUse<PropsType>(
    pathname: string,
    block: TBlockConstructor,
    blockProps?: PropsType
  ): this {
    this._guestPaths.add(pathname)
    return this.use(pathname, block, blockProps)
  }

  public start(): void {
    window.onpopstate = () => {
      this._onRoute(window.location.pathname)
    }
    this._onRoute(window.location.pathname)
  }

  public go(pathname: string): void {
    this.history.pushState({}, '', pathname)
    this._onRoute(pathname)
  }

  private async _onRoute(pathname: string): Promise<void> {
    if (this._isChecking) return
    this._isChecking = true

    try {
      this.resetSelectedChatIfNeeded(pathname)

      if (!PUBLIC_ERROR_PAGES.has(pathname)) {
        if (this._protectedPaths.has(pathname)) {
          const isAuthorized = await this._checkProtectedAccess()
          if (!isAuthorized) return
        } else if (this._guestPaths.has(pathname)) {
          const isRedirected = await this._checkGuestAccess()
          if (isRedirected) return
        }
      }

      const route = this.getRoute(pathname)
      if (!route) {
        const notFound = this.getRoute('/404')
        if (notFound) {
          if (this._currentRoute) this._currentRoute.leave()
          this._currentRoute = notFound
          notFound.render()
        }
        return
      }

      if (this._currentRoute && this._currentRoute !== route) {
        this._currentRoute.leave()
      }
      this._currentRoute = route
      route.render()
    } finally {
      this._isChecking = false
    }
  }

  private resetSelectedChatIfNeeded(pathname: string): void {
    if (pathname === MESSENGER_PATH) return

    if (Store.getState().selectedChatId != null) {
      Store.setState('selectedChatId', null)
    }
  }

  private async _checkProtectedAccess(): Promise<boolean> {
    try {
      const response = await authApi.getUser()
      Store.setState('user', response)
      return true
    } catch (err) {
      this.history.replaceState({}, '', '/')
      const login = this.getRoute('/')
      if (login) {
        this._currentRoute = login
        login.render()
      }

      return false
    }
  }

  private async _checkGuestAccess(): Promise<boolean> {
    try {
      const response = await authApi.getUser()
      Store.setState('user', response)

      this.history.replaceState({}, '', '/messenger')
      const messenger = this.getRoute('/messenger')
      if (messenger) {
        if (this._currentRoute) this._currentRoute.leave()
        this._currentRoute = messenger
        messenger.render()
      }

      return true
    } catch (err) {
      return false
    }
  }

  private getRoute(pathname: string): Route | undefined {
    const exact = this.routes.find((route) => route.match(pathname))
    if (exact) return exact
    return this.routes.find((route) => route.match('*'))
  }

  public static getInstance(): Router | null {
    return Router.__instance
  }
}
