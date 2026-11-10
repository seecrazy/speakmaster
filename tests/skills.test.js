import test from "node:test";
import assert from "node:assert/strict";
import { updateMastery, masteryLabel, radarData, performanceBySkill, masteryLevel, overallMastery, rankOf } from "../js/engine/skills.js";
import { SKILL_DEFS } from "../js/data/skills.js";

test("掌握度：成功按递减增益上升，失败衰减", () => {
  let m = 0;
  m = updateMastery(m, 1);
  assert.ok(m > 0 && m <= 0.2);
  const m1 = m;
  m = updateMastery(m, 1);
  assert.ok(m - m1 < m1, "增益随掌握度递减");
  m = updateMastery(m, 0.2);
  assert.ok(m < 1, "低表现应衰减");
  assert.equal(updateMastery(0.9, 0.1), 0.9 * 0.85);
});

test("掌握度：封顶与下限", () => {
  let m = 0.99;
  for (let i = 0; i < 10; i++) m = updateMastery(m, 1);
  assert.ok(m <= 1);
  let low = 0.01;
  for (let i = 0; i < 10; i++) low = updateMastery(low, 0);
  assert.ok(low >= 0);
});

test("masteryLabel / masteryLevel 分档", () => {
  assert.equal(masteryLabel(0), "未开始");
  assert.equal(masteryLabel(0.4), "入门");
  assert.equal(masteryLabel(0.65), "熟练");
  assert.equal(masteryLabel(0.9), "掌握");
  assert.equal(masteryLevel(0.87), 4);
  assert.equal(masteryLevel(0), 0);
});

test("performanceBySkill 聚合每技能表现", () => {
  const logs = [
    { beatId: "order", skillId: "order-food", score: 0.8 },
    { beatId: "order2", skillId: "order-food", score: 1 },
    { beatId: "pay", skillId: "ask-price", score: 0.6 },
    { beatId: "x", skillId: null, score: 1 }
  ];
  const perf = performanceBySkill(logs);
  assert.equal(perf["order-food"], 0.9);
  assert.equal(perf["ask-price"], 0.6);
});

test("radarData 按组平均", () => {
  const defs = SKILL_DEFS;
  const state = {
    "greet-small": { mastery: 1 },
    "order-food": { mastery: 0.5 },
    "specify": { mastery: 0.7 },
    "ask-price": { mastery: 0.2 }   // 生存交易组 = (0.5+0.7+0.2)/3
  };
  const radar = radarData(defs, state);
  const trade = radar.find(r => r.group === "生存交易");
  assert.ok(Math.abs(trade.mastery - 0.4666666667) < 1e-6);
  assert.equal(radar.length, new Set(defs.map(d => d.group)).size, "每个功能组都有雷达轴");
});

test("overallMastery / rankOf：段位计算", () => {
  const defs = [{ id: "a" }, { id: "b" }];
  assert.equal(overallMastery({}, defs), 0);
  assert.equal(overallMastery({ a: { mastery: 1 } }, defs), 0.5);
  assert.equal(rankOf(0).name, "未开始");
  assert.equal(rankOf(0.25).name, "新手");
  assert.equal(rankOf(0.4).name, "学徒");
  assert.equal(rankOf(0.6).name, "熟练沟通者");
  assert.equal(rankOf(0.75).name, "进阶表达者");
  assert.equal(rankOf(0.9).name, "口语大师");
  // 边界值
  assert.equal(rankOf(0.85).name, "口语大师");
  assert.equal(rankOf(0.84).name, "进阶表达者");
});
