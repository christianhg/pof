export interface Maybe<A> {
  chain<B>(f: (a: A) => Maybe<B>): Maybe<B>
  filter(f: (a: A) => boolean): Maybe<A>
  fold<B>(f: (a: A) => B, g: () => B): B
  getOrElse(a: A): A
  guard<B extends A>(f: (a: A) => a is B): Maybe<B>
  isJust(): boolean
  isNothing(): boolean
  map<B>(f: (a: A) => B): Maybe<B>
  orElse(a: Maybe<A>): Maybe<A>
  unsafeGet(): A | void
}

class Just<A> implements Maybe<A> {
  private readonly value: A

  constructor(a: A) {
    this.value = a
  }

  chain<B>(f: (a: A) => Maybe<B>) {
    return f(this.value)
  }

  filter(f: (a: A) => boolean): Maybe<A> {
    return f(this.value) ? of(this.value) : empty()
  }

  fold<B>(f: (a: A) => B, g: () => B) {
    return f(this.value)
  }

  getOrElse(a: A) {
    return this.value
  }

  guard<B extends A>(f: (a: A) => a is B): Maybe<B> {
    return f(this.value) ? of(this.value) : empty()
  }

  isJust() {
    return true
  }

  isNothing() {
    return false
  }

  map<B>(f: (a: A) => B) {
    return of(f(this.value))
  }

  orElse(a: Maybe<A>) {
    return of(this.value)
  }

  unsafeGet() {
    return this.value
  }
}

class Nothing<A> implements Maybe<A> {
  chain<B>(f: (a: A) => Maybe<B>) {
    return empty<B>()
  }

  filter(f: (a: A) => boolean) {
    return empty<A>()
  }

  fold<B>(f: (a: A) => B, g: () => B) {
    return g()
  }

  getOrElse(a: A) {
    return a
  }

  guard<B extends A>(f: (a: A) => a is B) {
    return empty<B>()
  }

  isJust() {
    return false
  }

  isNothing() {
    return true
  }

  map<B>(f: (a: A) => B) {
    return empty<B>()
  }

  orElse(a: Maybe<A>) {
    return a
  }

  unsafeGet() {
    throw new TypeError('A Nothing holds no value.')
  }
}

export type Nullable<A> = A | undefined | null

export function all<A>(maybes: Maybe<A>[]): Maybe<A[]>
export function all<A, B>(maybes: [Maybe<A>, Maybe<B>]): Maybe<[A, B]>
export function all<A, B, C>(
  maybes: [Maybe<A>, Maybe<B>, Maybe<C>]
): Maybe<[A, B, C]>
export function all<A, B, C, D>(
  maybes: [Maybe<A>, Maybe<B>, Maybe<C>, Maybe<D>]
): Maybe<[A, B, C, D]>
export function all<A, B, C, D, E>(
  maybes: [Maybe<A>, Maybe<B>, Maybe<C>, Maybe<D>, Maybe<E>]
): Maybe<[A, B, C, D, E]>
export function all(maybes: Maybe<any>[]): Maybe<any[]> {
  return maybes.every(maybe => maybe.isJust())
    ? of(maybes.map(maybe => maybe.unsafeGet()))
    : empty()
}

export function empty<A>(): Maybe<A> {
  return new Nothing<A>()
}

export function fromNullable<A>(a: Nullable<A>): Maybe<A> {
  return a !== undefined && a !== null ? of(a) : empty()
}

export function of<A>(a: A): Maybe<A> {
  return new Just(a)
}
