// js/util/rank.js

import { playerRankCaps, playerRankLetters } from '../core/data.js'

export function getPlayerRankLetter(points) {
  if (points === null || points < 0) return playerRankLetters[0]
  for (let i = 0; i < playerRankCaps.length; i++) {
    if (points < playerRankCaps[i]) {
      return playerRankLetters[i]
    }
  }
  // If points >= last cap, return highest rank
  return playerRankLetters[playerRankLetters.length - 1]
}
