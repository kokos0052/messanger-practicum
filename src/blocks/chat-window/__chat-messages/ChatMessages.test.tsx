import { ChatMessages } from './ChatMessages'
import { mount, query } from '../../../tests/helpers/mount'

describe('ChatMessages', () => {
  it('Отображение пустого state, когда сообщений нет', () => {
    const el = mount(ChatMessages({ date: '', messages: [] }))

    expect(query(el, '.chat-window__chat-messages-empty').textContent).toBe(
      'Сообщений пока нет'
    )
  })

  it('Отображение своих и чужих сообщений', () => {
    const el = mount(
      ChatMessages({
        date: '24 июня 2026',
        messages: [
          { isOwn: true, text: 'Моё', time: '10:00', media: null },
          { isOwn: false, text: 'Чужое', time: '10:01', media: null },
        ],
      })
    )

    expect(query(el, '.chat-window__chat-messages-date').textContent).toBe(
      '24 июня 2026'
    )
    expect(el.querySelectorAll('.message-container-own').length).toBe(1)
    expect(
      el.querySelectorAll('.chat-window__chat-messages-other-message').length
    ).toBe(1)
  })

  it('Отображение изображений и файловых вложений', () => {
    const el = mount(
      ChatMessages({
        date: '',
        messages: [
          {
            isOwn: true,
            text: '',
            time: '10:00',
            media: {
              url: 'https://example.com/image.png',
              type: 'image',
              name: 'image.png',
            },
          },
          {
            isOwn: false,
            text: '',
            time: '10:01',
            media: {
              url: 'https://example.com/report.pdf',
              type: 'file',
              name: 'report.pdf',
            },
          },
        ],
      })
    )

    expect(query<HTMLImageElement>(el, '.chat-window__chat-messages-media--image').src).toContain(
      'image.png'
    )
    expect(query<HTMLAnchorElement>(el, '.chat-window__chat-messages-file-link').textContent).toBe(
      'report.pdf'
    )
  })

  it('Отображение видеовложения', () => {
    const el = mount(
      ChatMessages({
        date: '',
        messages: [
          {
            isOwn: true,
            text: '',
            time: '10:00',
            media: {
              url: 'https://example.com/clip.mp4',
              type: 'video',
              name: 'clip.mp4',
            },
          },
        ],
      })
    )

    expect(
      query<HTMLVideoElement>(el, '.chat-window__chat-messages-media--video').src
    ).toContain('clip.mp4')
  })

  it('Подписи вложений по умолчанию, когда name отсутствует', () => {
    const el = mount(
      ChatMessages({
        date: '',
        messages: [
          {
            isOwn: true,
            text: '',
            time: '10:00',
            media: {
              url: 'https://example.com/image.png',
              type: 'image',
            },
          },
          {
            isOwn: false,
            text: '',
            time: '10:01',
            media: {
              url: 'https://example.com/report.pdf',
              type: 'file',
            },
          },
        ],
      })
    )

    expect(query<HTMLImageElement>(el, '.chat-window__chat-messages-media--image').alt).toBe(
      'Изображение'
    )
    expect(query<HTMLAnchorElement>(el, '.chat-window__chat-messages-file-link').textContent).toBe(
      'Скачать файл'
    )
  })
})
