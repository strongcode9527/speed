import {path} from 'ramda';

import Tags from './componentTags';
import { PropsInterface } from '../types';
import { Component } from './component';

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
export function createFiber(tag: string, type: string, stateNode: Component | OwnHTMLElement, props: PropsInterface, Return: FiberInterface ,sibling: FiberInterface, child: FiberInterface, alternate: FiberInterface, __relative: FiberInterface): FiberInterface {
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
    effects: [],
    effectTag: 0,
    return: Return,
    updateQueue:[],
    tag: tag || _tag,
    expirationTime: 0,
    memorizedState: undefined,
  };
}

export interface OwnHTMLElement extends HTMLElement {
  isClassComponent: boolean;
}

export interface FiberInterface  {
  tag: string;
  type: string;
  effectTag: number;
  memorizedState: any; // 旧的state
  child: FiberInterface;
  props: PropsInterface;
  expirationTime: number; // 任务过期时间
  return: FiberInterface;
  sibling: FiberInterface;
  updateQueue: any; //TODO 待定这个东西需要一个更新队列的json
  effects: FiberInterface[];
  alternate: FiberInterface;
  stateNode: Component | OwnHTMLElement;
}