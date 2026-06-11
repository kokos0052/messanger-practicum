declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: {
      [attrName: string]: any
    }
  }
  interface Element extends HTMLElement {}
  interface ElementChildrenAttribute {
    children: {}
  }
  interface IntrinsicAttributes {
    key?: any
  }
}

type FC<P = {}> = (props: P & { children?: any }) => JSX.Element
