import { METHODS } from './constaints'
import { HTTPError, RequestOptions } from './types'
import { queryStringify } from './utils'

export class HTTPTransport {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  private resolveUrl(url: string): string {
    if (!this.baseUrl) return url
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    const base = this.baseUrl.endsWith('/')
      ? this.baseUrl.slice(0, -1)
      : this.baseUrl
    const path = url.startsWith('/') ? url : `/${url}`
    return `${base}${path}`
  }

  get = <T = any>(url: string, options: RequestOptions = {}): Promise<T> => {
    return this.request<T>(
      url,
      { ...options, method: METHODS.GET },
      options.timeout
    )
  }

  post = <T = any>(url: string, options: RequestOptions = {}): Promise<T> => {
    return this.request<T>(
      url,
      { ...options, method: METHODS.POST },
      options.timeout
    )
  }

  put = <T = any>(url: string, options: RequestOptions = {}): Promise<T> => {
    return this.request<T>(
      url,
      { ...options, method: METHODS.PUT },
      options.timeout
    )
  }

  delete = <T = any>(url: string, options: RequestOptions = {}): Promise<T> => {
    return this.request<T>(
      url,
      { ...options, method: METHODS.DELETE },
      options.timeout
    )
  }

  request = <T = any>(
    url: string,
    options: RequestOptions = {},
    timeout: number = 5000
  ): Promise<T> => {
    const fullUrl = this.resolveUrl(url)
    const { headers = {}, method, data, responseType } = options

    return new Promise<T>((resolve, reject) => {
      if (!method) {
        reject(new Error('HTTP method is required') as never)
        return
      }

      const xhr = new XMLHttpRequest()
      const isGet = method === METHODS.GET

      xhr.open(
        method,
        isGet && data
          ? `${fullUrl}${queryStringify(data as Record<string, unknown>)}`
          : fullUrl
      )

      if (responseType) {
        xhr.responseType = responseType
      }

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key])
      })

      xhr.withCredentials = true

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          let response: T

          if (xhr.responseType) {
            response = xhr.response as T
          } else {
            try {
              const contentType = xhr.getResponseHeader('Content-Type')
              if (contentType && contentType.includes('application/json')) {
                response = JSON.parse(xhr.responseText) as T
              } else {
                response = xhr.responseText as unknown as T
              }
            } catch (e) {
              response = xhr.responseText as unknown as T
            }
          }

          resolve(response)
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.responseText,
            request: xhr,
          } as HTTPError)
        }
      }

      xhr.onabort = () =>
        reject({
          reason: 'Request aborted',
          request: xhr,
        } as HTTPError)

      xhr.onerror = () =>
        reject({
          reason: 'Network error',
          request: xhr,
        } as HTTPError)

      xhr.timeout = timeout

      xhr.ontimeout = () =>
        reject({
          reason: 'Request timeout',
          timeout: timeout,
          request: xhr,
        } as HTTPError)

      if (isGet || !data) {
        xhr.send()
      } else if (data instanceof FormData) {
        xhr.send(data)
      } else if (typeof data === 'object') {
        if (!headers['Content-Type']) {
          xhr.setRequestHeader('Content-Type', 'application/json')
        }
        xhr.send(JSON.stringify(data))
      } else {
        xhr.send(data)
      }
    })
  }
}
