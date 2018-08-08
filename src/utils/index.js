

/**
 *
 *
 * @export
 * @param {Object | Array} child
 * @returns array
 */
export function createArrayChild(child) {
  return Array.isArray(child) ? child : [child]
}