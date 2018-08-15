import {scheduleWork} from '../render/render'

export class Component {
  setState(newState) {
    scheduleWork(this, newState)
  }

  render() {
    throw Error('you should implement render function')
  }

}

Component.prototype.isClassComponent = true