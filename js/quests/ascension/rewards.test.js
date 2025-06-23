/** @jest-environment jsdom */

// --- Minimal DOM scaffold for notifications.js ---
document.body.innerHTML = `
  <div id="notification-modal"><div class="modal-backdrop"></div></div>
  <div id="notification-text"></div><button id="notification-ok"></button>`

// Stub notifications – we don't test their behaviour here
jest.mock('../../core/notifications', () => ({
  notify: jest.fn(),
  initNotifications: jest.fn(),
}))

import { state, completeAscension } from '../../core/functions/state.js'

import { ascensionQuests } from '../../quests/ascension/index.js'
import { playerRankLetters, playerRankRewards } from '../../core/data.js'

describe('Ascension rank-point rewards', () => {
  beforeEach(() => {
    state.playerRank = 0
    state.ascensionProgress = {}
    state.ascensionQuestIndex = null
    state.ascensionCompleted = {}
  })

  for (const rank of playerRankLetters) {
    const idx = ascensionQuests.findIndex((q) => q.rank === rank)

    // If the project doesn’t yet contain an ascension quest of this rank,
    // simply skip the expectation.
    if (idx === -1) continue

    test(`${rank} quest awards ${
      playerRankRewards[playerRankLetters.indexOf(rank)]
    } point(s)`, () => {
      state.ascensionQuestIndex = idx
      state.ascensionProgress[idx] = Array(ascensionQuests[idx].trials.length).fill(0)
      completeAscension()

      expect(state.playerRank).toBe(playerRankRewards[playerRankLetters.indexOf(rank)])
    })
  }
})
