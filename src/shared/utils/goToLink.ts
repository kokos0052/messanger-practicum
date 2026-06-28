import { Router } from '@shared/routing'

export function goToLink(link: string) {
  Router.getInstance()?.go(link)
}
