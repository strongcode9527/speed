export const createFiber(tag, type, stateNode, props, Return , child) {
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