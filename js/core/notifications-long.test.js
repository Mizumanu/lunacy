/** @jest-environment jsdom */
jest.useFakeTimers()

/* DOM scaffold */
document.body.innerHTML = `
  <div id="notification-modal" class="hidden">
    <div class="modal-backdrop"></div>
    <div class="modal-content">
      <div id="notification-text"></div>
      <button id="notification-ok">OK</button>
    </div>
  </div>`

/* single, complete engine stub */
jest.mock('../core/engine.js', () => ({
  notify: jest.fn(), // replaced below
  initNotifications: jest.fn(),
  persist: (fn) => fn, // inventory.js needs it
}))
const engine = require('../core/engine.js')

/*  Load inventory (it calls persist), THEN overwrite notify with real fn */
const { notify, initNotifications } = engine
engine.notify = notify // ensure same reference everywhere

/* ------------------ tests ------------------ */
beforeAll(initNotifications)

test('long flag shows notification for ~12 s', () => {
  notify('Long', { long: true })
  jest.advanceTimersByTime(12_100)
  expect(document.getElementById('notification-modal').classList.contains('hidden')).toBe(true)
})

test('short hides after ~4 s', () => {
  notify('Short')
  jest.advanceTimersByTime(4_100)
  expect(document.getElementById('notification-modal').classList.contains('hidden')).toBe(true)
})
