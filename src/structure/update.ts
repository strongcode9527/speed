import batchingStrategy from './batchingStrategy';

// setState入口
export default {
  enqueueUpdate(Component): void {
    
    // // 直接更新
    // if (!batchingStrategy.isBatchingUpdates) {
    //   batchingStrategy.batchedUpdates(enqueueUpdate, component);
    //   return;
    // }

    // /// 队列更新。
    // dirtyComponents.push(component);
    // if (component._updateBatchNumber == null) {
    //   component._updateBatchNumber = updateBatchNumber + 1;
    // }



    // 首先创建更新的权重
    const update = createUpdate();
    
    // 其次直接进行更新
    
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