import {
  flattenHChildren,
  HChild,
  HComponent,
  HComponentProps,
  HElementType,
  HEventHandler,
  HPropValue,
  HProps,
} from './types'

function isComponent(type: HElementType): type is HComponent {
  return typeof type === 'function'
}

function isEventHandler(value: HPropValue): value is HEventHandler {
  return typeof value === 'function'
}

function setProp(el: HTMLElement, key: string, val: HPropValue): void {
  if (val === null || val === undefined) return

  if (key.startsWith('on') && isEventHandler(val)) {
    const eventName = key.slice(2).toLowerCase()
    el.addEventListener(eventName, val)
    return
  }

  if (key === 'class' || key === 'className') {
    el.className = String(val)
    return
  }

  if (typeof val === 'boolean') {
    if (val) {
      el.setAttribute(key, '')
    } else {
      el.removeAttribute(key)
    }
    return
  }

  if (key === 'style') {
    if (typeof val === 'string') {
      el.setAttribute('style', val)
    } else {
      Object.assign(el.style, val)
    }
    return
  }

  el.setAttribute(key, String(val))
}

export function h(
  type: HElementType,
  props: HProps | null,
  ...children: HChild[]
): HTMLElement | DocumentFragment {
  if (isComponent(type)) {
    return type({ ...(props ?? {}), children } as HComponentProps)
  }

  const el = document.createElement(type)

  if (props) {
    for (const [key, val] of Object.entries(props)) {
      setProp(el, key, val)
    }
  }

  for (const child of flattenHChildren(children)) {
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(String(child)))
    } else {
      el.appendChild(child)
    }
  }

  return el
}

export function Fragment(props: { children?: HChild | HChild[] }): DocumentFragment {
  const frag = document.createDocumentFragment()
  const normalizedChildren =
    props.children === undefined
      ? []
      : Array.isArray(props.children)
        ? props.children
        : [props.children]

  for (const child of flattenHChildren(normalizedChildren)) {
    if (typeof child === 'string' || typeof child === 'number') {
      frag.appendChild(document.createTextNode(String(child)))
    } else {
      frag.appendChild(child)
    }
  }

  return frag
}
