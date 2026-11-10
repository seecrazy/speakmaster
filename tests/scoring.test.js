import test from "node:test";
import assert from "node:assert/strict";
import { normalize, tokenize, extractSlots, evaluateTurn, politenessScore, scoreRetell, scoreShadow } from "../js/engine/scoring.js";

const coffeeSlots = {
  drink: ["latte", "cappuccino", "americano", "coffee", "regular coffee"],
  size: ["small", "medium", "large", "grande"],
  milk: ["oat milk", "soy milk", "whole milk"],
  pay: ["card", "cash", "phone"]
};

test("normalize 清洗标点与多余空白", () => {
  assert.equal(normalize("  Hi! It's a  LARGE... latte.  "), "hi it's a large latte");
  assert.deepEqual(tokenize("Three, please!"), ["three", "please"]);
});

test("extractSlots 抽取饮品/杯型/多词短语", () => {
  const slots = extractSlots("Can I get a large latte with oat milk please", coffeeSlots);
  assert.equal(slots.drink, "latte");
  assert.equal(slots.size, "large");
  assert.equal(slots.milk, "oat milk");
  // 多词别名优先于单词（regular coffee 不应截成 coffee）——同槽只取一个，这里验证短语可命中
  const s2 = extractSlots("just a regular coffee", coffeeSlots);
  assert.equal(s2.drink, "regular coffee");
});

test("evaluateTurn 命中 requires 计分，礼貌加分，单词回答打折", () => {
  const beat = { requires: ["drink", "size"] };
  const good = evaluateTurn(beat, "Could I have a large latte, please?", coffeeSlots);
  assert.deepEqual(good.missing, []);
  assert.ok(good.score > 0.9);

  const partial = evaluateTurn(beat, "a latte", coffeeSlots);
  assert.deepEqual(partial.missing, ["size"]);
  assert.ok(partial.score < good.score, "缺槽位得分更低");

  const one = evaluateTurn(beat, "latte", coffeeSlots);
  assert.ok(one.score <= partial.score, "单词回答再打折");
});

test("politenessScore 识别礼貌标记", () => {
  assert.ok(politenessScore("Could I get a latte, please?") > 0);
  assert.equal(politenessScore("latte now"), 0);
});

test("scoreRetell 关键点覆盖 + 允许换词", () => {
  const passage = {
    en: "Tom was a lighthouse keeper on a small island for six years.",
    keyPoints: [
      { point: "是灯塔守护人", groups: [["lighthouse"], ["keeper", "guardian"]] },
      { point: "小岛", groups: [["island"]] },
      { point: "六年", groups: [["six", "6"]] }
    ]
  };
  // 换词表达（guardian + six）也应覆盖
  const r = scoreRetell(passage, "Tom worked as a lighthouse guardian on an island for six years");
  assert.equal(r.coveredCount, 3);
  assert.ok(r.score >= 80);
  // 缺关键信息
  const r2 = scoreRetell(passage, "Tom lived somewhere for a long time");
  assert.ok(r2.coveredCount < 3);
  assert.ok(r2.score < 60);
});

test("scoreShadow 词级对齐", () => {
  const r = scoreShadow("I think three thoughts", "I sink three thoughts");
  assert.ok(r.pct < 100);
  assert.ok(r.problems.some(p => p.word === "think" && p.said === "sink"));
  assert.equal(scoreShadow("hello world", "hello world").pct, 100);
});
