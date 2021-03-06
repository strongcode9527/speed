import {path, pathOr} from 'ramda'

import {createArrayChild} from '../utils'
import EFFECTS from '../structure/effects'
import tags from '../structure/componentTags'
import {createFiber} from '../structure/fiber'
import safeGetValue from '../utils/safeGetValue'

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
    fiber.tag = tags.ClassComponent;
    fiber.stateNode = instantiation;
    fiber.stateNode.props = fiber.props;
    fiber.stateNode.__relative = fiber;
  }
  fiber.stateNode.props = { ...fiber.stateNode.props, ...fiber.props };

  fiber.stateNode.state = {...fiber.stateNode.state, ...fiber.partialState}

  fiber.partialState = null
  
 
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
  if(!fiber.stateNode) {
    fiber.stateNode = document.createTextNode(safeGetValue('', ['props', 'children', 0], fiber));
  }
  
  return handleChildrenVnode(fiber, createChilds(fiber))
}

/**
 * 为所有子节点Vnode创建fiber，并且建立联系，并为currenFiber绑定child
 * @param {Fiber} currentFiber 
 * @param {Vnode} childs 
 */
function handleChildrenVnode(currentFiber, childs) {
  let prevFiber = null;
  let oldChildFiber = currentFiber.alternate ? currentFiber.alternate.child : null;
  (function loopChildren(currentFiber, childs) {
    if(childs.length === 0) {
      return;
    } 
    let index = 0;
    while(index < childs.length || oldChildFiber) {
      let child = childs[index];
      const childIsExit = index < childs.length;
      // child 是vnode，而不是fiber
      let newFiber = null;
      if(Array.isArray(child)) {
        if(child.length === 0) {
          index++;
          continue;
        }
        loopChildren(currentFiber, child);
        index++;
        continue;
      }
      if(typeof child === 'object') {
        newFiber = createFiber(undefined, child.type, undefined, child.props, currentFiber)
      }
      // 这里是对于jsx合格值的筛查如果直接if(child)会有问题，那就是特殊值0，0属于false，但是他是jsx合理显示的内容。
      else if([undefined, null, false].indexOf(child) === -1){
        newFiber = createFiber(tags.HostText, null, undefined, {children: [child]}, currentFiber)
      } else if(childIsExit) {
        index++;
        continue;
      }
      
      const isSame = oldChildFiber && newFiber && oldChildFiber.type === newFiber.type
      // console.log(isSame,oldChildFiber, currentFiber, index)
      
      // 实例化节点,update处理多样化子节点。
      // update(newFiber) 
    
  
      // newFiber && (newFiber.alternate = oldChildFiber)
  
      // 更新
      if(isSame) {
        Object.assign(newFiber, {
          effectTag: EFFECTS.UPDATE,
          alternate: oldChildFiber,
          return: currentFiber,
          stateNode: oldChildFiber.stateNode,
        })
      
      }
  
      // 添加
      else if(!isSame && newFiber) {
        newFiber.effectTag = EFFECTS.PLACEMENT;
      }
  
      // 删除
      else if(!isSame && oldChildFiber){
        oldChildFiber.effectTag = EFFECTS.DELETION;
  
        !Array.isArray(currentFiber.effects) && (currentFiber.effects = []);
  
        currentFiber.effects.push(oldChildFiber);
      }
      // 设置当前节点的子节点，首先当index为0时并且preFiver为空，或者之前的新节点并且当前节点的子节点未被设置。
      if((index === 0 && !prevFiber) ||(!prevFiber && !currentFiber.child)) {
        currentFiber.child = newFiber;
      }

      prevFiber && (prevFiber.sibling = newFiber);

      prevFiber = newFiber;
      
      oldChildFiber = path(['sibling'], oldChildFiber);
      index++;
    }
  })(currentFiber, childs);
  
  
  return currentFiber;
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




