import { BASE_URL } from './constants'
import { BaseAPI, HTTPTransport } from './core'

const resourcesApiInstance = new HTTPTransport(`${BASE_URL}/resources`)

class ResourcesApi extends BaseAPI {
  uploadResource(data: FormData) {
    return resourcesApiInstance.post('/', { data })
  }
}

export default new ResourcesApi()
