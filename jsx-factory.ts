// jsx-factory.ts
export function h(
  type: string | Function,
  props: Record<string, any> | null,
  ...children: any[]
): HTMLElement | DocumentFragment {
  if (typeof type === 'function') {
    return type({ ...props, children })
  }
  const el = document.createElement(type)
  if (props) {
    for (const [key, val] of Object.entries(props)) {
      if (key.startsWith('on') && typeof val === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), val)
      } else if (key === 'class' || key === 'className') {
        el.className = val
      } else {
        el.setAttribute(key, val)
      }
    }
  }
  for (const child of children.flat(Infinity)) {
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(String(child)))
    } else if (child instanceof Node) {
      el.appendChild(child)
    }
  }
  return el
}

export function Fragment(props: { children?: any }): DocumentFragment {
  const frag = document.createDocumentFragment()
  for (const child of (props?.children ?? []).flat(Infinity)) {
    if (typeof child === 'string' || typeof child === 'number') {
      frag.appendChild(document.createTextNode(String(child)))
    } else if (child instanceof Node) {
      frag.appendChild(child)
    }
  }
  return frag
}
