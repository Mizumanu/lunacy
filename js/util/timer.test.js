/** @jest-environment node */

import { startAscensionTimer, clearAscensionTimer } from './timer.js'

describe('util/timer – startAscensionTimer & clearAscensionTimer', () => {
  // use modern fake timers so Date.now() advances automatically
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  test('immediate call, 1-second ticks, auto-stop at 0 ms', () => {
    const cb = jest.fn()
    const deadline = Date.now() + 3_000 // 3 s from “now”

    startAscensionTimer(deadline, cb)

    // 1) immediate invocation
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenLastCalledWith(3_000)

    // 2) after 1 s tick → 2 s remaining
    jest.advanceTimersByTime(1_000)
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenLastCalledWith(2_000)

    // 3) advance another 1 s → 1 s remaining
    jest.advanceTimersByTime(1_000)
    expect(cb).toHaveBeenCalledTimes(3)
    expect(cb).toHaveBeenLastCalledWith(1_000)

    // 4) final tick at 0 ms (auto-clears)
    jest.advanceTimersByTime(1_000)
    expect(cb).toHaveBeenCalledTimes(4)
    expect(cb).toHaveBeenLastCalledWith(0)

    // 5) one more second → no extra calls
    jest.advanceTimersByTime(1_000)
    expect(cb).toHaveBeenCalledTimes(4)
  })

  test('clearAscensionTimer stops further ticks', () => {
    const cb = jest.fn()
    const deadline = Date.now() + 5_000 // 5 s

    startAscensionTimer(deadline, cb)

    // let one tick happen
    jest.advanceTimersByTime(1_000)
    expect(cb).toHaveBeenCalledTimes(2)

    // now clear and ensure no more callbacks
    clearAscensionTimer()
    jest.advanceTimersByTime(5_000)
    expect(cb).toHaveBeenCalledTimes(2)
  })
})
