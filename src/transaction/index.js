/**
 * 此文件为react事务文件，主要用于合并setState，实现合并setState以及react真正的状态改变效果。
 *
 * @export
 */
export default {
  perform: function(callback) {
    const hooks = this.getTransactionWrappers()
    hooks.forEach(item => {
      const initialize = item.initialize
      typeof initialize === 'function' && initialize()
    })

    callback()

    hooks.forEach(item => {
      const close = item.close
      typeof close === 'function' && close()
    })
  }
}


