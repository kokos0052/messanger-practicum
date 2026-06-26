import { h, Block, Fragment } from '@core/index'
import { Button, Field } from '@blocks/index'
import { TModalProps } from './types'
import { Store } from '@shared/store'

export class ModalBlock<TFormData = unknown> extends Block<
  TModalProps<TFormData>
> {
  private formStore = new Store()

  handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget && this.props.onClose) {
      this.props.onClose(e)
    }
  }

  getFormData() {
    return this.formStore.getState()
  }

  private handleFileInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file || !this.props.action) return

    void Promise.resolve(this.props.action(file as TFormData))
  }

  private handleFormSubmit = (e: Event) => {
    e.preventDefault()
    this.props.action?.(this.getFormData() as TFormData)
  }

  render() {
    const isFileModal = this.props.variant === 'file'

    return (
      <div class="modal-overlay" onClick={this.handleOverlayClick}>
        <div class="modal-window">
          <h4 class="modal-title">{this.props.modalTitle}</h4>
          {isFileModal ? (
            <>
              <input
                id="modal-file-input"
                class="modal-file-input"
                type="file"
                accept={this.props.accept ?? 'image/*'}
                onChange={this.handleFileInputChange}
              />
              {this.props.link && (
                <label class="modal-link" for="modal-file-input">
                  {this.props.link}
                </label>
              )}
            </>
          ) : (
            <>
              {this.props.link && (
                <a href="#" class="modal-link">
                  {this.props.link}
                </a>
              )}
              {this.props.modalFields && (
                <form class="modal-form" onSubmit={this.handleFormSubmit}>
                  {this.props.modalFields.map(({ fieldId, fieldLabel }) => (
                    <Field
                      type="text"
                      name={fieldId}
                      id={fieldId}
                      label={fieldLabel}
                      store={this.formStore}
                    />
                  ))}
                  <Button
                    type="submit"
                    variant="primary"
                    label={this.props.buttonText}
                  />
                </form>
              )}
            </>
          )}
        </div>
      </div>
    )
  }
}

export function Modal<TFormData = unknown>(
  props: TModalProps<TFormData>
): HTMLElement {
  return new ModalBlock(props).element()
}
