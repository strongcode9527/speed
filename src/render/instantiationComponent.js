export function instantiationClassComponent(fiber) {
  const instantiation = new fiber.type(fiber.props)
  fiber.stateNode = instantiation
  fiber.props.children = instantiation.render()
  return fiber
}

export function instantiationFunctionComponent(fiber) {
  return fiber.type(fiber.props)
}

export function instantiationDomComponent(fiber) {
  return document.createElement(fiber.type)
}