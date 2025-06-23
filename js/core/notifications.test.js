// js/core/notifications.test.js

/**
 * @jest-environment jsdom
 */

let initNotifications, notify

beforeAll(() => {
  // 1) Create the minimal DOM that notifications.js expects
  document.body.innerHTML = `
    <div id="notification-modal" class="hidden">
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <div id="notification-text"></div>
        <button id="notification-ok">OK</button>
      </div>
    </div>
  `

  // 2) Now that the DOM exists, require notifications.js in isolation
  jest.isolateModules(() => {
    const mod = require('./notifications.js')
    initNotifications = mod.initNotifications
    notify = mod.notify
  })
})

describe('notifications.js', () => {
  // Fake timers so we can fast-forward the 4 s auto-hide
  beforeEach(() => {
    jest.useFakeTimers()
    initNotifications()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    // Cleanup so next test starts fresh
    document.getElementById('notification-modal').classList.add('hidden')
    document.getElementById('notification-ok').classList.remove('hidden')
    // Clear any queued messages (internal queue in notifications.js)
    // (Since queue is a module‐private array, easiest is to reload notifications.js fresh if needed)
  })

  test('notify() should show modal and display text with OK button', () => {
    const modal = document.getElementById('notification-modal')
    const textEl = document.getElementById('notification-text')
    const okBtn = document.getElementById('notification-ok')

    // Initially hidden
    expect(modal.classList.contains('hidden')).toBe(true)
    expect(okBtn.classList.contains('hidden')).toBe(false)

    // Enqueue a message (default hideOkButton = false)
    notify('Hello, World!')

    // Immediately after notify(), modal should be shown
    expect(modal.classList.contains('hidden')).toBe(false)
    expect(textEl.innerHTML).toBe('Hello, World!')
    // OK button remains visible
    expect(okBtn.classList.contains('hidden')).toBe(false)

    // Fast-forward 4 seconds → auto-hide
    jest.advanceTimersByTime(4000)
    expect(modal.classList.contains('hidden')).toBe(true)
  })

  test('notify(..., { hideOkButton: true }) should hide OK button', () => {
    const modal = document.getElementById('notification-modal')
    const textEl = document.getElementById('notification-text')
    const okBtn = document.getElementById('notification-ok')

    // Enqueue a message that hides the OK button
    notify('No OK here', { hideOkButton: true })

    // Modal should be visible immediately
    expect(modal.classList.contains('hidden')).toBe(false)
    expect(textEl.innerHTML).toBe('No OK here')
    // OK button must now be hidden
    expect(okBtn.classList.contains('hidden')).toBe(true)

    // After 4 s, auto-hide again
    jest.advanceTimersByTime(4000)
    expect(modal.classList.contains('hidden')).toBe(true)

    // Reset OK button for next test
    okBtn.classList.remove('hidden')
  })

  test('backdrop click hides the notification immediately', () => {
    const modal = document.getElementById('notification-modal')
    const backdrop = modal.querySelector('.modal-backdrop')

    notify('Click backdrop to hide')
    // Modal should be visible
    expect(modal.classList.contains('hidden')).toBe(false)

    // Simulate clicking the backdrop
    backdrop.click()
    expect(modal.classList.contains('hidden')).toBe(true)
  })

  test('OK-button click hides the notification immediately', () => {
    const modal = document.getElementById('notification-modal')
    const okBtn = document.getElementById('notification-ok')

    notify('Click OK to hide')
    expect(modal.classList.contains('hidden')).toBe(false)

    // Simulate user clicking OK
    okBtn.click()
    expect(modal.classList.contains('hidden')).toBe(true)
  })
})
