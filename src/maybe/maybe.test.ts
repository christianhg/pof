import test from 'ava'

import * as Maybe from './maybe'

function compose<A, B, C>(g: (b: B) => C, f: (a: A) => B) {
  return (a: A) => g(f(a))
}

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
  password: '1234'
}

const persons: Person[] = [
  {
    name: 'Alice'
  },
  {
    age: 30,
    name: 'Bob'
  },
  admin
]

test('all', t => {
  t.true(Maybe.all([Maybe.of('foo'), Maybe.of('bar')]).isJust())
  t.true(Maybe.all([Maybe.of(42), Maybe.of('fizzbuzz')]).isJust())
  t.true(Maybe.all([Maybe.of(true), Maybe.fromNullable(undefined)]).isNothing())
  t.deepEqual(Maybe.all([Maybe.of('foo'), Maybe.of('bar')]).unsafeGet(), [
    'foo',
    'bar'
  ])
  t.deepEqual(Maybe.all([Maybe.of(42), Maybe.of('fizzbuzz')]).unsafeGet(), [
    42,
    'fizzbuzz'
  ])
  t.true(
    Maybe.all([
      Maybe.fromNullable(persons[0]),
      Maybe.fromNullable(persons[1]),
      Maybe.fromNullable(persons[2]),
      Maybe.fromNullable(persons[3])
    ])
      .map(persons => persons.map(unsafeProp('name')))
      .isNothing()
  )
  t.deepEqual(
    Maybe.all([
      Maybe.fromNullable(persons[0]),
      Maybe.fromNullable(persons[1]),
      Maybe.fromNullable(persons[2])
    ]).fold(
      persons => persons.map(unsafeProp('name')),
      () => ['random', 'names', 'list']
    ),
    ['Alice', 'Bob', 'Carl']
  )
})

test('chain', t => {
  t.is(
    Maybe.fromNullable(persons[0])
      .chain(safeProp('age'))
      .getOrElse(42),
    42
  )

  t.is(
    Maybe.fromNullable(persons[1])
      .chain(safeProp('age'))
      .getOrElse(42),
    30
  )

  t.is(
    Maybe.fromNullable(persons[3])
      .chain(safeProp('age'))
      .getOrElse(42),
    42
  )
})

test('empty', t => {
  t.truthy(Maybe.empty().isNothing())
  t.falsy(Maybe.empty().isJust())
})

test('filter', t => {
  t.is(
    Maybe.fromNullable(persons[2])
      .chain(safeProp('name'))
      .filter(compose(isEven, length))
      .getOrElse('A man has no even length name'),
    'Carl'
  )

  t.is(
    Maybe.fromNullable(persons[0])
      .chain(safeProp('name'))
      .filter(compose(isEven, length))
      .getOrElse('A girl has no even length name'),
    'A girl has no even length name'
  )

  t.is(
    Maybe.fromNullable(persons[3])
      .chain(safeProp('name'))
      .filter(compose(isEven, length))
      .getOrElse('A person does not exist'),
    'A person does not exist'
  )
})

test('fold', t => {
  t.is(
    Maybe.fromNullable(persons[0]).fold(
      unsafeProp('name'),
      () => 'A girl has no name'
    ),
    'Alice'
  )

  t.is(
    Maybe.fromNullable(persons[3]).fold(
      unsafeProp('name'),
      () => 'A person does not exist'
    ),
    'A person does not exist'
  )
})

test('fromNullable', t => {
  t.false(Maybe.fromNullable(undefined).isJust())
  t.true(Maybe.fromNullable(undefined).isNothing())

  t.false(Maybe.fromNullable(null).isJust())
  t.true(Maybe.fromNullable(null).isNothing())

  t.true(Maybe.fromNullable('foo').isJust())
  t.false(Maybe.fromNullable('foo').isNothing())
})

test('guard', t => {
  t.is(
    Maybe.fromNullable(persons[2])
      .guard(isAdmin)
      .fold(unsafeProp('password'), () => 'A person is not an admin'),
    '1234'
  )

  t.is(
    Maybe.fromNullable(persons[1])
      .guard(isAdmin)
      .fold(unsafeProp('password'), () => 'A person is not an admin'),
    'A person is not an admin'
  )

  t.is(
    Maybe.fromNullable(persons[3])
      .guard(isAdmin)
      .fold(unsafeProp('password'), () => 'A person does not exist'),
    'A person does not exist'
  )
})

test('map', t => {
  t.is(
    Maybe.fromNullable(persons[0])
      .chain(safeProp('name'))
      .map(toUpper)
      .getOrElse('A girl has no name'),
    'ALICE'
  )

  t.is(
    Maybe.fromNullable(persons[3])
      .chain(safeProp('name'))
      .map(toUpper)
      .getOrElse('A person does not exist'),
    'A person does not exist'
  )
})

test('of', t => {
  t.true(Maybe.of('foo').isJust())
  t.true(Maybe.of(null).isJust())
  t.true(Maybe.of(undefined).isJust())
})

test('orElse', t => {
  t.is(
    Maybe.fromNullable(persons[1])
      .guard(isAdmin)
      .orElse(Maybe.of({ name: 'Spontaneous Admin', password: 'password' }))
      .fold(unsafeProp('name'), () => 'Should not happen'),
    'Spontaneous Admin'
  )

  t.is(
    Maybe.fromNullable(persons[2])
      .guard(isAdmin)
      .orElse(Maybe.of({ name: 'Spontaneous Admin', password: 'password' }))
      .fold(unsafeProp('name'), () => 'Should not happen'),
    'Carl'
  )
})

test('unsafeGet', t => {
  t.is(Maybe.of(5).unsafeGet(), 5)
  t.is(Maybe.of(undefined).unsafeGet(), undefined)
  t.is(Maybe.of(null).unsafeGet(), null)

  t.throws(Maybe.fromNullable(null).unsafeGet)
  t.throws(Maybe.fromNullable(undefined).unsafeGet)
})
