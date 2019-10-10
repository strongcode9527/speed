import batchingStrategy from './batchingStrategy';

export default {
  enqueueUpdate(Component): void {
    
    // 直接更新
    if (!batchingStrategy.isBatchingUpdates) {
      batchingStrategy.batchedUpdates(enqueueUpdate, component);
      return;
    }

    /// 队列更新。
    dirtyComponents.push(component);
    if (component._updateBatchNumber == null) {
      component._updateBatchNumber = updateBatchNumber + 1;
    }
  }
};

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