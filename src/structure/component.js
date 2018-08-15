import {scheduleWork} from '../render/render'

export class Component {
  setState() {
    scheduleWork(this)
  }

  render() {
    throw Error('you should implement render function')
  }

}

Component.prototype.isClassComponent = true