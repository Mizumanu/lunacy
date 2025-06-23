// js/core/functions/xp.test.js
let updateXP

beforeAll(() => {
  document.body.innerHTML = `
      <div id="notification-modal">
        <div class="modal-content"></div>
        <div class="modal-backdrop"></div>
      </div>
      <div id="notification-text"></div>
      <button id="notification-ok"></button>
    `
  // now that the DOM exists, require xp.js
  ;({ updateXP } = require('./xp.js'))
})

describe('updateXP()', () => {
  it('should return level 1 when gainedXP is 0', () => {
    const { level, xp, nextXp } = updateXP(0)
    expect(level).toBe(1)
    expect(xp).toBe(0)
    expect(nextXp).toBeGreaterThan(0)
  })

  it('should roll over to level 2 when enough XP is gained', () => {
    const threshold = 100 // or read from your levelUpXP table
    const result = updateXP(threshold + 10)
    expect(result.level).toBe(2)
    expect(result.xp).toBe(10)
  })
})
