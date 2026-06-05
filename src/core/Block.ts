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

  private domElement: HTMLElement | null = null

  protected events: EventListType = {}

  constructor(props: Props = {} as Props) {
    this.props = props
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
    this.unmountComponent()
    const fragment = this.compile()
    if (this.domElement && fragment) {
      this.domElement.replaceWith(fragment)
    }
    this.domElement = fragment
    this.mountComponent()
  }

  protected renderComponent() {
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

  private mountComponent() {
    this.attachListeners()
    this.componentDidMount()
  }

  protected componentWillUnmount() {}

  private unmountComponent() {
    if (this.domElement) {
      this.componentWillUnmount()
      this.removeListeners()
    }
  }

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
