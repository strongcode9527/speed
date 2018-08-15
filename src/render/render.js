import {pathOr, path} from 'ramda'

import update from './updateComponent'
import EFFECTS from '../structure/effects'
import renderFactory from './renderFactory'
import tags from '../structure/componentTags'
import {createFiber} from '../structure/fiber'
import {createArrayChild, dispatchLifeCycle} from '../utils'

export function render(element, root) {
  // 将根节点放入渲染列表中。

  renderFactory.updateQueue.push(createFiber(tags.HostRoot, root.nodeName.toLowerCase(), root, {children: element}))
  requestIdleCallback(performWork)
}

function performWork(deadline) {
  workLoop(deadline)
  if(renderFactory.pendingCommit || renderFactory.updateQueue.length > 0) {
    requestIdleCallback(performWork)
  }
}

function workLoop(deadline) {
  // 如果当前不存在要处理的节点，那么就在更新队列中取出要处理的节点。
  if(!renderFactory.nextUnitOfWork) {
    createUpdateFiberFromQueue()
  }
  while (deadline.timeRemaining() > 0 && renderFactory.nextUnitOfWork) {
    renderFactory.nextUnitOfWork = createUnitOfWork(renderFactory.nextUnitOfWork)
    if(renderFactory.pendingCommit) {
      commitWork(renderFactory.pendingCommit)
    }
  }
}


/**
 * 返回当前fiber的子节点的第一个，并且建立所有子节点之间的关系。
 * 
 * @param {Object} currentFiber 此参数必须为已经instance后的fiber
 */
function createUnitOfWork(currentFiber) {

  let childs = []
  if(path(['type', 'prototype', 'isClassComponent'], currentFiber)) {
    childs = createArrayChild(currentFiber.stateNode.render())
  }
  else if(typeof path(['type'], currentFiber) === 'function') {
    childs = createArrayChild(currentFiber.stateNode(currentFiber.props))
  }else {
    childs = createArrayChild(pathOr([], ['props', 'children'], currentFiber))
  }
  
  if(currentFiber.child) return currentFiber.child


  // 意味着这个currentFiber已经是叶子节点了，只能返回上一层寻找兄弟节点。
  if(!currentFiber.type) {
    while(currentFiber) {
      if(currentFiber.tag === tags.HostRoot) {
        renderFactory.pendingCommit = currentFiber
        return 
      }
      collectEffects(currentFiber)

      if(currentFiber.sibing) {
        return currentFiber.sibing
      }
      
      currentFiber = currentFiber.return

      
      
    }
  }
  
  let prevFiber = null, oldChild = currentFiber.child
  

  childs.forEach((child, index) => {
    
    // child 是vnode，而不是fiber
    let newFiber = null
    if(typeof child === 'object') {
      newFiber = createFiber(undefined, child.type, undefined, child.props, currentFiber)
    }else {
      newFiber = createFiber(tags.HostText, null, undefined, {children: [child]}, currentFiber)
    }

    const isSame = oldChild && newFiber && child.type === newFiber.type

    // 实例化节点,update处理多样化子节点。
    update(newFiber)
    // 更新
    if(isSame) {

    }
    // 添加
    else if(!isSame && newFiber) {
      newFiber.effectTag = EFFECTS.PLACEMENT
    }
    // 修改
    else {

    }

    prevFiber && (prevFiber.sibing = newFiber)

    prevFiber = newFiber

    
    index === 0 && (currentFiber.child = newFiber)

    oldChild = path(['sibling'], oldChild)
    
  })
  return currentFiber.child
}

// 根据渲染队列，生成渲染节点。
function createUpdateFiberFromQueue() {
  const fiber = renderFactory.updateQueue.shift()

  renderFactory.nextUnitOfWork = fiber
}

function collectEffects(fiber) {
  fiber.effects = fiber.effects || []
  fiber.effectTag && fiber.effects.push(fiber)
  
  const parent = fiber.return

  if(parent) {
    parent.effects = parent.effects || []
    parent.effects = parent.effects.concat(fiber.effects)
  }

}

function commitWork(fiber) {
  const effects = fiber.effects

  effects.forEach(effect => {
    let parent = effect.return
    
    while(parent.tag === tags.ClassComponent || parent.tag === tags.FunctionalComponent) {
      parent = parent.return
    }
    
    (effect.tag !== tags.ClassComponent && effect.tag !== tags.FunctionalComponent) && parent.stateNode.appendChild(effect.stateNode)
    if(effect.tag === tags.ClassComponent) {
      dispatchLifeCycle(effect.stateNode, 'componentDidMount')
    }
  })

}

export function scheduleWork(instance, partialState) {
  renderFactory.updateQueue.push({
    fromTag: tags.ClassComponent,
    stateNode: instance,
    partialState: partialState
  })

  requestIdleCallback(performWork) //开始干活
}