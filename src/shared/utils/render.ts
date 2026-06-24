export function render(
  query: string,
  block: { getContent(): string | Node }
): HTMLElement | null {
  const root = document.querySelector<HTMLElement>(query)
  if (!root) return null
  const content = block.getContent()
  if (typeof content === 'string') {
    root.textContent = content
  } else {
    root.innerHTML = ''
    root.appendChild(content)
  }
  return root
}
