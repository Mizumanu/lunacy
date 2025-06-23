/** @jest-environment node */

describe('util/debug – log()/warn() gating', () => {
  const origLog = console.log
  const origWarn = console.warn

  beforeEach(() => {
    jest.resetModules()
    console.log = jest.fn()
    console.warn = jest.fn()
  })

  afterEach(() => {
    console.log = origLog
    console.warn = origWarn
  })

  test('silent when DEBUG is false (default)', () => {
    const dbg = require('./debug.js')
    dbg.log('hidden')
    dbg.warn('hidden')

    expect(console.log).not.toHaveBeenCalled()
    expect(console.warn).not.toHaveBeenCalled()
  })

  test('emits when DEBUG is true', () => {
    const dbg = require('./debug.js')
    dbg.setDebug(true)

    dbg.log('visible')
    dbg.warn('visible')

    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith('visible')
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith('visible')
  })
})
