type TMedia = {
  url: string
}

type TMessage = {
  isOwn: boolean
  text: string
  time: string
  media: TMedia | null
}

export type TChatMessagesProps = {
  date: string
  messages: TMessage[]
}
