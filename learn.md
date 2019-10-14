expiration time 越大，优先级越高(不一定)

```

var maxSigned31BitInt = 1073741823;

var NoWork = 0;
var Never = 1;
var Sync = maxSigned31BitInt;

var UNIT_SIZE = 10;
var MAGIC_NUMBER_OFFSET = maxSigned31BitInt - 1;

// 1 unit of expiration time represents 10ms.
function msToExpirationTime(ms) {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return MAGIC_NUMBER_OFFSET - (ms / UNIT_SIZE | 0);
}

```

getCurrentPriorityLevel 

这个函数是给update函数的fiber，创建更新优先级非常重要

computeExpirationForFiber 给fiber 计算优先级

createUpdate(expirationTime) 创建一个更新对象

这个是十分重要的当前的render的过期时间

// The time at which we're currently rendering work.
var nextRenderExpirationTime = NoWork;


renderRoot 出现while


scheduler.unstable_shouldYield 判断是否中断render过程，估计是和优先级有关系