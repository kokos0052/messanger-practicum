export type HEventHandler = (event: Event) => void

export type HPropValue =
  | string
  | number
  | boolean
  | HEventHandler
  | Record<string, string>
  | null
  | undefined

export type HProps = Record<string, HPropValue>

export type HChild =
  | string
  | number
  | Node
  | HChild[]
  | null
  | undefined
  | false

export type HComponentProps = {
  children?: HChild | HChild[]
  [key: string]: HPropValue | HChild | HChild[] | undefined
}

export type HComponent = (props: HComponentProps) => HTMLElement | DocumentFragment

export type HElementType = string | HComponent

export function flattenHChildren(children: HChild[]): (string | number | Node)[] {
  const result: (string | number | Node)[] = []

  const walk = (items: HChild[]) => {
    for (const item of items) {
      if (item === null || item === undefined || item === false) continue

      if (Array.isArray(item)) {
        walk(item)
        continue
      }

      result.push(item)
    }
  }

  walk(children)
  return result
}

export type IntrinsicElementProps = {
  children?: HChild | HChild[]
} & Record<string, HPropValue | HChild | HChild[] | undefined>
