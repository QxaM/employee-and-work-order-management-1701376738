/**
 * Compares two values deeply for equality.
 *
 * @template T The type of the values being compared.
 * @param {T} a The first value to compare.
 * @param {T} b The second value to compare.
 * @returns {boolean} Returns `true` if the values are deeply equal, otherwise `false`.
 */
export const deepEquals = <T>(a: T, b: T): boolean => {
  if (a === b) {
    return true;
  }

  if (a === null || b === null) {
    return a === b;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a !== 'object' || typeof b !== 'object') {
    return a === b;
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const objA = a as Record<PropertyKey, unknown>;
  const objB = b as Record<PropertyKey, unknown>;
  const keysA = Reflect.ownKeys(a);
  const keysB = Reflect.ownKeys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every(
    (key) => keysB.includes(key) && deepEquals(objA[key], objB[key])
  );
};
