/**
 * 
 * @param {String} tag fiber类型
 * @param {String} type fiber的类型
 * @param {Object} stateNode fiber实例化的组件
 * @param {Object} props vnode的props
 * @param {Object} Return fiber的父节点
 * @param {Array} sibling fiber的兄弟节点
 * @param {Object} child fiber的子节点
 */
export function createFiber(tag, type, stateNode, props = {}, Return ,sibling, child) {
  return {
    tag,
    type,
    props,
    child,
    sibling,
    stateNode,
    return: Return,
  }
}

// const Fiber = {
//   tag: HOST_COMPONENT,
//   type: "div",
//   return: parentFiber,
//   child: childFiber,
//   sibling: null,
//   alternate: currentFiber,
//   stateNode: document.createElement("div")| instance,
//   props: { children: [], className: "foo"},
//   partialState: null,
//   effectTag: PLACEMENT,
//   effects: []
// };