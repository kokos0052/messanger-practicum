import { BASE_URL } from './constants'
import { BaseAPI, HTTPTransport } from './core'

const authApiInstance = new HTTPTransport(`${BASE_URL}/auth`)

class AuthApi extends BaseAPI {
  signup(data: Record<string, unknown>) {
    return authApiInstance.post('/signup', { data })
  }
  signin(data: Record<string, unknown>) {
    return authApiInstance.post('/signin', { data })
  }

  logout() {
    return authApiInstance.post('/logout')
  }

  getUser() {
    return authApiInstance.get('/user')
  }
}

export default new AuthApi()
