import test from "node:test";
import assert from "node:assert/strict";
import { schedule, newItem, dueQueue, isDue, summarize, SRS_INTERVALS } from "../js/engine/srs.js";

test("SRS: again 归零 10 分钟后再见", () => {
  const now = Date.now();
  let item = newItem("sound:th-s");
  item = schedule(item, 2); // easy → box 2
  assert.equal(item.box, 2);
  item = schedule(item, 0, now); // again
  assert.equal(item.box, 0);
  assert.equal(item.due - now, SRS_INTERVALS[0]);
  assert.equal(item.lapses, 1);
});

test("SRS: good/easy 升 box 且封顶", () => {
  let item = newItem("x");
  for (let i = 0; i < 5; i++) item = schedule(item, 1);
  assert.equal(item.box, 5);
  item = schedule(item, 2);
  assert.equal(item.box, 5, "box 不超过上限");
});

test("SRS: 到期队列按 box 升序、due 升序", () => {
  const now = Date.now();
  const items = {
    a: { id: "a", box: 2, due: now - 100 },
    b: { id: "b", box: 0, due: now - 50 },
    c: { id: "c", box: 4, due: now - 200 },
    d: { id: "d", box: 1, due: now + 99999 }
  };
  const q = dueQueue(items, now);
  assert.deepEqual(q, ["b", "a", "c"], "box 0 → 2 → 4，未到期不进队");
  assert.equal(isDue(items.d, now), false);
});

test("SRS: summarize 统计", () => {
  const now = Date.now();
  const items = {
    a: { id: "a", box: 4, due: now - 1 },
    b: { id: "b", box: 1, due: now - 1 }
  };
  assert.deepEqual(summarize(items), { total: 2, mastered: 1, due: 2 });
});
