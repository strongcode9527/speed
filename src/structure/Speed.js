import {createVnode} from './Vnode'

export default class Speed {
  static createElement(type, props, ...children) {
    // if(typeof type === 'function') {
    //   return new type().render()
    // }else {
    //   console.log(type, props, children)
    //   return createVnode(type, props, children)
    // }
    return createVnode(type, props, children)
  }
}