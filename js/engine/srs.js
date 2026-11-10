// 通用间隔重复引擎：单词、句型、发音弱项、复述段落共用。
// grade: 0 = 不会/again, 1 = 模糊/good, 2 = 掌握/easy
export const SRS_INTERVALS = [
  10 * 60 * 1000,        // box 0: 10 分钟
  24 * 60 * 60 * 1000,   // box 1: 1 天
  3 * 24 * 60 * 60 * 1000,  // box 2: 3 天
  7 * 24 * 60 * 60 * 1000, // box 3: 7 天
  21 * 24 * 60 * 60 * 1000, // box 4: 21 天
  60 * 24 * 60 * 60 * 1000 // box 5: 60 天
];

export function newItem(id, extra = {}) {
  return { id, box: 0, due: 0, lapses: 0, reps: 0, ...extra };
}

export function schedule(item, grade, now = Date.now()) {
  const next = { ...item, reps: (item.reps || 0) + 1 };
  if (grade === 0) {
    next.lapses = (item.lapses || 0) + 1;
    next.box = 0;
    next.due = now + SRS_INTERVALS[0];
  } else if (grade === 1) {
    next.box = Math.min(SRS_INTERVALS.length - 1, item.box + 1);
    next.due = now + SRS_INTERVALS[next.box];
  } else {
    next.box = Math.min(SRS_INTERVALS.length - 1, item.box + 2);
    next.due = now + SRS_INTERVALS[next.box];
  }
  return next;
}

export function isDue(item, now = Date.now()) {
  return !item.due || item.due <= now;
}

// 从 items 表里取到期队列：box 高的靠后，同 box 按 due 升序；上限 limit
export function dueQueue(items, now = Date.now(), limit = 20) {
  return Object.values(items)
    .filter(item => isDue(item, now))
    .sort((a, b) => (a.box - b.box) || ((a.due || 0) - (b.due || 0)))
    .slice(0, limit)
    .map(item => item.id);
}

export function summarize(items) {
  const list = Object.values(items);
  const mastered = list.filter(i => i.box >= 4).length;
  const due = list.filter(i => isDue(i)).length;
  return { total: list.length, mastered, due };
}
