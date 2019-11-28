// let currentTime = Date.now();

function getNow(): number {
  return Date.now();
}

const highPriorityExpirationMs = 50;
const highPriorityBatchMs = 25;

function getHighPriorityExpirationTime(): number {
  return ((Date.now() + highPriorityExpirationMs) / highPriorityBatchMs) | 0 * highPriorityBatchMs;
}

const lowPriorityExpirationMs = 100;
const lowPriorityBatchMs = 50;

function getLowPriorityExpirationTime(): number {
  return ((Date.now() + lowPriorityExpirationMs) / lowPriorityBatchMs) | 0 * lowPriorityBatchMs;
}

export {
  getNow,
  getLowPriorityExpirationTime,
  getHighPriorityExpirationTime,
};