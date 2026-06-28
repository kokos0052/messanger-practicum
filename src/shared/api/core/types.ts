import { METHODS } from './constaints'

export type Method = (typeof METHODS)[keyof typeof METHODS]

export type RequestData = Record<string, unknown> | FormData | string | null

export type RequestOptions = {
  headers?: Record<string, string>
  method?: Method
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

export type HTTPMethod = <R = unknown>(
  url: string,
  options?: RequestOptions
) => Promise<R>
