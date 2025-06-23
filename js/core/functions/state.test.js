// js/core/functions/state.test.js
/** @jest-environment jsdom */
document.body.innerHTML = `
  <div id="notification-modal"><div class="modal-backdrop"></div></div>
  <div id="notification-text"></div><button id="notification-ok"></button>`
jest.mock('../notifications', () => ({
  notify: jest.fn(),
  initNotifications: jest.fn(),
}))

import { state, loadState, saveState, completeAscension } from './state.js'

describe('state persistence', () => {
  beforeEach(() => localStorage.clear())
  it('saveState writes to localStorage', () => {
    state.currentLevel = 5
    saveState()
    const raw = JSON.parse(localStorage.getItem('gameState'))
    expect(raw.currentLevel).toBe(5)
  })
  it('loadState hydrates the in-memory state', () => {
    localStorage.setItem('gameState', JSON.stringify({ currentLevel: 7 }))
    loadState()
    expect(state.currentLevel).toBe(7)
  })
})

test('ascending sets ascensionDone flag', () => {
  // Prepare the state as if the user has just finished the final trial
  state.ascensionQuestIndex = 1 // pretend at final index
  state.ascensionProgress = { 1: [0, 1, 2] }
  state.ascensionCompleted = {}

  completeAscension('main')
  expect(state.ascensionCompleted).toEqual({ 1: true })
  expect(state.ascensionQuestIndex).toBeNull()
  expect(state.ascensionProgress).toEqual({})
  expect(state.ascensionDeadline).toBeNull()
})
