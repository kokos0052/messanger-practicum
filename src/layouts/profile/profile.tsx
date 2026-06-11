import { h, Block } from '../../core/index'
import { BackPannel, Modal, ProfileContent } from '../../blocks'
import { TProfileProps } from './types'
import { infoModal } from '../../mocks/infoModal'

export class ProfileBlock extends Block<TProfileProps, { showModal: boolean }> {
  constructor(props: TProfileProps) {
    super(props)
    this.state = { showModal: false }
  }
  render() {
    return (
      <main class="profile-container">
        <BackPannel />
        <ProfileContent
          profileType={this.props.profileType}
          onChangeAvatar={() =>
            this.setState({ showModal: !this.state.showModal })
          }
        />
        {this.state.showModal && (
          <Modal
            {...infoModal}
            onClose={() => this.setState({ showModal: false })}
          />
        )}
      </main>
    )
  }
}
