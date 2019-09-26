import {path} from 'ramda';

import Tags from './componentTags';
import { PropsInterface } from '../types';
/**
 * 
 * @param {String} tag fiber类型
 * @param {String} type fiber的类型
 * @param {Object} stateNode fiber实例化的组件
 * @param {Object} props vnode的props
 * @param {Object} Return fiber的父节点
 * @param {Array} sibling fiber的兄弟节点
 * @param {Object} child fiber的子节点
 */
export function createFiber(tag: string, type: string, stateNode: FiberInterface | OwnHTMLElement, props: PropsInterface, Return: FiberInterface ,sibling: FiberInterface, child: FiberInterface, alternate: FiberInterface, __relative: FiberInterface): FiberInterface {
  const _tag = ['string', 'number'].indexOf(typeof type) !== -1 
    ? Tags.HostComponent
    : typeof type === 'undefined'
      ? Tags.HostText
      : path(['prototype', 'isClassComponent'], type)
        ? Tags.ClassComponent
        : Tags.FunctionalComponent;

  return {
    type,
    props,
    child,
    sibling,
    stateNode,
    alternate,
    __relative,
    effects: [],
    effectTag: 0,
    return: Return,
    tag: tag || _tag,
    expirationTime: 0,
    memoizedState: undefined
  };
}

export interface OwnHTMLElement extends HTMLElement {
  __relative: FiberInterface;
}

export interface FiberInterface  {
  tag: string;
  type: string;
  effectTag: number;
  memoizedState: any; // 旧的state
  child: FiberInterface;
  props: PropsInterface;
  expirationTime: number; // 任务过期时间
  return: FiberInterface;
  sibling: FiberInterface;
  effects: FiberInterface[];
  alternate: FiberInterface;
  __relative: FiberInterface;
  stateNode: FiberInterface | OwnHTMLElement;
}




// const Fiber = {
//   tag: HOST_COMPONENT,
//   type: "div",
//   return: parentFiber,
//   child: childFiber,
//   sibling: null,
//   alternate: currentFiber,
//   stateNode: document.createElement("div")| instance,
//   props: { children: [], className: "foo"},
//   partialState: null,
//   effectTag: PLACEMENT,
//   effects: []
// };