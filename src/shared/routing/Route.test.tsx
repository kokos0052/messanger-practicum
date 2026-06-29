import { h, Block } from '@core/index'
import { Route } from './Route'

class TestBlock extends Block<{ label?: string }> {
  render() {
    return <div class="route-test-block">{this.props.label ?? 'default'}</div>
  }
}

describe('Route', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
  })

  it('Совпадение exact pathname', () => {
    const route = new Route('/messenger', TestBlock, { rootQuery: '#app' })

    expect(route.match('/messenger')).toBe(true)
    expect(route.match('/settings')).toBe(false)
  })

  it('Отображение block в root element', () => {
    const route = new Route('/test', TestBlock, {
      rootQuery: '#app',
      blockProps: { label: 'hello' },
    })

    route.render()

    const root = document.querySelector('#app')

    expect(root?.querySelector('.route-test-block')?.textContent).toBe('hello')
  })

  it('Уничтожение block при leave', () => {
    const route = new Route('/test', TestBlock, { rootQuery: '#app' })

    route.render()
    route.leave()

    expect(document.querySelector('#app')?.children.length).toBe(0)
  })

  it('Повторное использование экземпляра block при повторном render', () => {
    const route = new Route('/test', TestBlock, { rootQuery: '#app' })

    route.render()
    const firstNode = document.querySelector('.route-test-block')

    route.render()
    const secondNode = document.querySelector('.route-test-block')

    expect(firstNode).toBe(secondNode)
  })
})
