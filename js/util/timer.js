// js/util/timer.js

let ascensionTimerInterval = null

export function clearAscensionTimer() {
  if (ascensionTimerInterval) {
    clearInterval(ascensionTimerInterval)
    ascensionTimerInterval = null
  }
}

/**
 * Starts a timer for ascension quests, calling `callback(msRemaining)` every second.
 * Returns the interval id if you need it (optional).
 */
export function startAscensionTimer(deadline, callback) {
  clearAscensionTimer()
  function tick() {
    const ms = Math.max(0, deadline - Date.now())
    callback(ms)
    if (ms <= 0) clearAscensionTimer()
  }
  tick() // initial call so timer shows immediately
  ascensionTimerInterval = setInterval(tick, 1000)
  return ascensionTimerInterval
}
