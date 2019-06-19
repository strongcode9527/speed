import { PropsInterface } from './../types/index';

export interface VirtualNodeInterface {
  type: string;
  props: PropsInterface;
  children: VirtualNodeInterface | [VirtualNodeInterface];
}

export function createVirtualNode(type: string, props: PropsInterface, children: VirtualNodeInterface | [VirtualNodeInterface]): VirtualNodeInterface {
  return {
    type, 
    children,
    props: {...props, children: children},
  };
}