import { h, Block } from '../../core/index'

function goToMainPage() {
  window.location.href = '/'
}

export class BackPannelBlock extends Block<{}> {
  render() {
    return (
      <div class="back-pannel">
        <button class="back-pannel-button" onClick={goToMainPage}></button>
      </div>
    )
  }
}

export function BackPannel() {
  return new BackPannelBlock().element()
}
