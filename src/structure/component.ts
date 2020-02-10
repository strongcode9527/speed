import { scheduleWork } from '../render/render';
 


export class Component {
  isClassComponent: boolean;
  public setState(newState: any): void {
    scheduleWork(this, newState);
  }

  private render(): void {
    throw Error('you should implement render function');
  }
}

Component.prototype.isClassComponent = true;
