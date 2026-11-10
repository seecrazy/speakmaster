import test from "node:test";
import assert from "node:assert/strict";
import { SCENARIOS } from "../js/data/scenarios.js";
import { RETELL_PASSAGES } from "../js/data/retells.js";
import { PHONEME_SOUNDS } from "../js/data/phonemes.js";
import { SKILL_DEFS, SKILL_BY_ID } from "../js/data/skills.js";
import { pickLine } from "../js/engine/director.js";

const isLine = (x) => typeof x === "string" && x.trim().length > 3;
const isLineArray = (x) => Array.isArray(x) ? x.every(isLine) && x.length > 0 : isLine(x);

test("内容门禁：技能库 id 唯一且分组完整", () => {
  const ids = SKILL_DEFS.map(d => d.id);
  assert.equal(new Set(ids).size, ids.length, "技能 id 不得重复");
  for (const def of SKILL_DEFS) {
    assert.ok(def.group && def.name && def.zh, `技能 ${def.id} 字段不全`);
  }
  assert.equal(Object.keys(SKILL_BY_ID).length, ids.length);
});

test("内容门禁：场景结构完整（槽位引用/技能映射/意外库）", () => {
  assert.ok(SCENARIOS.length >= 25, "场景数应 ≥25");
  const seen = new Set();
  for (const s of SCENARIOS) {
    assert.ok(!seen.has(s.id), `场景 id 重复: ${s.id}`);
    seen.add(s.id);

    assert.ok(s.title && s.icon && s.goal, `${s.id}: 标题/图标/目标缺失`);
    assert.match(s.level, /^A2$|^B1/, `${s.id}: level 应为 A2/B1/B1+`);
    assert.ok(s.partner && s.partner.name && s.partner.role && s.partner.lang, `${s.id}: partner 缺失`);

    assert.ok(Object.keys(s.slots).length >= 4, `${s.id}: 信息槽过少`);
    for (const [slot, words] of Object.entries(s.slots)) {
      assert.ok(Array.isArray(words) && words.length > 0 && words.every(w => typeof w === "string" && w), `${s.id}: 槽 ${slot} 词条非法`);
    }

    assert.ok(s.beats.length >= 4, `${s.id}: 节拍过少`);
    let hasIncidentBeat = false;
    const seenBeats = new Set();
    for (const b of s.beats) {
      assert.ok(!seenBeats.has(b.id), `${s.id}: 节拍 id 重复 ${b.id}`);
      seenBeats.add(b.id);
      assert.ok(isLineArray(b.bot), `${s.id}/${b.id}: bot 台词非法`);
      assert.ok(b.objective, `${s.id}/${b.id}: 缺中文目标`);
      assert.ok(SKILL_BY_ID[b.skillId], `${s.id}/${b.id}: skillId 未注册 ${b.skillId}`);
      for (const r of b.requires || []) {
        assert.ok(s.slots[r], `${s.id}/${b.id}: requires 引用了不存在的槽 "${r}"`);
      }
      assert.ok(!b.hints || (Array.isArray(b.hints) && b.hints.every(h => typeof h === "string" && h)), `${s.id}/${b.id}: hints 非法`);
      if (b.allowIncident) hasIncidentBeat = true;
    }
    assert.ok(hasIncidentBeat, `${s.id}: 没有可注入意外的节拍`);

    assert.ok(s.incidents.length >= 3, `${s.id}: 意外库应 ≥3（当前 ${s.incidents.length}）`);
    const seenInc = new Set();
    for (const inc of s.incidents) {
      assert.ok(!seenInc.has(inc.id), `${s.id}: 意外 id 重复 ${inc.id}`);
      seenInc.add(inc.id);
      assert.ok(isLineArray(inc.bot), `${s.id}/${inc.id}: bot 非法`);
      assert.ok(inc.objective && inc.zhs, `${s.id}/${inc.id}: 缺目标/中文说明`);
      assert.ok(Array.isArray(inc.accept) && inc.accept.length > 0 && inc.accept.every(a => typeof a === "string" && a), `${s.id}/${inc.id}: accept 非法`);
      assert.ok([2, 3].includes(inc.minDifficulty), `${s.id}/${inc.id}: minDifficulty 应为 2|3`);
      assert.ok(!inc.hints || inc.hints.every(h => typeof h === "string"), `${s.id}/${inc.id}: hints 非法`);
    }
  }
});

test("内容门禁：复述语料结构完整", () => {
  assert.ok(RETELL_PASSAGES.length >= 30, "复述语料应 ≥30 段");
  const seen = new Set();
  for (const p of RETELL_PASSAGES) {
    assert.ok(!seen.has(p.id), `复述 id 重复: ${p.id}`);
    seen.add(p.id);
    assert.ok(p.title && p.en && p.zh, `${p.id}: 标题/原文/译文缺失`);
    assert.ok(p.en.split(/\s+/).length >= 30, `${p.id}: 语料过短`);
    assert.ok(p.keyPoints.length >= 4 && p.keyPoints.length <= 6, `${p.id}: 关键点应为 4-6 个`);
    for (const kp of p.keyPoints) {
      assert.ok(kp.point, `${p.id}: 关键点缺描述`);
      assert.ok(Array.isArray(kp.groups) && kp.groups.length > 0, `${p.id}: 关键点缺同义组`);
      for (const g of kp.groups) {
        assert.ok(Array.isArray(g) && g.length > 0 && g.every(a => typeof a === "string" && a), `${p.id}/${kp.point}: 同义组非法`);
      }
    }
  }
});

test("内容门禁：音素库结构完整", () => {
  assert.ok(PHONEME_SOUNDS.length >= 12, "音素组应 ≥12");
  const seen = new Set();
  for (const s of PHONEME_SOUNDS) {
    assert.ok(!seen.has(s.id), `音素 id 重复: ${s.id}`);
    seen.add(s.id);
    assert.ok(SKILL_BY_ID[s.skillId], `${s.id}: skillId 未注册 ${s.skillId}`);
    assert.ok(s.explain && s.name && s.ipa, `${s.id}: 讲解缺失`);
    assert.equal(s.minimalPairs.length, 4, `${s.id}: 最小对应为 4 组`);
    for (const pair of s.minimalPairs) {
      assert.equal(pair.length, 2, `${s.id}: 最小对应为词对`);
      assert.ok(pair.every(w => typeof w === "string" && w), `${s.id}: 词对非法`);
    }
    assert.ok([0, 1].includes(s.targetSide), `${s.id}: targetSide 应为 0|1`);
    assert.ok(s.drill && s.drillWords.length >= 4, `${s.id}: 跟读句缺失`);
    for (const w of s.drillWords) {
      assert.ok(s.drill.toLowerCase().includes(w.toLowerCase()), `${s.id}: 跟读词 "${w}" 不在跟读句里`);
    }
  }
});

test("pickLine：数组变体随机抽取、字符串原样返回", () => {
  const variants = ["a", "b", "c"];
  const picked = new Set();
  for (let i = 0; i < 100; i++) picked.add(pickLine(variants));
  assert.ok(picked.size > 1, "多次抽取应覆盖多于一个变体");
  for (const p of picked) assert.ok(variants.includes(p));
  assert.equal(pickLine("single"), "single");
  assert.equal(pickLine(undefined), undefined);
});
