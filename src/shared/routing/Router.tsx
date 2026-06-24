// Router.ts
import authApi from '@shared/api/authApi'
import { Route } from './Route'
import type { TBlockConstructor } from './types'
import Store from '@shared/store/store'

export class Router {
  private static __instance: Router | null = null
  private routes: Route[] = []
  private history: History = window.history
  private _currentRoute: Route | null = null
  private _rootQuery: string = ''
  private _protectedPaths: Set<string> = new Set()
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
      if (this._protectedPaths.has(pathname)) {
        try {
          const response = await authApi.getUser()
          Store.setState('user', response)
        } catch (err) {
          this.history.replaceState({}, '', '/')
          const login = this.getRoute('/')
          if (login) {
            this._currentRoute = login
            login.render()
          }

          return
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

  private getRoute(pathname: string): Route | undefined {
    const exact = this.routes.find((route) => route.match(pathname))
    if (exact) return exact
    return this.routes.find((route) => route.match('*'))
  }

  public static getInstance(): Router | null {
    return Router.__instance
  }
}
