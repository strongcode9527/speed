interface Hook {
  memoizedState: any;
  baseState: any;
  baseUpdate: null;
  queue: null;
  next: Hook | null;
};


function createHook(): Hook {
  return {
    memoizedState: null,
    baseState: null,  // 传给reducer的状态对象
    queue: null, 
    baseUpdate: null, // 最近一次创建baseState的已发送的action
    next: null, // 链表的地址，指向下一个
  };
}