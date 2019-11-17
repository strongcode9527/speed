let currentTime = Date.now();

function getNow(): number {
  return Date.now();
}

const highPriorityExpirationMs = 50;
const highPriorityBatchMs = 25;

function getHeightPriorityExpirationTime() {
  return ((Date.now() + highPriorityExpirationMs) / highPriorityBatchMs) | 0 * highPriorityBatchMs;
}

const lowPriorityExpirationMs = 100;
const lowPriorityBatchMs = 50;