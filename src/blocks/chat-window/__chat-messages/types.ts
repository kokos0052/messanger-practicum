type TMedia = {
  url: string
  type: 'image' | 'video' | 'file'
  name?: string
}

export type TChatMessage = {
  isOwn: boolean
  text: string
  time: string
  media: TMedia | null
}

export type TChatMessagesProps = {
  date: string
  messages: TChatMessage[]
}
