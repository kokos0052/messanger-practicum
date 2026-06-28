import { h, Block } from '@core/index'
import { Button } from '@blocks/index'
import { TErrorProps } from './types'
import { goToLink } from '@shared/utils'

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
              onClick={() => goToLink('/messenger')}
            />
          </div>
        </div>
      </main>
    )
  }
}
