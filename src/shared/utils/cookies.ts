export function deleteCookie(name: string) {
  const expires = 'Thu, 01 Jan 1970 00:00:00 GMT'

  document.cookie = `${name}=; expires=${expires}; path=/`
  document.cookie = `${name}=; expires=${expires}; path=/; domain=.ya-praktikum.tech`
  document.cookie = `${name}=; expires=${expires}; path=/; domain=ya-praktikum.tech`
}

export function deleteAuthCookies() {
  deleteCookie('authCookie')
  deleteCookie('uuid')
}
