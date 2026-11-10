import test from "node:test";
import assert from "node:assert/strict";
import { Director } from "../js/engine/director.js";
import { SCENARIOS } from "../js/data/scenarios.js";

const coffee = SCENARIOS.find(s => s.id === "coffee");

test("导演：顺利完成基本节拍并完结", async () => {
  const d = new Director(coffee);
  const opening = d.opening();
  assert.match(opening.say, /Sunrise Coffee/);

  let t = await d.handleUserInput("hi");            // greet（可选）
  assert.equal(t.beatDone, true);
  t = await d.handleUserInput("a latte");           // 缺杯型 → 留在节拍
  assert.equal(t.beatDone, false);
  assert.ok(t.missing.includes("size"));
  t = await d.handleUserInput("large please");      // 补杯型 → 过（难度仍 1，不触发意外）
  assert.equal(t.beatDone, true);
  t = await d.handleUserInput("oat milk");          // milk
  assert.equal(t.beatDone, true);
  t = await d.handleUserInput("by card");           // pay
  assert.equal(t.beatDone, true);
  t = await d.handleUserInput("thanks a lot");      // close
  assert.equal(t.done, true);
  assert.ok(t.debrief.avgScore > 50);
  assert.equal(d.state.finished, true);
});

test("导演：连续顺利 → 难度提升并注入意外（插入节拍）", async () => {
  const d = new Director(coffee);
  await d.handleUserInput("Hi there");
  const t = await d.handleUserInput("Could I get a large cappuccino please");
  assert.equal(d.state.difficulty, 2, "两轮顺利后难度应升到 2");
  assert.ok(t.incident, "完成 order 节拍应注入意外");
  assert.match(t.say, /ran out|large cups/i);

  // 应对意外（换奶）→ 意外节拍完成，且 milk 信息已给 → 后续 milk 节拍被跳过
  const r = await d.handleUserInput("Soy milk is fine, thanks");
  assert.equal(r.beatDone, true);
  assert.equal(r.incident, undefined);
  assert.equal(d.state.slots.milk, "soy milk");
  assert.equal(d.beat.id, "pay", "milk 节拍应被跳过，直接到支付");
});

test("导演：连续挣扎 → 支架模式给提示", async () => {
  const d = new Director(coffee);
  await d.handleUserInput("hello");
  await d.handleUserInput("um");
  const t = await d.handleUserInput("coffee");
  assert.equal(d.state.scaffolding, true, "两轮低分应进支架模式");
  assert.ok(Array.isArray(t.hints) && t.hints.length > 0, "支架模式应给出提示句");
  assert.match(t.say, /You can say/);
});

test("导演：高难度优先选高难度意外，且不重复", async () => {
  const d = new Director(coffee);
  d.state.difficulty = 3;
  await d.handleUserInput("Hi");
  const t1 = await d.handleUserInput("A large americano please");
  assert.equal(t1.incident, "size-out", "难度 3 应优先选 minDifficulty 3 的意外");
  await d.handleUserInput("Sure, medium is fine");
  const t2 = await d.handleUserInput("Whole milk please");
  assert.equal(t2.incident, undefined, "milk 节拍不允许意外");
  assert.equal(d.state.incidentUsed.length, 1);
});

test("导演：debrief 汇总轮次/意外/技能日志", async () => {
  const d = new Director(coffee);
  d.state.difficulty = 2;
  await d.handleUserInput("Hi!");
  await d.handleUserInput("A large latte please");     // → 难度升 3，触发意外
  await d.handleUserInput("Sure, soy milk please");    // 应对意外（同时填 milk 槽）
  await d.handleUserInput("With card");
  const t = await d.handleUserInput("Thanks a lot!");
  assert.equal(t.done, true);
  const logs = t.debrief.logs;
  assert.ok(logs.every(l => typeof l.skillId === "string"));
  assert.ok(logs.some(l => l.incident), "日志应记录意外应对");
  assert.equal(t.debrief.incidents, 1);
  assert.ok(t.debrief.turns >= 5);
  assert.equal(t.debrief.peakDifficulty, 3);
});
