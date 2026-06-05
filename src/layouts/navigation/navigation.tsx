import { h, Block } from '../../core/index'
import { links } from '../../mocks/links'

export class NavigationBlock extends Block<{}> {
  render() {
    return (
      <nav class="centered-content-container">
        <ul class="links-list">
          {links.map(({ link, name }) => (
            <li>
              <a href={link} class="navigation-link">
                {name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }
}
