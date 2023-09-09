import { get, isEqual } from 'lodash';

export function compareObject(a: unknown, b: unknown): boolean {
  if (typeof a === 'object') {
    return Object.entries(a as object).every(([k, v]) => {
      return compareObject(v, get(b, k));
    });
  }
  return isEqual(a, b);
}
