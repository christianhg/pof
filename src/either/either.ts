// export interface Either<A, B> {
//   // chain<B>(f: (a: A) => Maybe<B>): Maybe<B>
//   // filter<B extends A>(f: (a: A) => a is B): Maybe<B>
//   // filter(f: (a: A) => boolean): Maybe<A>
//   // fold<B>(f: (a: A) => B, g: () => B): B
//   // getOrElse(a: A): A
//   isLeft(): boolean
//   isRight(): boolean
//   // map<C>(f: (a: A) => C): Either<C, B>
//   // orElse(a: Maybe<A>): Maybe<A>
//   // unsafeGet(): A | void
// }

class Right<A> {
  private readonly value: A

  constructor(a: A) {
    this.value = a
  }

  // chain<B>(f: (a: A) => Maybe<B>) {
  //   return f(this.value)
  // }

  // filter<B extends A>(f: (a: A) => a is B): Maybe<B>
  // filter(f: (a: A) => boolean): Maybe<A> {
  //   return f(this.value) ? of(this.value) : empty()
  // }

  // fold<B>(f: (a: A) => B, g: () => B) {
  //   return f(this.value)
  // }

  // getOrElse(a: A) {
  //   return this.value
  // }

  isLeft() {
    return false
  }

  isRight() {
    return true
  }

  map<B>(f: (a: A) => B) {
    return of(f(this.value))
  }

  // orElse(a: Maybe<A>) {
  //   return of(this.value)
  // }

  // unsafeGet() {
  //   return this.value
  // }
}

class Left<B> {
  private readonly value: B

  constructor(b: B) {
    this.value = b
  }
  // chain<B>(f: (a: A) => Maybe<B>) {
  //   return empty<B>()
  // }

  // filter<B extends A>(f: (a: A) => a is B): Maybe<B>
  // filter(f: (a: A) => boolean) {
  //   return empty()
  // }

  // fold<B>(f: (a: A) => B, g: () => B) {
  //   return g()
  // }

  // getOrElse(a: A) {
  //   return a
  // }

  isLeft() {
    return true
  }

  isRight() {
    return false
  }

  map<A, C>(f: (a: A) => C) {
    return this
  }

  // orElse(a: Maybe<A>) {
  //   return a
  // }

  // unsafeGet() {
  //   throw new TypeError('A Nothing holds no value.')
  // }
}

// export type Nullable<A> = A | undefined | null

// export function all<A>(maybes: Maybe<A>[]): Maybe<A[]>
// export function all<A, B>(maybes: [Maybe<A>, Maybe<B>]): Maybe<[A, B]>
// export function all<A, B, C>(
//   maybes: [Maybe<A>, Maybe<B>, Maybe<C>]
// ): Maybe<[A, B, C]>
// export function all<A, B, C, D>(
//   maybes: [Maybe<A>, Maybe<B>, Maybe<C>, Maybe<D>]
// ): Maybe<[A, B, C, D]>
// export function all<A, B, C, D, E>(
//   maybes: [Maybe<A>, Maybe<B>, Maybe<C>, Maybe<D>, Maybe<E>]
// ): Maybe<[A, B, C, D, E]>
// export function all(maybes: Maybe<any>[]): Maybe<any[]> {
//   return maybes.every(maybe => maybe.isJust())
//     ? of(maybes.map(maybe => maybe.unsafeGet()))
//     : empty()
// }

// export function empty<A>(): Maybe<A> {
//   return new Nothing<A>()
// }

// export function fromNullable<A>(a: Nullable<A>): Maybe<A> {
//   return a !== undefined && a !== null ? of(a) : empty()
// }

export function left<B>(b: B) {
  return new Left(b)
}

export function of<A>(a: A) {
  return new Right(a)
}
