/** @jest-environment jsdom */

/* Minimal DOM so notifications.js doesn’t crash */
document.body.innerHTML = `
  <div id="notification-modal" class="hidden">
    <div class="modal-backdrop"></div>
    <div class="modal-content"></div>
  </div>
  <div id="notification-text"></div>
  <button id="notification-ok"></button>`

/* Stub core/engine.js in each test without capturing localStorage in factory directly */
describe('Inventory – useItem & persistence', () => {
  beforeEach(() => {
    jest.resetModules()
    console.log = jest.fn() // silence debug
    // now mock engine.js
    jest.doMock('../core/engine.js', () => {
      const state = { inventory: [] }
      return {
        state,
        persist: (fn) => fn,
        saveState: jest.fn(() => localStorage.setItem('inv', JSON.stringify(state))),
        loadState: jest.fn(() =>
          Object.assign(state, JSON.parse(localStorage.getItem('inv')) || {}),
        ),
      }
    })
  })

  it('decrements quantity', () => {
    const { state } = require('../core/engine.js')
    const { useItem } = require('./inventory.js')
    state.inventory = [{ name: 'Main (E) Key', quantity: 2 }]
    useItem('Main (E) Key')
    expect(state.inventory[0].quantity).toBe(1)
  })

  it('survives save/load', () => {
    const { state, saveState, loadState } = require('../core/engine.js')
    const { useItem } = require('./inventory.js')
    state.inventory = [{ name: 'Main (E) Key', quantity: 2 }]
    useItem('Main (E) Key')
    saveState()
    state.inventory = []
    loadState()
    expect(state.inventory).toEqual([{ name: 'Main (E) Key', quantity: 1 }])
  })
})
