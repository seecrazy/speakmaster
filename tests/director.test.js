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

test("导演：新场景冒烟——就医问诊全流程（含意外）", async () => {
  const doctor = SCENARIOS.find(s => s.id === "doctor");
  const d = new Director(doctor);
  let t = await d.handleUserInput("good morning doctor");
  assert.equal(t.beatDone, true);
  t = await d.handleUserInput("i have a headache and a sore throat");
  // 前两轮顺利 → 难度 2 → symptom 节拍完成即注入转诊意外
  assert.equal(t.beatId, "symptom+referral");
  assert.equal(t.incident, "referral");
  t = await d.handleUserInput("tomorrow morning works for me");   // 应对转诊
  assert.equal(t.beatDone, true);
  assert.equal(t.beatId, "duration");
  t = await d.handleUserInput("it started three days ago");
  assert.equal(t.beatId, "allergy");
  t = await d.handleUserInput("i'm allergic to penicillin");
  assert.equal(t.beatId, "close");
  t = await d.handleUserInput("thank you doctor");
  assert.equal(t.done, true);
});

test("导演：新场景冒烟——面试（含意外）", async () => {
  const interview = SCENARIOS.find(s => s.id === "interview");
  const d = new Director(interview);
  await d.handleUserInput("hi sarah nice to meet you");
  let t = await d.handleUserInput("i've been working in marketing for three years");
  // 两轮顺利 → 难度 2 → intro 完成注入"离职原因"追问
  assert.equal(t.beatId, "intro+why-leave");
  // "marketing" 已填 strength 槽、"challenge" 已填 why 槽 → 节拍跳过逻辑直达反问环节
  t = await d.handleUserInput("honestly i'm ready for a bigger challenge");
  assert.equal(t.beatId, "close");
  assert.ok(d.state.slots.strength === "marketing" && d.state.slots.why === "challenge");
  t = await d.handleUserInput("could you tell me about the team?");
  assert.equal(t.done, true, "反问后完成");
});

test("导演：新场景冒烟——寒暄场景首节拍即必答", async () => {
  const smalltalk = SCENARIOS.find(s => s.id === "smalltalk");
  const d = new Director(smalltalk);
  const t = await d.handleUserInput("morning! such a sunny day");
  assert.equal(t.beatDone, true, "回应天气后应推进");
});

test("导演：进阶场景冒烟——薪资谈判全流程", async () => {
  const negotiation = SCENARIOS.find(s => s.id === "negotiation");
  const d = new Director(negotiation);
  await d.handleUserInput("thanks dana");
  let t = await d.handleUserInput("i'm targeting sixty five thousand");
  assert.equal(t.incident, "frozen", "两轮顺利后应注入预算冻结意外");
  t = await d.handleUserInput("what size signing bonus are we talking about");
  assert.equal(t.beatId, "justify");
  t = await d.handleUserInput("my results delivered thirty percent growth");
  assert.equal(t.beatId, "flexible");
  t = await d.handleUserInput("i'm flexible if the total package works");
  // 意外应答中提到的 "signing bonus" 已填 benefit 槽 → benefit 节拍被跳过，直达收尾
  assert.equal(t.beatId, "close");
  assert.equal(d.state.slots.benefit, "bonus");
  t = await d.handleUserInput("deal, thank you dana");
  assert.equal(t.done, true);
});

test("导演：进阶场景冒烟——观点交锋（含立场变强硬意外）", async () => {
  const debate = SCENARIOS.find(s => s.id === "debate");
  const d = new Director(debate);
  await d.handleUserInput("alright let's argue something fun");
  let t = await d.handleUserInput("i think remote work is here to stay");
  assert.equal(t.incident, "harden", "站队后应被要求一句话说服");
  t = await d.handleUserInput("because the data shows productivity is up everywhere");
  // "because" 已填 reason 槽 → reason 节拍被跳过，直达 example
  assert.equal(t.beatId, "example");
  t = await d.handleUserInput("for example my team shipped our biggest project remotely");
  assert.equal(t.beatId, "counter");
  t = await d.handleUserInput("however i see your point about lonely juniors");
  assert.equal(t.beatDone, true);
  t = await d.handleUserInput("ha deal, same time next week");
  assert.equal(t.done, true);
});
