/**
 * A set of DOM helper functions
 */

export function empty(node) {
  [].slice.call(node, node.childNodes).forEach(node.removeChild, node)
}

export function updateStyles(node, styleObj) {
  Object.keys(styleObj).forEach((styleName) => {
    node.style[styleName] = styleObj[styleName]
  })
}

export function setProperty(node, attr, value) {
  if (attr === 'children')  return
  node.setAttribute(attr, value)
}

export function removeProperty(node, attr) {
  node.removeAttribute(attr);
}

export function appendChildren(node, children) {
  if (Array.isArray(children)) {
    children.forEach((child) => node.appendChild(child))
  } else {
    node.appendChild(children)
  }
}

export function removeChild(node, child) {
  node.removeChild(child)
}

export function insertAfter(node, child, afterChild) {
  node.insertBefore(
    child,
    afterChild ? afterChild.nextSibling : node.firstChild
  )
}

export function replaceNode(prevNode, newNode) {
  const parentNode = prevNode.parentNode
  empty(parentNode)
  parentNode.appendChild(newNode)
}

