
/**事件合成，暂时这么写 */
export function SyntheticEvent(event, dom) {
  if (event.nativeEvent) {
      return event;
  }
  console.log(event)
  for (var i in event) {
      if (!eventProto[i]) {
          this[i] = event[i];
      }
  }
  
  this.currentTarget = dom

  if (!this.target) {
      this.target = event.srcElement;
  }
  this.fixEvent();
  this.timeStamp = new Date() - 0;
  this.nativeEvent = event;
}

// preventDefault和stopPropagation竟然是原生拦截？

var eventProto = SyntheticEvent.prototype = {
  fixEvent: function fixEvent() { }, //留给以后扩展用
  preventDefault: function preventDefault() {
      var e = this.nativeEvent || {};
      e.returnValue = this.returnValue = false;
      if (e.preventDefault) {
          e.preventDefault();
      }
  },
  fixHooks: function fixHooks() { },
  stopPropagation: function stopPropagation() {
      var e = this.nativeEvent || {};
      e.cancelBubble = this._stopPropagation = true;
      if (e.stopPropagation) {
          e.stopPropagation();
      }
  },
  persist: function noop() { },
  stopImmediatePropagation: function stopImmediatePropagation() {
      this.stopPropagation();
      this.stopImmediate = true;
  },
  toString: function toString() {
      return "[object Event]";
  }
};

