import * as Either from './'

const toUpper = (a: string) => a.toUpperCase()

test('map', () => {
  expect(
    Either.of('foo')
      .map(toUpper)
      .isRight()
  ).toBeTruthy()
})

test('of', () => {
  expect(Either.of('foo').isRight()).toBeTruthy()
  expect(Either.of(null).isRight()).toBeTruthy()
  expect(Either.of(undefined).isRight()).toBeTruthy()
})
