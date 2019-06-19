import {path} from 'ramda';

import update from './updateComponent';
import {dispatchLifeCycle} from '../utils';
import EFFECTS from '../structure/effects';
import updateDomAttr from './updateDomAttr';
import renderFactory from './renderFactory';
import tags from '../structure/componentTags';
import {createFiber} from '../structure/fiber';

export function render(element: HTMLElement, root): void {
  // 将根节点放入渲染列表中。

  renderFactory.updateQueue.push(createFiber(tags.HostRoot, root.nodeName.toLowerCase(), root, {children: element}));
  requestIdleCallback(performWork);
}

function performWork(deadline): void {

  workLoop(deadline);
  if(renderFactory.nextUnitOfWork || renderFactory.updateQueue.length > 0) {
    requestIdleCallback(performWork);
  }
}

function workLoop(deadline) {

  // 如果当前不存在要处理的节点，那么就在更新队列中取出要处理的节点。
  if(!renderFactory.nextUnitOfWork) {
    createUpdateFiberFromQueue();
  }

  while (deadline.timeRemaining() > 0 && renderFactory.nextUnitOfWork) {
    renderFactory.nextUnitOfWork = createUnitOfWork(renderFactory.nextUnitOfWork);
  }

  if(renderFactory.pendingCommit) {
    commitWork(renderFactory.pendingCommit);
    renderFactory.pendingCommit = null;
  }
}




/**
 * 返回当前fiber的子节点的第一个，并且建立所有子节点之间的关系。
 *
 * @param {Object} currentFiber 此参数必须为已经instance后的fiber
 */
function createUnitOfWork(currentFiber) {


  if(currentFiber.child) return currentFiber.child

  update(currentFiber)



  // 意味着这个currentFiber已经是叶子节点了，只能返回上一层寻找兄弟节点。
  if(!currentFiber.type) {
    while(currentFiber) {
      // 在这里为组件实例更新fiber信息。
      collectEffects(currentFiber)

      if(currentFiber.tag === tags.ClassComponent) {
        currentFiber.stateNode.__relative = currentFiber
      }

      if(currentFiber.tag === tags.HostRoot) {
        renderFactory.pendingCommit = currentFiber
        if(currentFiber.stateNode.isClassComponent) {
          currentFiber.stateNode.__relative = currentFiber
        }
        console.log('instan fibver', currentFiber)
        return
      }



      if(currentFiber.sibling) {
        return currentFiber.sibling
      }

      currentFiber = currentFiber.return
    }
  }



  // console.log(currentFiber)
  return currentFiber.child
}

// 根据渲染队列，生成渲染节点。
function createUpdateFiberFromQueue() {

  const fiber = renderFactory.updateQueue.shift()
  // 在这里设置type和alternate是为了异步问题。

  if(path(['stateNode', 'isClassComponent'], fiber)) {
    const instance = fiber.stateNode
    fiber.type = instance.constructor,
    fiber.alternate =  instance.__relative
  }
  renderFactory.nextUnitOfWork = fiber
}

function collectEffects(fiber) {
  fiber.effects = fiber.effects || []
  fiber.effectTag && fiber.effects.push(fiber)

  const parent = fiber.return

  if(parent) {
    parent.effects = parent.effects || []
    parent.effects = parent.effects.concat(fiber.effects)
    fiber.effects = []
  }

}

function commitWork(fiber) {
  console.log('in commit')
  const effects = fiber.effects

  effects.forEach(effect => {

    //
    if(effect.effectTag === EFFECTS.PLACEMENT) {
      let parent = effect.return

      while(parent.tag === tags.ClassComponent || parent.tag === tags.FunctionalComponent) {
        parent = parent.return
      }

      (effect.tag !== tags.ClassComponent && effect.tag !== tags.FunctionalComponent) && parent.stateNode.appendChild(effect.stateNode)

      if(effect.tag === tags.HostComponent) {
        updateDomAttr(effect.stateNode, effect.stateNode.props, effect.props)
      }

    }
    // 更新dom节点
    else if(effect.effectTag === EFFECTS.UPDATE){
      const node = effect.alternate.stateNode
      // 更新文本内容
      if(effect.tag === tags.HostText && node.nodeVale !== effect.props.children[0]) {
        node.nodeValue = effect.props.children[0]
      }

      // 更新dom节点
      else if(effect.tag === tags.HostComponent) {
        updateDomAttr(node, effect.alternate.props, effect.props)
      }

    }

    else if(effect.effectTag === EFFECTS.DELETION) {
      let parent = effect.return

      while(parent.tag === tags.ClassComponent || parent.tag === tags.FunctionalComponent) {
        parent = parent.return
      }
      console.log('delet', parent.stateNode, effect.stateNode);
      (effect.tag !== tags.ClassComponent && effect.tag !== tags.FunctionalComponent) && parent.stateNode.removeChild(effect.stateNode)
    }



    if(effect.tag === tags.ClassComponent && !effect.stateNode.didMount) {
      dispatchLifeCycle(effect.stateNode, 'componentDidMount')
      effect.stateNode.didMount = true
    }
  })

  renderFactory.nextUnitOfWork = null
  fiber.effects = []

}

// 一个问题就是fiber架构之后的react是怎样保证更新的同时性的。
export function scheduleWork(instance, partialState) {

  // 在这里进行update判断，是进行队列还是直接更新。

  renderFactory.updateQueue.push({
    tag: tags.HostRoot,
    stateNode: instance,
    partialState: partialState,
  })




  requestIdleCallback(performWork) //开始干活
}
