import { BaseAPI } from './BaseApi'

describe('BaseAPI', () => {
  it('Выброс ошибки для нереализованных методов', () => {
    const api = new BaseAPI()

    expect(() => api.create()).toThrow('Not implemented')
    expect(() => api.request()).toThrow('Not implemented')
    expect(() => api.update()).toThrow('Not implemented')
    expect(() => api.delete()).toThrow('Not implemented')
  })
})
