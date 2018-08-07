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
  requestIdleCallback(performWork)
}

function workLoop(deadline) {
  while (deadline.timeRemaining() > 0 && renderFactory.nextUnitOfWork) {
    renderFactory.nextUnitOfWork = createUnitOfWork(renderFactory.nextUnitOfWork)
  }
}

function createUnitOfWork(currentFiber) {
  console.log(currentFiber)
  

  return currentFiber.child
}