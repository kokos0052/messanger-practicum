import { BaseAPI, HTTPTransport } from './core'

const userApiInstance = new HTTPTransport(
  'https://ya-praktikum.tech/api/v2/user'
)

class UserApi extends BaseAPI {
  unpdateProfile(data: Record<string, unknown>) {
    return userApiInstance.put('/profile', { data })
  }

  updateAvatar(data: FormData | Record<string, unknown>) {
    return userApiInstance.put('/profile/avatar', { data })
  }

  changePassword(data: Record<string, unknown>) {
    return userApiInstance.put('/password', { data })
  }

  searchUser(login: string) {
    return userApiInstance.post('/search', {
      data: { login },
    })
  }
}

export default new UserApi()
