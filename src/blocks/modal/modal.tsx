import { h, Block } from '../../core/index'
import { Button } from '../button'
import { Field } from '../field'
import { TModalProps } from './types'

export class ModalBlock extends Block<TModalProps> {
  render() {
    return (
      <div class="modal-overlay">
        <div class="modal-window">
          <h4 class="modal-title">{this.props.modalTitle}</h4>
          {this.props.link && (
            <a href="#" class="modal-link">
              {this.props.link}
            </a>
          )}
          {this.props.modalFields &&
            this.props.modalFields.map(({ fieldId, fieldLabel }) => (
              <Field
                type="text"
                name={fieldId}
                id={fieldId}
                label={fieldLabel}
              />
            ))}
          <Button
            variant="primary"
            label={this.props.buttonText}
            onClick={this.props.onClose}
          />
        </div>
      </div>
    )
  }
}

export function Modal(props: TModalProps) {
  return new ModalBlock(props).element()
}
