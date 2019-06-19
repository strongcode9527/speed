import { PropsInterface } from './../types/index';
import { createVirtualNode, VirtualNodeInterface } from './Vnode';

export default class Speed {
  static createElement(type: string, props: PropsInterface, ...children: [VirtualNodeInterface]): VirtualNodeInterface {
    return createVirtualNode(type, props, children);
  }
}