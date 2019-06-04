/**
 * A set of DOM helper functions
 */

export function empty(node: HTMLElement): void {
  [].slice.call(node, node.childNodes).forEach(node.removeChild, node);
}

export function updateStyles(node: HTMLElement, styleObj: object): void {
  Object.keys(styleObj).forEach((styleName): void => {
    node.style[styleName] = styleObj[styleName];
  });
}

export function setProperty(node: HTMLElement, attr: string, value: any): void | boolean {
  if (attr === 'children')  return false;
  node.setAttribute(attr, value);
}

export function removeProperty(node: HTMLElement, attr: string): void {
  node.removeAttribute(attr);
}

export function appendChildren(node: HTMLElement, children: [HTMLElement] | HTMLElement): void {
  if (Array.isArray(children)) {
    children.forEach((child): void => {node.appendChild(child);});
  } else {
    node.appendChild(children);
  }
}

export function removeChild(node: HTMLElement, child: HTMLElement): void {
  node.removeChild(child);
}

export function insertAfter(node: HTMLElement, child: HTMLElement, afterChild: HTMLElement): void {
  node.insertBefore(
    child,
    afterChild ? afterChild.nextSibling : node.firstChild
  );
}

export function replaceNode(prevNode: HTMLElement, newNode: HTMLElement): void {
  const parentNode = prevNode.parentNode;
  empty(parentNode as HTMLElement);
  parentNode.appendChild(newNode);
}

