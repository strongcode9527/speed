export function createFiber(tag, type, stateNode, props, Return ,sibling, child) {
  return {
    tag,
    type,
    props,
    child,
    Return,
    sibling,
    stateNode,
  }
}