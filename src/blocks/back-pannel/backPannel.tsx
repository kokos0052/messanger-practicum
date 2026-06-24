import { h, Block } from '@core/index'
import { goToLink } from '@shared/utils'

export class BackPannelBlock extends Block<{}> {
  render() {
    return (
      <div class="back-pannel">
        <button
          class="back-pannel-button"
          onClick={() => goToLink('/messenger')}
        ></button>
      </div>
    )
  }
}

export function BackPannel() {
  return new BackPannelBlock().element()
}
