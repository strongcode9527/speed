
export const SYNC_PRIORITY = 'SYNC_PRIORITY'; // 同步权重
export const NORMAL_PRIORITY = 'NORMAL_PRIORITY'; // 正常的异步权重
export const INTERACT_PRIORITY = 'INTERACT_PRIORITY'; // 异步的用户交互权重

let currentPriority = NORMAL_PRIORITY;

// 任务链表，从前往后过期时间越来越低。
let firstTask: Task, lastTask: Task;
let isRunningTasks = false;

interface Task {
  next: Task;
  callback: Function;
  expirationTime: number;
}

function createTask(callback: Function, expirationTime: number): Task {
  return {
    callback,
    expirationTime,
    next: undefined
  };
}


let rAFId: number;
let timeoutId;

function requestAnimationFrameWithTimeout(callback: Function): any {
  if(isRunningTasks) {
    return;
  }
  isRunningTasks = true;
  rAFId = requestAnimationFrame(function(timesTamp: number): void {
    callback(timesTamp);
    clearTimeout(timeoutId);
  });

  timeoutId = setTimeout(function(): void {
    cancelAnimationFrame(rAFId);
    callback(performance.now());
  }, 100);
}

// 去调用保存的任务
function flushTasks(): void {
  if(isRunningTasks) {
    return;
  }
  try {
    firstTask.callback();
    if(firstTask === lastTask) {
      firstTask = undefined;
      lastTask = undefined;
    } else {
      firstTask = firstTask.next;
    }
  } finally {
    isRunningTasks = false;
  }
}

// We use the postMessage trick to defer idle work until after the repaint.
const channel = new MessageChannel();
const port = channel.port2;


let frameDeadline = 0;
// We start out assuming that we run at 30fps but then the heuristic tracking
// will adjust this value to a faster fps if we get more frequent animation
// frames.
let previousFrameTime = 33;
let activeFrameTime = 33;

// requestAnimationFrame 的回调函数
function animationTick (rafTime: number): void {
  let nextFrameTime = rafTime - frameDeadline + activeFrameTime;
  if (nextFrameTime < activeFrameTime && previousFrameTime < activeFrameTime) {
    if (nextFrameTime < 8) {
      // Defensive coding. We don't support higher frame rates than 120hz.
      // If the calculated frame time gets lower than 8, it is probably a bug.
      nextFrameTime = 8;
    }
    // If one frame goes long, then the next one can be short to catch up.
    // If two frames are short in a row, then that's an indication that we
    // actually have a higher frame rate than what we're currently optimizing.
    // We adjust our heuristic dynamically accordingly. For example, if we're
    // running on 120hz display or 90hz VR display.
    // Take the max of the two in case one of them was an anomaly due to
    // missed frame deadlines.
    activeFrameTime = nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
  } else {
    previousFrameTime = nextFrameTime;
  }
  
  frameDeadline = rafTime + activeFrameTime;
  port.postMessage(undefined);
};

channel.port1.onmessage = function (): void {
  const currentTime = performance.now();
  if (frameDeadline < currentTime) {
    // 现在已经没有时间了
    requestAnimationFrameWithTimeout(animationTick);
  } else {
    // 还有剩余时间
    flushTasks();
  }
};

/**
 * 设定任务
 * @param callback 回调函数
 * @param expirationTime 过期时间
 */
export function setTaskWithExpirationTime(callback: Function, expirationTime: number): void {
  const newTask: Task = createTask(callback, expirationTime);
  // 之前没有任务，现在插入
  if (!firstTask && !lastTask) {
    firstTask = lastTask = newTask;
    firstTask.next = lastTask;
    lastTask.next = firstTask;
  } else {
    let currentTask: Task = firstTask;
    // 新的任务过期时间最小，权重最高
    if(firstTask.expirationTime > expirationTime) {
      newTask.next = firstTask;
      firstTask = newTask;
      return;
    } else {
      do {
        // 这个任务在中间
        if(expirationTime >= currentTask.expirationTime && currentTask.next && expirationTime < currentTask.next.expirationTime) {
          newTask.next = currentTask.next;
          currentTask.next = newTask;
          break;
        } else if (currentTask.expirationTime <= expirationTime && !currentTask.next) {
          // 新任务权过期时间最高，权重最低，放在最后
          currentTask.next = newTask;
          newTask.next = firstTask;
          break;
        }
        currentTask = currentTask.next;
      } while(currentTask !== firstTask );
    }
  }
  
}





