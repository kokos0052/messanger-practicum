import { ProfileBlock } from '../layouts/profile/profile'

const profilePage = new ProfileBlock({
  profileType: 'changeInfo',
})

document.body.appendChild(profilePage.element())
