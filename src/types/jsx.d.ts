import type { HChild, HPropValue, IntrinsicElementProps } from '../core/jsx/types'

export {}

declare global {
  namespace JSX {
    interface Element extends HTMLElement {}

    interface ElementChildrenAttribute {
      children: HChild
    }

    interface IntrinsicAttributes {
      key?: string | number
    }

    interface IntrinsicElements {
      [elemName: string]: IntrinsicElementProps
    }
  }
}

type FC<P extends object = Record<string, never>> = (
  props: P & { children?: HChild | HChild[] }
) => JSX.Element
