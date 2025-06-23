/** @jest-environment jsdom */
import { createElement } from './dom.js'

describe('util/dom – createElement()', () => {
  test('sets direct element properties when possible', () => {
    const btn = createElement('button', {
      id: 'ok',
      disabled: true,
      textContent: 'Click',
    })
    expect(btn.id).toBe('ok')
    expect(btn.disabled).toBe(true)
    expect(btn.textContent).toBe('Click')
  })

  test('falls back to setAttribute for unknown props', () => {
    // “data-*” prop is not on the element instance → should land in attributes
    const div = createElement('div', { 'data-test': 'abc' })
    expect(div.getAttribute('data-test')).toBe('abc')
  })

  test('appends children in order', () => {
    const span1 = document.createElement('span')
    span1.textContent = 'A'
    const span2 = document.createElement('span')
    span2.textContent = 'B'

    const p = createElement('p', {}, [span1, span2])
    expect(p.children).toHaveLength(2)
    expect(p.children[0].textContent).toBe('A')
    expect(p.children[1].textContent).toBe('B')
  })
})
