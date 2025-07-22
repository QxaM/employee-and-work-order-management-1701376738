/**
 * Represents a utility type that excludes `undefined` from a given type `T`.
 *
 * This type is useful when you need a version of a type that ensures it does not include `undefined`.
 *
 * @template T - The type to evaluate and exclude `undefined` from.
 */
export type NonUndefined<T> = T extends undefined ? never : T;
