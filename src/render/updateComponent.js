import {path} from 'ramda'
import {instantiationClassComponent, instantiationDomComponent, instantiationFunctionComponent} from './instantiationComponent'

// 更新和创建在一起。
export default function update(fiber) {

  if(!fiber.stateNode) {
    // 
    if(path(['type', 'isClassComponent'], fiber)) {
      return instantiationClassComponent(fiber)
    }
    // function 组件
    else if(typeof fiber.type === 'function') {
      return instantiationFunctionComponent(fiber)
    }
    // dom组件
    else {
      return instantiationDomComponent(fiber)
    }
  }
  
}
