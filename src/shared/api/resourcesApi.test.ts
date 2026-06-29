import resourcesApi from './resourcesApi'
import {
  MockXMLHttpRequest,
  installMockXhr,
} from '../../tests/helpers/mockXhr'

describe('resourcesApi', () => {
  beforeEach(() => {
    installMockXhr()
  })

  it('Загрузка resource-файла', async () => {
    const formData = new FormData()
    formData.append('resource', 'file')

    const promise = resourcesApi.uploadResource(formData)

    MockXMLHttpRequest.last!.status = 201
    MockXMLHttpRequest.last!.responseText = '"/uploads/file.png"'
    MockXMLHttpRequest.last!.onload?.()

    await expect(promise).resolves.toBe('/uploads/file.png')
    expect(MockXMLHttpRequest.last?.openedUrl).toContain('/resources/')
    expect(MockXMLHttpRequest.last?.sentBody).toBe(formData)
  })
})
