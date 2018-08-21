import {path} from 'ramda'

import {SyntheticEvent} from './events'
import {updateStyles, setProperty, removeProperty} from './DOM'

const registerEvents = {}


export default function updateDomAttr(domNode, preProps, nextProps) {

  const prevKeys = Object.keys(preProps),
        nextKeys = Object.keys(nextProps),
        allUniqueKeys = [...(new Set([...prevKeys, ...nextKeys]))] 

    allUniqueKeys.forEach(key => {
      if(key !== 'children' && preProps[key] !== nextProps[key]) {
        updateProps(key)(domNode, key, preProps[key], nextProps[key])
      }
    })
}



const updateProps = (propName) => {
  if(propName === 'ref') {
    return 'ref'
  }else if(propName === 'style') {
    return updateStyle
  }else if(/^on[A-Z]/.test(propName)) {
    return updateEvent
  }else {
    return updateAttr
  } 
}

function updateStyle(domNode, key, preStyle = {}, nextStyle = {}) {
  let styleUpdates = {},
      nextKeys = Object.keys(nextStyle)
  // 添加修改
  nextKeys.forEach(key => {
    let pre = preStyle[key],
        next = nextStyle[key]
    if(pre !== next) {
      styleUpdates[key] = next
    }

    if(pre) {
      delete preStyle[key]
    }
  })
  
  let preKeys = Object.keys(preStyle)

  preKeys.forEach(key => {
    styleUpdates[key] = ''
  })


  updateStyles(domNode, styleUpdates)
}

function updateEvent(domNode, key, prevCallback, nextCallback) {
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

function updateAttr(domNode, key, preAtt, nextAtt) {
  if(preAtt === nextAtt) {
    return
  }else if(preAtt && typeof nextAtt === 'undefined') {
    removeProperty(domNode, key)
  }else {
    setProperty(domNode, key, nextAtt)
  }
}

function addEvent(dom, key, callback) {
  dom.addEventListener(key, callback, false )
}

// 真正的执行函数。
function dispatchEvent(e) {
  
  let path = detectPath(e)

  triggerEvents(e, path)
}


function triggerEvents(e, _path) {
  const {type} = e
        
  
  _path.every(domNode => {
    const callback = path(['_events', type], domNode),
          event = new SyntheticEvent(e, domNode)
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


