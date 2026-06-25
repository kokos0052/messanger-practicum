type EventListType = Partial<
  Record<keyof HTMLElementEventMap, (e: Event) => void>
>

export abstract class Block<
  Props extends object = {},
  State extends object = {},
> {
  protected abstract render(): HTMLElement | DocumentFragment

  protected props = {} as Props
  protected state = {} as State

  public domElement: HTMLElement | null = null
  private _isMounted = false

  protected events: EventListType = {}

  constructor(props: Props = {} as Props) {
    this.props = props
  }

  public destroy(): void {
    if (!this.domElement) return

    if (this._isMounted) {
      this.componentWillUnmount()
      this._isMounted = false
    }

    this.removeListeners()
    this.domElement.remove()
    this.domElement = null
  }

  public element(): HTMLElement {
    if (!this.domElement) {
      this._createDomElement()
    }
    return this.domElement!
  }

  private compile(): HTMLElement {
    const rendered = this.render()
    if (rendered instanceof DocumentFragment) {
      const wrapper = document.createElement('div')
      wrapper.appendChild(rendered)
      return (wrapper.firstElementChild as HTMLElement) || wrapper
    }
    return rendered as HTMLElement
  }

  private _createDomElement() {
    this.removeListeners()
    const fragment = this.compile()

    if (this.domElement && fragment) {
      const parent = this.domElement.parentNode

      if (parent) {
        parent.replaceChild(fragment, this.domElement)
      }
    }

    this.domElement = fragment
    this.attachListeners()

    if (!this._isMounted) {
      this._isMounted = true
      this.componentDidMount()
    }
  }

  protected renderComponent() {
    if (!this.domElement) return
    this._createDomElement()
  }

  protected setState(
    update:
      | Partial<State>
      | ((prevState: State, currentProps: Props) => Partial<State>)
  ): void {
    const partial =
      typeof update === 'function' ? update(this.state, this.props) : update
    Object.assign(this.state, partial)
    this.renderComponent()
  }

  public setProps(props: Partial<Props>) {
    this.props = { ...this.props, ...props } as Props
    this.renderComponent()
  }

  protected componentDidMount() {}

  protected componentWillUnmount() {}

  private attachListeners() {
    for (const eventName in this.events) {
      const key = eventName as keyof HTMLElementEventMap
      const eventCallback = this.events[key]
      if (typeof eventCallback === 'function' && this.domElement) {
        this.domElement.addEventListener(key, eventCallback)
      }
    }
  }

  private removeListeners() {
    for (const eventName in this.events) {
      const key = eventName as keyof HTMLElementEventMap
      const eventCallback = this.events[key]
      if (typeof eventCallback === 'function' && this.domElement) {
        this.domElement.removeEventListener(key, eventCallback)
      }
    }
  }
}

export type AnyBlockInstanse = InstanceType<typeof Block>
