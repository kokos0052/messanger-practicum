import { h, Block } from '../../core'
import { Button } from '../../blocks/button'
import { TErrorProps } from './types'

function goToChats() {
  window.location.href = '/chat'
}

export class ErrorBlock extends Block<TErrorProps> {
  render() {
    return (
      <main class="centered-content-container">
        <div class="error-container">
          <h1 class="error-code-heading">{this.props.code}</h1>
          <h3 class="header">{this.props.message}</h3>
          <div class="button-container error-button">
            <Button
              variant="secondary"
              label="Назад к чатам"
              onClick={goToChats}
            />
          </div>
        </div>
      </main>
    )
  }
}
