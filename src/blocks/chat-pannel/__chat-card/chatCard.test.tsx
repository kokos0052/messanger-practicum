import { ChatCard } from './chatCard'
import { mount, query } from '../../../tests/helpers/mount'

describe('ChatCard', () => {
  const baseProps = {
    id: 1,
    title: 'Тестовый чат',
    unread_count: 0,
    created_by: 1,
    onClick: jest.fn(),
  }

  it('Отображение названия чата', () => {
    const el = mount(ChatCard({ ...baseProps }))

    expect(query(el, '.chat-pannel__chat-card__chat-info-title').textContent).toBe(
      'Тестовый чат'
    )
  })

  it('Применение active-класса', () => {
    const el = mount(ChatCard({ ...baseProps, isActive: true }))

    expect(el.className).toContain('chat-pannel__chat-card-container_active')
  })

  it('Отображение badge непрочитанных', () => {
    const el = mount(ChatCard({ ...baseProps, unread_count: 3 }))

    expect(query(el, '.chat-pannel__chat-card-unread-count').textContent).toBe(
      '3'
    )
  })

  it('Отображение avatar, когда он передан', () => {
    const el = mount(ChatCard({ ...baseProps, avatar: '/avatars/chat.png' }))

    const img = query<HTMLImageElement>(
      el,
      '.chat-pannel__chat-card__avatar-image'
    )

    expect(img.src).toContain('/avatars/chat.png')
  })

  it('Вызов onClick при клике на карточку', () => {
    const onClick = jest.fn()
    const el = mount(ChatCard({ ...baseProps, onClick }))

    el.click()

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('Отображение последнего сообщения и форматированной даты', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-06-24T15:00:00'))

    const el = mount(
      ChatCard({
        ...baseProps,
        last_message: {
          id: 1,
          content: 'Привет!',
          time: '2026-06-24T10:30:00',
        },
      })
    )

    expect(el.textContent).toContain('Привет!')
    expect(el.textContent).toMatch(/\d{2}:\d{2}/)

    jest.useRealTimers()
  })
})
