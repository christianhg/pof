export function compose<A, B, C>(g: (b: B) => C, f: (a: A) => B) {
  return (a: A) => g(f(a))
}
