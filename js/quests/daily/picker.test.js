// js/quests/daily/picker.test.js

/**
 * @jest-environment jsdom
 */
jest.useFakeTimers()
jest.mock('../../core/functions/state.js', () => ({
  persist: (fn) => fn,
  state: { completedDaily: [], activeDaily: null },
  // anything else picker.js calls:
  loadState: jest.fn(),
  saveState: jest.fn(),
}))
document.body.innerHTML = `
<div id="notification-modal"><div class="modal-backdrop"></div></div>
<div id="notification-text"></div><button id="notification-ok"></button>`
const { state } = require('../../core/functions/state.js')
const { pickTodaysDaily } = require('./picker')
const dailyQuests = [
  { id: 1, group: 'A' },
  { id: 2, group: 'A' },
  { id: 3, group: 'B' },
  { id: 4, group: 'C' },
  { id: 5, group: 'D' },
]
jest.mock('./index.js', () => ({ dailyQuests }))

describe('pickTodaysDaily', () => {
  beforeEach(() => {
    state.lastDailyPick = null
    state.todayDaily = null
  })

  test('returns 4 unique quests on first call', () => {
    const today = pickTodaysDaily()
    expect(today).toHaveLength(4)
    const groups = today.map((q) => q.group)
    expect(new Set(groups).size).toBe(4)
    expect(state.todayDaily).toEqual(today)
    expect(typeof state.lastDailyPick).toBe('string')
  })

  test('returns same array if called again before 4am crosses', () => {
    // seed a pick
    const first = pickTodaysDaily()
    state.lastDailyPick = new Date().toISOString()
    const second = pickTodaysDaily()
    expect(second).toBe(first)
  })
})
