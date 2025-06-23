/** @jest-environment node */
import { capitalize } from './strings.js'

describe('util/strings – capitalize()', () => {
  test('capitalizes the first letter of a lowercase word', () => {
    expect(capitalize('foo')).toBe('Foo')
  })

  test('leaves an already-capitalized word unchanged', () => {
    expect(capitalize('Bar')).toBe('Bar')
  })

  test('handles single-character strings', () => {
    expect(capitalize('a')).toBe('A')
  })

  test('returns empty string when given empty string', () => {
    expect(capitalize('')).toBe('')
  })

  test('does not alter non-letter first characters', () => {
    expect(capitalize('1abc')).toBe('1abc')
    expect(capitalize('@home')).toBe('@home')
  })
})
