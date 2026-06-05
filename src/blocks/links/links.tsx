import { h, Block, Fragment } from '../../core/index'
import { TLinksProps } from './types'

export class LinksBlock extends Block<TLinksProps> {
  render() {
    return (
      <>
        {this.props.links.map(({ link, name }) => (
          <li>
            <a href={link} class="navigation-link">
              {name}
            </a>
          </li>
        ))}
      </>
    )
  }
}

export function Links(props: TLinksProps) {
  return new LinksBlock(props).element()
}
