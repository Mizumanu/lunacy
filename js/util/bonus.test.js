/** @jest-environment jsdom */

jest.useFakeTimers()

/* --- DOM scaffold for notifications.js --- */
document.body.innerHTML = `
  <div id="notification-modal" class="hidden">
    <div class="modal-backdrop"></div>
    <div class="modal-content"></div>
  </div>
  <div id="notification-text"></div>
  <button id="notification-ok"></button>`

/* --- Core-engine stub (notify + persist + clearActiveDaily) --- */
let mockClearActiveDaily
jest.mock('../core/engine.js', () => {
  mockClearActiveDaily = jest.fn()
  return {
    notify: jest.fn(), // bonus.js calls notify()
    persist: (fn) => fn, // inventory.js loads
    clearActiveDaily: mockClearActiveDaily,
  }
})

const { twoStepDailyBonus } = require('./bonus')

describe('bonus utils', () => {
  /* … existing tests unchanged … */

  test('twoStepDailyBonus clears and calls clearActiveDaily', async () => {
    const promise = twoStepDailyBonus({}, { tier: 'common', skill: 'x', xp: 1 })

    window.dispatchEvent(new Event('notify-hide')) // first popup
    await Promise.resolve() // let listener attach
    window.dispatchEvent(new Event('notify-hide')) // second popup
    jest.runOnlyPendingTimers()

    await promise
    expect(mockClearActiveDaily).toHaveBeenCalled()
  })
})
