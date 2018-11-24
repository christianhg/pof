import { compose } from '../core'
import * as Maybe from './'

function isAdmin(a: Person): a is Admin {
  return a.hasOwnProperty('password')
}

const isEven = (a: number) => a % 2 === 0

const length = (s: string) => s.length

function safeProp<A, B extends keyof A>(b: B) {
  return (a: A) => Maybe.fromNullable(a[b])
}

const toUpper = (a: string) => a.toUpperCase()

function unsafeProp<A, B extends keyof A>(b: B) {
  return (a: A) => a[b]
}

interface Admin extends Person {
  password: string
}

interface Person {
  age?: number
  name: string
}

const admin: Admin = {
  age: 42,
  name: 'Carl',
  password: '1234',
}

const persons: Person[] = [
  {
    name: 'Alice',
  },
  {
    age: 30,
    name: 'Bob',
  },
  admin,
]

test('all', () => {
  expect(Maybe.all([Maybe.of('foo'), Maybe.of('bar')]).isJust()).toBeTruthy()
  expect(Maybe.all([Maybe.of(42), Maybe.of('fizzbuzz')]).isJust()).toBeTruthy()
  expect(
    Maybe.all([Maybe.of(true), Maybe.fromNullable(undefined)]).isNothing(),
  ).toBeTruthy()
  expect(Maybe.all([Maybe.of('foo'), Maybe.of('bar')]).unsafeGet()).toEqual([
    'foo',
    'bar',
  ])
  expect(Maybe.all([Maybe.of(42), Maybe.of('fizzbuzz')]).unsafeGet()).toEqual([
    42,
    'fizzbuzz',
  ])
  expect(
    Maybe.all([
      Maybe.fromNullable(persons[0]),
      Maybe.fromNullable(persons[1]),
      Maybe.fromNullable(persons[2]),
      Maybe.fromNullable(persons[3]),
    ])
      .map(persons => persons.map(unsafeProp('name')))
      .isNothing(),
  ).toBeTruthy()
  expect(
    Maybe.all([
      Maybe.fromNullable(persons[0]),
      Maybe.fromNullable(persons[1]),
      Maybe.fromNullable(persons[2]),
    ]).fold(
      persons => persons.map(unsafeProp('name')),
      () => ['random', 'names', 'list'],
    ),
  ).toEqual(['Alice', 'Bob', 'Carl'])
})

test('chain', () => {
  expect(
    Maybe.fromNullable(persons[0])
      .chain(safeProp('age'))
      .getOrElse(42),
  ).toBe(42)

  expect(
    Maybe.fromNullable(persons[1])
      .chain(safeProp('age'))
      .getOrElse(42),
  ).toBe(30)

  expect(
    Maybe.fromNullable(persons[3])
      .chain(safeProp('age'))
      .getOrElse(42),
  ).toBe(42)
})

test('empty', () => {
  expect(Maybe.empty().isNothing()).toBeTruthy()
  expect(Maybe.empty().isJust()).toBeFalsy()
})

test('filter', () => {
  expect(
    Maybe.fromNullable(persons[2])
      .chain(safeProp('name'))
      .filter(
        compose(
          isEven,
          length,
        ),
      )
      .getOrElse('A man has no even length name'),
  ).toBe('Carl')

  expect(
    Maybe.fromNullable(persons[0])
      .chain(safeProp('name'))
      .filter(
        compose(
          isEven,
          length,
        ),
      )
      .getOrElse('A girl has no even length name'),
  ).toBe('A girl has no even length name')

  expect(
    Maybe.fromNullable(persons[3])
      .chain(safeProp('name'))
      .filter(
        compose(
          isEven,
          length,
        ),
      )
      .getOrElse('A person does not exist'),
  ).toBe('A person does not exist')

  expect(
    Maybe.fromNullable(persons[2])
      .filter(isAdmin)
      .fold(unsafeProp('password'), () => 'A person is not an admin'),
  ).toBe('1234')

  expect(
    Maybe.fromNullable(persons[1])
      .filter(isAdmin)
      .fold(unsafeProp('password'), () => 'A person is not an admin'),
  ).toBe('A person is not an admin')

  expect(
    Maybe.fromNullable(persons[3])
      .filter(isAdmin)
      .fold(unsafeProp('password'), () => 'A person does not exist'),
  ).toBe('A person does not exist')
})

test('fold', () => {
  expect(
    Maybe.fromNullable(persons[0]).fold(
      unsafeProp('name'),
      () => 'A girl has no name',
    ),
  ).toBe('Alice')

  expect(
    Maybe.fromNullable(persons[3]).fold(
      unsafeProp('name'),
      () => 'A person does not exist',
    ),
  ).toBe('A person does not exist')
})

test('fromNullable', () => {
  expect(Maybe.fromNullable(undefined).isJust()).toBeFalsy()
  expect(Maybe.fromNullable(undefined).isNothing()).toBeTruthy()

  expect(Maybe.fromNullable(null).isJust()).toBeFalsy()
  expect(Maybe.fromNullable(null).isNothing()).toBeTruthy()

  expect(Maybe.fromNullable('foo').isJust()).toBeTruthy()
  expect(Maybe.fromNullable('foo').isNothing()).toBeFalsy()
})

test('map', () => {
  expect(
    Maybe.fromNullable(persons[0])
      .chain(safeProp('name'))
      .map(toUpper)
      .getOrElse('A girl has no name'),
  ).toBe('ALICE')

  expect(
    Maybe.fromNullable(persons[3])
      .chain(safeProp('name'))
      .map(toUpper)
      .getOrElse('A person does not exist'),
  ).toBe('A person does not exist')
})

test('of', () => {
  expect(Maybe.of('foo').isJust()).toBeTruthy()
  expect(Maybe.of(null).isJust()).toBeTruthy()
  expect(Maybe.of(undefined).isJust()).toBeTruthy()
})

test('orElse', () => {
  expect(
    Maybe.fromNullable(persons[1])
      .filter(isAdmin)
      .orElse(Maybe.of({ name: 'Spontaneous Admin', password: 'password' }))
      .fold(unsafeProp('name'), () => 'Should not happen'),
  ).toBe('Spontaneous Admin')

  expect(
    Maybe.fromNullable(persons[2])
      .filter(isAdmin)
      .orElse(Maybe.of({ name: 'Spontaneous Admin', password: 'password' }))
      .fold(unsafeProp('name'), () => 'Should not happen'),
  ).toBe('Carl')
})

test('unsafeGet', () => {
  expect(Maybe.of(5).unsafeGet()).toBe(5)
  expect(Maybe.of(undefined).unsafeGet()).toBe(undefined)
  expect(Maybe.of(null).unsafeGet()).toBe(null)

  expect(Maybe.fromNullable(null).unsafeGet).toThrow()
  expect(Maybe.fromNullable(undefined).unsafeGet).toThrow()
})
