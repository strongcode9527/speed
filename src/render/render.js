import {pathOr} from 'ramda'

import {createArrayChild} from '../utils'
import renderFactory from './renderFactory'
import tags from '../structure/componentTags'
import {createFiber} from '../structure/fiber'
import update from './updateComponent'

export function render(element, root) {
  // 将根节点放入渲染列表中。

  renderFactory.updateQueue.push(createFiber(tags.HostRoot, element.type, root, {children: element}))
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
      // 子节点遍历完成
      console.log(renderFactory.pendingCommit)
    }
  }
  
}


/**
 * 返回当前fiber的子节点的第一个，并且建立所有子节点之间的关系。
 * 
 * @param {Object} currentFiber 此参数必须为已经instance后的fiber
 */
function createUnitOfWork(currentFiber) {
  const childs = createArrayChild(pathOr([], ['props', 'children'], currentFiber))

  if(currentFiber.child) return currentFiber.child


  // 意味着这个currentFiber已经是叶子节点了，只能返回上一层寻找兄弟节点。
  if(!currentFiber.type) {
    while(currentFiber) {
      if(currentFiber.tag === tags.HostRoot) {
        renderFactory.pendingCommit = currentFiber
        return 
      }
      currentFiber = currentFiber.return
      if(currentFiber.sibing) {
        return currentFiber.sibing
      }
    }
  }
  
  let prevFiber = null
  
  childs.forEach((child, index) => {


    // child 是vnode，而不是fiber
    const newFiber = createFiber(undefined, child.type, undefined, child.props, currentFiber)
    
    update(newFiber)

    prevFiber && (prevFiber.sibing = newFiber)

    prevFiber = newFiber

    if(index === 0) {
      currentFiber.child = newFiber
    }
  })
  return currentFiber.child
}

// 根据渲染队列，生成渲染节点。
function createUpdateFiberFromQueue() {
  const fiber = renderFactory.updateQueue.shift()

  renderFactory.nextUnitOfWork = fiber
}