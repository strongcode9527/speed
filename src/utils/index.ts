import assert from 'assert';

import { VirtualNodeInterface } from './../structure/Vnode';

/**
 *
 *
 * @export
 * @param {Object | Array} child
 * @returns array
 */
export function createArrayChild(child: VirtualNodeInterface | VirtualNodeInterface[]): VirtualNodeInterface[]  {
  return Array.isArray(child) ? child : [child];
}

export function dispatchLifeCycle(instance, funcName): void {
  if(typeof instance !== 'object' || typeof funcName !== 'string') {
    assert('dispatch');
  }
  // TODO: 声明周期的参数填写，包括didUpdate和willReceiveProps等
  instance[funcName] && typeof instance[funcName] === 'function' && instance[funcName]();
}
