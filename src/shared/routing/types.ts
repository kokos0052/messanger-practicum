import { Block } from '@core/Block'

export interface IRoutableBlock {
  element(): HTMLElement
  destroy(): void
}

export type TBlockConstructor = new (
  props?: any
) => Block<any, any> & IRoutableBlock

export type TRouteProps = {
  rootQuery: string
  blockProps?: object
}
