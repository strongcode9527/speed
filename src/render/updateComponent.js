import {path, pathOr} from 'ramda'

import {createArrayChild} from '../utils'
import EFFECTS from '../structure/effects'
import tags from '../structure/componentTags'
import {createFiber} from '../structure/fiber'


// 更新和创建在一起。
export default function update(fiber) {

  if(path(['type', 'prototype', 'isClassComponent'], fiber)) {
    return updateClassComponent(fiber)
  }

  else if(typeof fiber.type === 'function') {
    return updateFunctionComponent(fiber)
  }

  else if(typeof fiber.type === 'string'){
    return updateDomComponent(fiber)
  }
  
  else {
    return updateTextComponent(fiber)
  }
}


function updateClassComponent(fiber) {
  // 创建fiber
  if(!fiber.stateNode) {
    const instantiation = new fiber.type(fiber.props)
    fiber.tag = tags.ClassComponent
    fiber.stateNode = instantiation
    fiber.stateNode.__relative = fiber
  }

  fiber.stateNode.state = {...fiber.stateNode.state, ...fiber.partialState}
 
  return handleChildrenVnode(fiber, createChilds(fiber))
}

function updateFunctionComponent(fiber) {
  const children = fiber.type(fiber.props)
  fiber.tag = tags.FunctionalComponent
  fiber.stateNode = children
}

function updateDomComponent(fiber) {
  if(!fiber.stateNode) {
    const dom = document.createElement(fiber.type)
    fiber.tag = fiber.tag || tags.HostComponent
    fiber.stateNode = dom
  }

  return handleChildrenVnode(fiber, createChilds(fiber))
}

function updateTextComponent(fiber) {
  fiber.stateNode = document.createTextNode(fiber.props.children[0])
  return fiber
}

/**
 * 为所有子节点Vnode创建fiber，并且建立联系，并为currenFiber绑定child
 * @param {Fiber} currentFiber 
 * @param {Vnode} childs 
 */
function handleChildrenVnode(currentFiber, childs) {
  console.log(childs)
  let oldChildFiber = currentFiber.alternate ? currentFiber.alternate.child : null

  let prevFiber = null
  let index = 0
  while(index < childs.length || oldChildFiber) {
    let child = childs[index]
    // child 是vnode，而不是fiber
    let newFiber = null

    if(typeof child === 'object') {
      newFiber = createFiber(undefined, child.type, undefined, child.props, currentFiber)
    }else {
      newFiber = createFiber(tags.HostText, null, undefined, {children: [child]}, currentFiber)
    }
    
    const isSame = oldChildFiber && newFiber && oldChildFiber.type === newFiber.type
    // console.log(isSame,oldChildFiber, currentFiber, index)

    // 实例化节点,update处理多样化子节点。
    // update(newFiber) 
    if(index === 3) {
      console.log(child, newFiber)
    }
    newFiber.alternate = oldChildFiber
    // 更新
    if(isSame) {
      newFiber.effectTag = EFFECTS.UPDATE
    }

    // 添加
    else if(!isSame && newFiber) {
      newFiber.effectTag = EFFECTS.PLACEMENT
    }

    // 删除
    else if(!isSame && oldChildFiber){
      oldChildFiber.effectTag = EFFECTS.DELETION
      currentFiber.effects = effects.push(oldChildFiber)
    }


    


    prevFiber && (prevFiber.sibling = newFiber)

    prevFiber = newFiber

    
    index === 0 && (currentFiber.child = newFiber)
    
    oldChildFiber = path(['sibling'], oldChildFiber)

    index++ 
  }
  
  return currentFiber
}



function createChilds(currentFiber) {
  let childs = []
  if(path(['type', 'prototype', 'isClassComponent'], currentFiber) || path(['stateNode', 'constructor', 'prototype', 'isClassComponent'], currentFiber)) {
    childs = createArrayChild(currentFiber.stateNode.render())
  }
  else if(typeof path(['type'], currentFiber) === 'function') {
    childs = createArrayChild(currentFiber.stateNode(currentFiber.props))
  }else {
    childs = createArrayChild(pathOr([], ['props', 'children'], currentFiber))
  }
  return childs
}




