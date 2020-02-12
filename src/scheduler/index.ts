
export const SYNC_PRIORITY = 'SYNC_PRIORITY'; // 同步权重
export const NORMAL_PRIORITY = 'NORMAL_PRIORITY'; // 正常的异步权重
export const INTERACT_PRIORITY = 'INTERACT_PRIORITY'; // 异步的用户交互权重

let currentPriority = NORMAL_PRIORITY;

// 任务链表，从前往后过期时间越来越低。
let firstTask: Task, lastTask: Task;

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



