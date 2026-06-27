import { Block } from '@core/Block'

export interface IRoutableBlock {
  element(): HTMLElement
  destroy(): void
}

export type RoutableBlock<Props extends object = object> = Block<Props> &
  IRoutableBlock

export type BlockClass<Props extends object = object> =
  | (new () => RoutableBlock<Props>)
  | (new (props: Props) => RoutableBlock<Props>)
  | (new (props?: Props) => RoutableBlock<Props>)

export type TBlockConstructor = new (
  props?: object
) => RoutableBlock

export type TRouteProps = {
  rootQuery: string
  blockProps?: object
}
