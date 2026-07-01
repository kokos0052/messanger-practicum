export function mount(element: HTMLElement): HTMLElement {
  document.body.appendChild(element)
  return element
}

export function getMountedRoot(): HTMLElement {
  return document.body.firstElementChild as HTMLElement
}

export function query<T extends Element = Element>(
  root: ParentNode,
  selector: string
): T {
  const node = root.querySelector(selector)
  if (!node) {
    throw new Error(`Element not found: ${selector}`)
  }
  return node as T
}
