import { METHODS } from './constaints'

export type HTTPMethod = (typeof METHODS)[keyof typeof METHODS]

export type RequestData = Record<string, unknown> | FormData | string | null

export type RequestOptions = {
  headers?: Record<string, string>
  method?: HTTPMethod
  data?: RequestData
  timeout?: number
  responseType?: XMLHttpRequestResponseType
}

export type HTTPError = {
  status?: number
  statusText?: string
  response?: string
  request: XMLHttpRequest
  reason?: string
  timeout?: number
}
