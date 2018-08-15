import assert from 'assert'

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



export function dispatchLifeCycle(instance, funcName) {
  if(typeof instance !== 'object' || typeof funcName !== 'string') {
    assert('dispatch')
  }
  // TODO: 声明周期的参数填写，包括didUpdate和willReceiveProps等
  instance[funcName] && typeof instance[funcName] === 'function' && instance[funcName]()
}






