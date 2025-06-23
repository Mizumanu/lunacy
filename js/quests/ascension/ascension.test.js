/**
 * @jest-environment jsdom
 */
document.body.innerHTML = `
  <div id="notification-modal"><div class="modal-backdrop"></div></div>
  <div id="notification-text"></div>
  <button id="notification-ok"></button>
`

jest.mock('../../core/notifications', () => ({
  notify: jest.fn(),
  initNotifications: jest.fn(),
}))

jest.mock('../../core/data.js', () => ({
  rankCaps: [10, 30, 60, 100, 150, 210],
  rankLetters: ['E', 'D', 'C', 'B', 'A', 'S'],
  playerRankLetters: ['E', 'D', 'C', 'B', 'A', 'S'],
  playerRankRewards: [1, 2, 3, 4, 5, 6],
  xpMultipliers: { E: 1, D: 2, C: 3, B: 4, A: 5, S: 6 },
}))

import {
  state,
  startAscension,
  updateAscensionProgress,
  completeAscension,
} from '../../core/functions/state.js'
import { MAIN_SKILLS } from '../../ui/text.js'

jest.mock('../../ui/inventory.js', () => ({
  useItem: jest.fn((name) => {
    const { state } = require('../../core/functions/state.js')
    const item = state.inventory.find((i) => i.name === name)
    if (item) item.quantity = Math.max(0, item.quantity - 1)
  }),
}))

describe('Ascension Quest Logic (triggered by Main SSP average)', () => {
  beforeEach(() => {
    state.ascensionQuestIndex = null
    state.ascensionProgress = {}
    state.ascensionDeadline = null
    state.ascensionDone = false
    state.inventory = [{ name: 'Ascension Key (E)', quantity: 1 }]
    MAIN_SKILLS.forEach((s) => {
      state.skills[s] = 9
    })
    state.xpMultipliers = {}
  })

  test('startAscension consumes a key and sets quest index', () => {
    startAscension(0, 'Ascension Key (E)')
    expect(state.ascensionQuestIndex).toBe(0)
    expect(state.inventory.find((i) => i.name === 'Ascension Key (E)').quantity).toBe(0)
    expect(state.ascensionProgress[0]).toEqual(-1)
  })

  test('updateAscensionProgress marks steps only once', () => {
    state.ascensionQuestIndex = 0
    state.ascensionProgress[0] = []
    updateAscensionProgress(2)
    expect(state.ascensionProgress[0]).toEqual([2])
    updateAscensionProgress(2)
    expect(state.ascensionProgress[0]).toEqual([2])
    updateAscensionProgress(3)
    expect(state.ascensionProgress[0]).toEqual([2, 3])
  })

  test('completeAscension clears state and awards rank & sets completed flag', () => {
    state.skills.research = 15 // push average ≥ cap
    state.ascensionQuestIndex = 0
    state.ascensionProgress = { 0: [0, 1, 2, 3, 4, 5] }

    completeAscension()
    expect(state.ascensionQuestIndex).toBeNull()
    expect(state.ascensionProgress).toEqual({})
    expect(state.ascensionDeadline).toBeNull()

    // new completed flag
    expect(state.ascensionCompleted[0]).toBe(true)
    // rank point awarded for E
    expect(state.playerRank).toBe(1)
    // no XP multiplier
    expect(state.xpMultipliers.research).toBeUndefined()
  })
})
