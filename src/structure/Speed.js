import {createVnode} from './Vnode'

export default class Speed {
  static createElement(type, props, ...children) {
    return createVnode(type, props, children)
  }
}