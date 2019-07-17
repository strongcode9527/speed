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
    baseState: null,
    queue: null,
    baseUpdate: null,
    next: null,
  };
}