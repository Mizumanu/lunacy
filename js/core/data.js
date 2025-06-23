// js/core/data.js
export const levelUpXP = [
  0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400,

  1500, 1620, 1780, 1980, 2220, 2500, 2820, 3180, 3580, 4020, 4500, 5020, 5580, 6180,

  6820, 7500, 8220, 8980, 9780, 10620, 11500, 12420, 13380, 14380, 15420, 16500,

  17620, 18780, 19980, 21220, 22500, 23820, 25180, 26580, 28020, 29500, 31020, 32580,

  34180, 35820, 37500, 39220, 40980, 42780, 44620, 46500, 48420, 50380, 52380, 54420,

  56500, 58620, 60780, 62980, 65220, 67500, 69820, 72180, 74580, 77020, 79500, 82020,

  84580, 87180, 89820, 92500, 95220, 97980, 100780, 103620, 106500, 109420, 112380,

  115380, 118420, 121500, 124620, 127780, 130980, 134220, 137500, 140820, 144180,

  147580, 151020,
]

import { mainQuests } from '../quests/main/index.js'
import { sideQuests } from '../quests/side/index.js'
import { dailyQuests } from '../quests/daily/index.js'
import { ascensionQuests } from '../quests/ascension/index.js'
// import { urgentQuests } from '../quests/urgent/index.js';

export const quests = [
  ...mainQuests,
  ...Object.values(sideQuests).flat(),
  ...dailyQuests,
  // ...urgentQuests,
  ...ascensionQuests,
]

export const rankCaps = [10, 30, 80, 330, 1670, 10000]
export const rankLetters = ['E', 'D', 'C', 'B', 'A', 'S']

// For Ascension: how each rank multiplies XP
export const xpMultipliers = {
  E: 1,
  D: 2,
  C: 6,
  B: 24,
  A: 120,
  S: 720,
}

// Player rank caps for E, D, C, B, A, S (inclusive upper bounds)
export const playerRankCaps = [3, 10, 24, 42, 66, 84] // E, D, C, B, A, S

// How many points awarded for each ascension rank
export const playerRankRewards = [1, 2, 3, 4, 5, 6] // +1 for E, +2 for D, ...

// Handy alias
export const rankOrder = rankLetters
export const playerRankLetters = rankLetters
