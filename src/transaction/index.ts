/**
 * 此文件为react事务文件，主要用于合并setState，实现合并setState以及react真正的状态改变效果。
 *
 * @export
 */
export default {
  perform: function(callback) {
    // 在这里获取事物的钩子函数
    const hooks = this.getTransactionWrappers()

    // 触发函数调用前的钩子函数，在这里开启setState的标志位
    hooks.forEach(item => {
      const initialize = item.initialize
      typeof initialize === 'function' && initialize()
    })

    // 函数调用
    callback()

    // 函数调用后的回调函数，在这里关掉setState的标志位
    hooks.forEach(item => {
      const close = item.close
      typeof close === 'function' && close()
    })
  }
}


