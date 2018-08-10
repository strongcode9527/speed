import tags from '../structure/componentTags'

export function instantiationClassComponent(fiber) {
  const instantiation = new fiber.type(fiber.props)
  fiber.tag = tags.ClassComponent
  fiber.stateNode = instantiation
  // fiber.props.children = instantiation.render()
  return fiber
}

export function instantiationFunctionComponent(fiber) {

  const children = fiber.type(fiber.props)
  fiber.tag = tags.FunctionalComponent
  fiber.stateNode = children
}

export function instantiationDomComponent(fiber) {
  const dom = document.createElement(fiber.type)
  fiber.tag = tags.HostComponent
  fiber.stateNode = dom
}