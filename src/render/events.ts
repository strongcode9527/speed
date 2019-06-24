// preventDefault和stopPropagation竟然是原生拦截？

var eventProto = SyntheticEvent.prototype = {
  fixEvent: function fixEvent(): void { }, //留给以后扩展用
  preventDefault: function preventDefault(): void {
    var e = this.nativeEvent || {};
    e.returnValue = this.returnValue = false;
    if (e.preventDefault) {
      e.preventDefault();
    }
  },
  fixHooks: function fixHooks(): void { },
  stopPropagation: function stopPropagation(): void {
    var e = this.nativeEvent || {};
    e.cancelBubble = this._stopPropagation = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  },
  persist: function noop(): void { },
  stopImmediatePropagation: function stopImmediatePropagation(): void {
    this.stopPropagation();
    this.stopImmediate = true;
  },
  toString: function toString(): string {
    return "[object Event]";
  }
};


/**事件合成，暂时这么写 */
export function SyntheticEvent(event, dom): void {
  if (event.nativeEvent) {
    return event;
  }
  for (var i in event) {
    if (!eventProto[i]) {
      this[i] = event[i];
    }
  }
  
  this.currentTarget = dom;

  if (!this.target) {
    this.target = event.srcElement;
  }
  this.fixEvent();
  const date = new Date();
  this.timeStamp = date.valueOf();
  this.nativeEvent = event;
}