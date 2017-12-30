import { identity } from './identity'

test('identity', () => {
  expect(identity('foo')).toBe('foo')
  expect(identity(undefined)).toBe(undefined)
  expect(identity(null)).toBe(null)
})
