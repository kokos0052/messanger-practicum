import type { IRoutableBlock, TBlockConstructor, TRouteProps } from './types'

export class Route {
  private _pathname: string
  private _blockClass: TBlockConstructor
  private _block: IRoutableBlock | null = null
  private _props: TRouteProps

  constructor(pathname: string, view: TBlockConstructor, props: TRouteProps) {
    this._pathname = pathname
    this._blockClass = view
    this._props = props
  }

  public match(pathname: string): boolean {
    return pathname === this._pathname
  }

  public leave(): void {
    if (this._block) {
      this._block.destroy()
      this._block = null
    }
  }

  public render(): void {
    if (!this._block) {
      this._block = new this._blockClass(this._props.blockProps)
      const root = document.querySelector(this._props.rootQuery)
      if (root) {
        root.appendChild(this._block.element())
      }
    }
    this._block.element()
  }
}
