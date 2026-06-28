import { h, Block } from '@core/index'
import { BackPannel, Modal, ProfileContent } from '@blocks/index'
import { infoModal } from '@mocks/infoModal'
import authApi from '@shared/api/authApi'
import userApi from '@shared/api/userApi'
import Store from '@shared/store/store'

export class ProfileBlock extends Block<{}, { showModal: boolean }> {
  constructor() {
    super()
    this.state = { showModal: false }
  }

  render() {
    return (
      <main class="profile-container">
        <BackPannel />
        <ProfileContent
          onChangeAvatar={() => this.setState({ showModal: true })}
        />
        {this.state.showModal && (
          <Modal<File>
            {...infoModal}
            onClose={() => this.setState({ showModal: false })}
            action={this.updateAvatar}
          />
        )}
      </main>
    )
  }

  private updateAvatar = async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      await userApi.updateAvatar(formData)
      const response = await authApi.getUser()
      Store.setState('user', response)
      this.setState({ showModal: false })
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error)
    }
  }
}
