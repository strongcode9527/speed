import {path} from 'ramda'

import { SyntheticEvent } from './events'
import { updateStyles, setProperty, removeProperty } from './DOM'
import { HTMLElementSpeed } from '../types'
const registerEvents = {}

function addEvent(dom: HTMLElement, key: string, callback): void {
  dom.addEventListener(key, callback, false )
}

function updateEvent(domNode: HTMLElementSpeed, key: string, prevCallback, nextCallback): void {
  const modifyKey = key.slice(2).toLocaleLowerCase()
  if(!nextCallback) {
    domNode._events[modifyKey] = undefined
  }
  // 添加回调函数
  else {
    domNode._events = domNode.events || {}
    // 将onClick转换为click
    
    domNode._events[modifyKey] = nextCallback
    !registerEvents[modifyKey] && addEvent(document, modifyKey, dispatchEvent)
    registerEvents[modifyKey] = true
  }
}

function updateClassName(domNode, key, preAtt, nextAtt): void {
  domNode[key] = nextAtt
}

function updateAttr(domNode, key, preAtt, nextAtt): boolean {
  if(preAtt === nextAtt) {
    return false;
  }else if(preAtt && typeof nextAtt === 'undefined') {
    removeProperty(domNode, key)
  }else {
    setProperty(domNode, key, nextAtt)
  }
}

function updateStyle(domNode, key, preStyle = {}, nextStyle = {}): void {
  let styleUpdates = {};
  const nextKeys = Object.keys(nextStyle);
  // 添加修改
  nextKeys.forEach((key: string): void => {
    let pre = preStyle[key]
    let next = nextStyle[key]
    if(pre !== next) {
      styleUpdates[key] = next
    }

    if(pre) {
      delete preStyle[key]
    }
  })
  
  let preKeys = Object.keys(preStyle)

  preKeys.forEach((key: string): void => {
    styleUpdates[key] = ''
  })


  updateStyles(domNode, styleUpdates)
}

const updateProps = (propName: string): any => {
  if(propName === 'ref') {
    return 'ref'
  }else if(propName === 'style') {
    return updateStyle
  }else if(/^on[A-Z]/.test(propName)) {
    return updateEvent
  }else if(propName === 'className') {
    return updateClassName
  }
  else {
    return updateAttr
  } 
}

export default function updateDomAttr(domNode, preProps = {}, nextProps = {}): void {

  const prevKeys = Object.keys(preProps)
  const nextKeys = Object.keys(nextProps)
  const allUniqueKeys = [...(new Set([...prevKeys, ...nextKeys]))] 

  allUniqueKeys.forEach((key: string): void => {
    if(key !== 'children' && preProps[key] !== nextProps[key]) {
      updateProps(key)(domNode, key, preProps[key], nextProps[key])
    }
  })
}










// 真正的执行函数。
function dispatchEvent(e): void {
  
  let path = detectPath(e)

  triggerEvents(e, path)
}


function triggerEvents(e, _path: array): void {
  const { type } = e
        
  
  _path.every((domNode): boolean => {
    const callback = path(['_events', type], domNode)
    const event = new SyntheticEvent(e, domNode)
    callback && callback.call(domNode, event)

    // 如果禁止冒泡，则停止循环
    if(event._stopPropagation) return false
    
    return true
  })

}

function detectPath(e, end) {
  let {target, type} = e,
      _path = [target]

  end = end || document

  while(target !== end && target) {
    target = target.parentNode

    if(!target) break

    if(path(['_events', type], target)) {
      _path.push(target)
    }
  }

  return _path
}


