
function updateClassComponent(fiber) {
  // 如果stateNode存在说明这是个更新，而不是创建
  if(fiber.stateNode) {

  }
  else {
    const instantiation = new fiber.type(fiber.props)
    fiber.stateNode = instantiation
    // fiber.props.children = instantiation.render()
  }
  
}