export function createVnode(type, props, children) {
  return {
    type,
    children,
    props: { ...props, children: children },
  }
}