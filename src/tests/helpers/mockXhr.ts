type MockXhrListener = (() => void) | null

export type MockXhrOptions = {
  status?: number
  responseText?: string
  response?: unknown
  responseType?: XMLHttpRequestResponseType
}

export class MockXMLHttpRequest {
  static instances: MockXMLHttpRequest[] = []

  open = jest.fn()
  send = jest.fn((body?: Document | XMLHttpRequestBodyInit | null) => {
    this.sentBody = body ?? null
  })
  setRequestHeader = jest.fn()
  abort = jest.fn()

  status = 200
  statusText = 'OK'
  responseText = ''
  response: unknown = ''
  responseType: XMLHttpRequestResponseType = ''
  withCredentials = false
  timeout = 0

  onload: MockXhrListener = null
  onerror: MockXhrListener = null
  onabort: MockXhrListener = null
  ontimeout: MockXhrListener = null

  getResponseHeader = jest.fn((header: string) => {
    if (header === 'Content-Type') {
      return 'application/json'
    }
    return null
  })

  sentBody: Document | XMLHttpRequestBodyInit | null = null
  openedMethod = ''
  openedUrl = ''

  constructor() {
    MockXMLHttpRequest.instances.push(this)
    this.open.mockImplementation((method: string, url: string) => {
      this.openedMethod = method
      this.openedUrl = url
    })
  }

  static reset() {
    MockXMLHttpRequest.instances = []
  }

  static get last(): MockXMLHttpRequest | undefined {
    return MockXMLHttpRequest.instances.at(-1)
  }
}

export function installMockXhr() {
  MockXMLHttpRequest.reset()
  global.XMLHttpRequest = MockXMLHttpRequest as unknown as typeof XMLHttpRequest
}

export async function flushPromises() {
  await Promise.resolve()
  await Promise.resolve()
}
