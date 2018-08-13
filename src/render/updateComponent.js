import {path} from 'ramda'

import tags from '../structure/componentTags'

// 更新和创建在一起。
export default function update(fiber) {

  if(path(['type', 'prototype', 'isClassComponent'], fiber)) {
    return upgradeClassComponent(fiber)
  }

  else if(typeof fiber.type === 'function') {
    return upgradeFunctionComponent(fiber)
  }

  else {
    return upgradeDomComponent(fiber)
  }
}


function upgradeClassComponent(fiber) {
  // 更新
  if(fiber.stateNode) {

  }
  // 创建
  else {
    const instantiation = new fiber.type(fiber.props)
    fiber.tag = tags.ClassComponent
    fiber.stateNode = instantiation
    return fiber
  }
  
}

function upgradeFunctionComponent(fiber) {
  const children = fiber.type(fiber.props)
  fiber.tag = tags.FunctionalComponent
  fiber.stateNode = children
}

function upgradeDomComponent(fiber) {
  const dom = document.createElement(fiber.type)
  fiber.tag = tags.HostComponent
  fiber.stateNode = dom
}
