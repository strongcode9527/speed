const originTime = Date.now();

function getCurrentTime(): number {
  return Date.now() - originTime;
}

const highPriorityExpirationMs = 50;
const highPriorityBatchMs = 25;

function getHeightPriorityExpirationTime(currentTime: number): number {
  return ((currentTime + highPriorityExpirationMs) / highPriorityBatchMs) | 0 * highPriorityBatchMs;
}

const lowPriorityExpirationMs = 100;
const lowPriorityBatchMs = 50;

function getLowPriorityExpirationTime(currentTime: number): number {
  return ((currentTime + lowPriorityExpirationMs) / lowPriorityBatchMs) | 0 * lowPriorityBatchMs;
}
