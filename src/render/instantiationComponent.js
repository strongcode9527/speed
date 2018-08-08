export function instantiationClassComponent(fiber) {
  return fiber.stateNode = new fiber.type(fiber.props)
}

export function instantiationFunctionComponent(fiber) {
  return fiber.type(fiber.props)
}

export function instantiationDomComponent(fiber) {
  console.log('type', fiber.type)
  return document.createElement(fiber.type)
}