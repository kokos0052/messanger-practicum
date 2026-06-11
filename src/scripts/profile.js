import { ProfileBlock } from '../layouts/profile/profile'

const profilePage = new ProfileBlock({
  profileType: 'default',
})

document.body.appendChild(profilePage.element())
