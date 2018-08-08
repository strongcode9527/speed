export function instantiationComponent(fiber) {
  // class 组件
  if(path(['type', 'isClassComponent'], fiber)) {

  }
  // function 组件
  else if(typeof fiber.type === 'functon') {

  }
  // dom组件
  else {

  }
}