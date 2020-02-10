import { FiberInterface } from './fiber';
import {path} from 'ramda';

import Tags from './componentTags';
import { PropsInterface } from '../types';

export interface Root  {
  container: HTMLElement;
  childFiber: FiberInterface;
  expirationTime: number;
}

export function createRoot(root: Root): Root {
  const {
    container,
    childFiber,
    expirationTime
  } = root;
  return {
    container,
    childFiber,
    expirationTime
  };
}


