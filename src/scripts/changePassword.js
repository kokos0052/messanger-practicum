import { ProfileBlock } from '../layouts/profile/profile'

const profilePage = new ProfileBlock({
  profileType: 'password',
})

document.body.appendChild(profilePage.element())
