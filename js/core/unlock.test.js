// js/core/unlock.test.js
/** @jest-environment node */

import { isQuestUnlocked, getUnlockedQuests } from './unlock.js'

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const mkQuest = (over = {}) => ({
  title: 'Stub Quest',
  category: 'main',
  microSteps: ['do a thing'], // normal quest (not act-intro)
  unlock: { level: 0, date: null },
  ...over,
})

/* Fake “state” object used by getUnlockedQuests -------------------- */
const mkState = (lvl) => ({ currentLevel: lvl })

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */
describe('core/unlock – isQuestUnlocked()', () => {
  test('true when no unlock requirements', () => {
    expect(isQuestUnlocked(mkQuest({ unlock: {} }), 0)).toBe(true)
  })

  test('level requirement: below → false, equal / above → true', () => {
    const q = mkQuest({ unlock: { level: 5 } })
    expect(isQuestUnlocked(q, 4)).toBe(false)
    expect(isQuestUnlocked(q, 5)).toBe(true)
    expect(isQuestUnlocked(q, 6)).toBe(true)
  })

  test('date requirement: before date → false, after → true', () => {
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString()
    const qTomorrow = mkQuest({ unlock: { date: tomorrow } })
    expect(isQuestUnlocked(qTomorrow, 99)).toBe(false)

    const yesterday = new Date(Date.now() - 86_400_000).toISOString()
    const qYesterday = mkQuest({ unlock: { date: yesterday } })
    expect(isQuestUnlocked(qYesterday, 0)).toBe(true)
  })

  test('Act-intro (no microSteps array) always unlocked', () => {
    const actIntro = {
      title: 'Act I',
      category: 'main',
      unlock: { level: 99 } /* no microSteps */,
    }
    expect(isQuestUnlocked(actIntro, 0)).toBe(true)
  })
})

describe('core/unlock – getUnlockedQuests()', () => {
  const quests = [
    mkQuest({ title: 'Q-0', unlock: { level: 0 }, category: 'main' }),
    mkQuest({ title: 'Q-5', unlock: { level: 5 }, category: 'main' }),
    mkQuest({ title: 'Q-Side', category: 'side' }),
  ]

  test('filters by category and unlock status', () => {
    const res = getUnlockedQuests(quests, mkState(4), 'main').map((q) => q.title)
    expect(res).toEqual(['Q-0']) // level-5 quest still locked
  })

  test('includes newly unlocked quests when level rises', () => {
    const res = getUnlockedQuests(quests, mkState(5), 'main').map((q) => q.title)
    expect(res).toEqual(['Q-0', 'Q-5'])
  })
})
