import {path, pathOr} from 'ramda';

import {createArrayChild} from '../utils';
import EFFECTS from '../structure/effects';
import tags from '../structure/componentTags';
import {createFiber} from '../structure/fiber';
import { FiberInterface } from './../structure/fiber';
import { VirtualNodeInterface } from '../structure/Vnode';

function createChilds(currentFiber): VirtualNodeInterface [] {
  let childs = [];
  if(path(['type', 'prototype', 'isClassComponent'], currentFiber) || path(['stateNode', 'constructor', 'prototype', 'isClassComponent'], currentFiber)) {
    childs = createArrayChild(currentFiber.stateNode.render());
  }
  else if(typeof path(['type'], currentFiber) === 'function') {
    childs = createArrayChild(currentFiber.stateNode(currentFiber.props));
  }else {
    childs = createArrayChild(pathOr([], ['props', 'children'], currentFiber));
  }
  return childs;
}

/**
 * 为所有子节点Vnode创建fiber，并且建立联系，并为currenFiber绑定child
 * @param {Fiber} currentFiber 
 * @param {Vnode} childs 
 */
function handleChildrenVnode(currentFiber: FiberInterface, childs): FiberInterface {
  let oldChildFiber: FiberInterface | null = currentFiber.alternate ? currentFiber.alternate.child : null;
  let prevFiber: FiberInterface | null = null;
  let index = 0;
  
  while(index < childs.length || oldChildFiber) {
    let child = childs[index];
    // child 是vnode，而不是fiber
    let newFiber = null;

    if(typeof child === 'object') {
      newFiber = createFiber(undefined, child.type, undefined, child.props, currentFiber, null, null, null);
    }
    // 这里是对于jsx合格值的筛查如果直接if(child)会有问题，那就是特殊值0，0属于false，但是他是jsx合理显示的内容。
    else if([undefined, null, false].indexOf(child) === -1){
      newFiber = createFiber(tags.HostText, null, undefined, {children: [child]}, currentFiber, null, null, null);
    }
    
    const isSame = oldChildFiber && newFiber && oldChildFiber.type === newFiber.type;
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
      });
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


    


    prevFiber && (prevFiber.sibling = newFiber);

    prevFiber = newFiber;

    
    index === 0 && (currentFiber.child = newFiber);
    
    oldChildFiber = path(['sibling'], oldChildFiber);

    index++;
  }
  
  return currentFiber;
}

function updateClassComponent(fiber): FiberInterface {
  // 创建fiber
  if(!fiber.stateNode) {
    const instantiation = new fiber.type(fiber.props);
    fiber.tag = tags.ClassComponent;
    fiber.stateNode = instantiation;
    fiber.stateNode.__relative = fiber;
  }

  fiber.stateNode.state = {...fiber.stateNode.state, ...fiber.partialState};

  fiber.partialState = null;
  
 
  return handleChildrenVnode(fiber, createChilds(fiber));
}

function updateFunctionComponent(fiber): void {
  const children = fiber.type(fiber.props);
  fiber.tag = tags.FunctionalComponent;
  fiber.stateNode = children;
}

function updateDomComponent(fiber: FiberInterface): FiberInterface {
  if(!fiber.stateNode) {
    const dom = document.createElement(fiber.type);
    fiber.tag = fiber.tag || tags.HostComponent;
    fiber.stateNode = dom;
  }

  return handleChildrenVnode(fiber, createChilds(fiber));
}

function updateTextComponent(fiber): FiberInterface {
  if(!fiber.stateNode) {
    fiber.stateNode = document.createTextNode(fiber.props.children[0]);
  }
  
  return handleChildrenVnode(fiber, createChilds(fiber));
}









// 更新和创建在一起。
export default function update(fiber): FiberInterface | void {

  if (path(['type', 'prototype', 'isClassComponent'], fiber)) {
    return updateClassComponent(fiber);
  }

  else if(typeof fiber.type === 'function') {
    return updateFunctionComponent(fiber);
  }

  else if(typeof fiber.type === 'string'){
    return updateDomComponent(fiber);
  }
  
  else {
    return updateTextComponent(fiber);
  }
}
