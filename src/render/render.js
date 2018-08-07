import {pathOr} from 'ramda'

import renderFactory from './renderFactory'
import tags from '../structure/componentTags'
import {createFiber} from '../structure/fiber'

// render 
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
  }
}

function createUnitOfWork(currentFiber) {
  const child = pathOr([], ['props', 'children'], currentFiber)
  // 意味着这个currentFiber已经是叶子节点了，只能返回上一层寻找兄弟节点。
  if(typeof child === 'string' || typeof child === 'number') {
    
  }
  console.log('child', child)
  // return currentFiber.child
}

// 根据渲染队列，生成渲染节点。
function createUpdateFiberFromQueue() {
  const fiber = renderFactory.updateQueue.shift()

  renderFactory.nextUnitOfWork = fiber
}