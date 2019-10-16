首先得到当前时间:

var currentTime = requestCurrentTime();

根据当前时间计算fiber过期时间 

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


var currentRendererTime = msToExpirationTime(originalStartTimeMs);
var currentSchedulerTime = currentRendererTime;


function requestCurrentTime() {
  // requestCurrentTime is called by the scheduler to compute an expiration
  // time.
  //
  // Expiration times are computed by adding to the current time (the start
  // time). However, if two updates are scheduled within the same event, we
  // should treat their start times as simultaneous, even if the actual clock
  // time has advanced between the first and second call.

  // In other words, because expiration times determine how updates are batched,
  // we want all updates of like priority that occur within the same event to
  // receive the same expiration time. Otherwise we get tearing.
  //
  // We keep track of two separate times: the current "renderer" time and the
  // current "scheduler" time. The renderer time can be updated whenever; it
  // only exists to minimize the calls performance.now.
  //
  // But the scheduler time can only be updated if there's no pending work, or
  // if we know for certain that we're not in the middle of an event.

  if (isRendering) {
    // We're already rendering. Return the most recently read time.
    return currentSchedulerTime;
  }
  // Check if there's pending work.
  findHighestPriorityRoot();
  if (nextFlushedExpirationTime === NoWork || nextFlushedExpirationTime === Never) {
    // If there's no pending work, or if the pending work is offscreen, we can
    // read the current time without risk of tearing.
    recomputeCurrentRendererTime();
    currentSchedulerTime = currentRendererTime;
    return currentSchedulerTime;
  }
  // There's already pending work. We might be in the middle of a browser
  // event. If we were to read the current time, it could cause multiple updates
  // within the same event to receive different expiration times, leading to
  // tearing. Return the last read time. During the next idle callback, the
  // time will be updated.
  return currentSchedulerTime;
}

var expirationTime = computeExpirationForFiber(currentTime, fiber) {
  // 首先通过scheduler获取权重
   var priorityLevel = scheduler.unstable_getCurrentPriorityLevel();

  switch (priorityLevel) {
      case scheduler.unstable_ImmediatePriority:
        expirationTime = Sync;
        break;
      case scheduler.unstable_UserBlockingPriority:
        expirationTime = computeInteractiveExpiration(currentTime);
        break;
      case scheduler.unstable_NormalPriority:
        // This is a normal, concurrent update
        expirationTime = computeAsyncExpiration(currentTime);
        break;
      case scheduler.unstable_LowPriority:
      case scheduler.unstable_IdlePriority:
        expirationTime = Never;
        break;
      default:
        invariant(false, 'Unknown priority level. This error is likely caused by a bug in React. Please file an issue.');
   
}

function computeInteractiveExpiration(currentTime) {
  return computeExpirationBucket(currentTime, HIGH_PRIORITY_EXPIRATION, HIGH_PRIORITY_BATCH_SIZE);
}

function ceiling(num, precision) {
  return ((num / precision | 0) + 1) * precision;
}

function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs) {
  return MAGIC_NUMBER_OFFSET - ceiling(MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE, bucketSizeMs / UNIT_SIZE);
}



var LOW_PRIORITY_EXPIRATION = 5000;
var LOW_PRIORITY_BATCH_SIZE = 250;

function computeAsyncExpiration(currentTime) {
  return computeExpirationBucket(currentTime, LOW_PRIORITY_EXPIRATION, LOW_PRIORITY_BATCH_SIZE);
}

// We intentionally set a higher expiration time for interactive updates in
// dev than in production.
//
// If the main thread is being blocked so long that you hit the expiration,
// it's a problem that could be solved with better scheduling.
//
// People will be more likely to notice this and fix it with the long
// expiration time in development.
//
// In production we opt for better UX at the risk of masking scheduling
// problems, by expiring fast.

// export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150;
var HIGH_PRIORITY_EXPIRATION = 500;
var HIGH_PRIORITY_BATCH_SIZE = 100;

function computeInteractiveExpiration(currentTime) {
  return computeExpirationBucket(currentTime, HIGH_PRIORITY_EXPIRATION, HIGH_PRIORITY_BATCH_SIZE);
}



```

以下是三列分别代表当前的 ms事件，还有react内部的当前单位时间，其次就是不同的priority的expiration时间。

整体规则就是权重越大expirationTime越大，同等权重的事件，发生的越晚过期时间越小。

async 1571122690023 2875262772 2875262247
async 1571122690033 2875262771 2875262222
async 1571122690043 2875262770 2875262222
async 1571122690053 2875262769 2875262222
async 1571122690093 2875262765 2875262222
async 1571122690183 2875262756 2875262222

inter 1571122690023 2875262772 2875262742
inter 1571122690033 2875262771 2875262742
inter 1571122690043 2875262770 2875262742
inter 1571122690053 2875262769 2875262742
inter 1571122690093 2875262765 2875262732
inter 1571122690183 2875262756 2875262722

### 结论：

首先priority的设置是在scheduler.unstable_runWithPriority,然后在每一次的setState中都先获取scheduler.unstable_getCurrentPriorityLevel 中的priority。