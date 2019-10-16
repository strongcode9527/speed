```
// 一个更新的update结构
function createUpdate(expirationTime) {
  return {
    expirationTime: expirationTime,

    tag: UpdateState,
    payload: null,
    callback: null,

    next: null,
    nextEffect: null
  };
}

// 下方的update结构均是上面的
fiber.updateQueue = {
  baseState: baseState,
  firstUpdate: null,
  lastUpdate: null, // 这里的数据结构是一个json，有next记录下一个链表的地址
  firstCapturedUpdate: null,
  lastCapturedUpdate: null,
  firstEffect: null,
  lastEffect: null,
  firstCapturedEffect: null,
  lastCapturedEffect: null
}


// fiber.alternate.updateQueue和上面的结构一致，也就是说一个fiber要维护两个updateQueue



scheduleWork 会把这个fiber的所有父元素打上childExpirationTime 

scheduleWorkToRoot


```