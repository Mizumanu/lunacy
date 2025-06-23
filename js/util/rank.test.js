/** @jest-environment node */
import { getPlayerRankLetter } from './rank.js'
import { playerRankCaps } from '../core/data.js'

describe('rank helper utils', () => {
  test('letter mapping at boundaries', () => {
    expect(getPlayerRankLetter(0)).toBe('E')
    expect(getPlayerRankLetter(playerRankCaps[0])).toBe('D')
    expect(getPlayerRankLetter(playerRankCaps[0] + 1)).toBe('D')
    expect(getPlayerRankLetter(playerRankCaps[1])).toBe('C')
  })

  // if you later implement getRankProgressForUI(), add its test here
})
