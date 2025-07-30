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

/**
 * Returns the provided string value if it is neither undefined, null, nor a string containing only whitespace.
 * If the provided value is invalid, the specified default string is returned.
 *
 * Mainly to bypass ESLint and SonarQubes errors of prefer-nullish-operator with empty (``) string
 *
 * @param {string | undefined | null} value - The input string to validate.
 * @param {string} defaultString - The string to return if the input value is invalid.
 * @returns {string} - The validated string or the default string if the value is invalid.
 */
export const getStringOrDefault = (
  value: string | undefined | null,
  defaultString: string
): string => {
  if (!value) {
    return defaultString;
  }

  if (!value.trim()) {
    return defaultString;
  }

  return value;
};
