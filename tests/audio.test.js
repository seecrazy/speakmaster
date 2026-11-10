import test from "node:test";
import assert from "node:assert/strict";
import { rmsEnvelope, detectPauses, analyzeSpeech, speechVerdict } from "../js/engine/audio.js";

function synth(durationSec, { freq = 220, sampleRate = 8000, gaps = [] } = {}) {
  const n = Math.floor(durationSec * sampleRate);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    const inGap = gaps.some(([a, b]) => t >= a && t < b);
    samples[i] = inGap ? 0 : Math.sin(2 * Math.PI * freq * t) * 0.8;
  }
  return { samples, sampleRate, durationSec };
}

test("rmsEnvelope：静音段接近 0，有声段接近 1", () => {
  const { samples } = synth(4, { gaps: [[1, 2]] });
  const env = rmsEnvelope(samples, 100);
  assert.equal(env.length, 100);
  const mid = env[49]; // ~1.96s 在静音段
  assert.ok(mid < 0.15, "静音段包络应接近 0");
  const voiced = env[10]; // ~0.4s 有声
  assert.ok(voiced > 0.6, "有声段包络应显著");
});

test("detectPauses：找到中间静音且忽略短抖动", () => {
  const env = new Float32Array(100);
  for (let i = 0; i < 100; i++) env[i] = 0.8;
  for (let i = 40; i < 55; i++) env[i] = 0.01; // 15 窗口长静音
  env[20] = 0.01; // 单窗抖动，不算
  const pauses = detectPauses(env, { threshold: 0.12, minWindows: 4 });
  assert.equal(pauses.length, 1);
  assert.ok(Math.abs(pauses[0].start - 40) <= 1);
});

test("analyzeSpeech：语速/犹豫/平稳判定", () => {
  const { samples } = synth(5, { gaps: [[1, 1.5], [2.5, 3], [4, 4.4]] });
  const env = rmsEnvelope(samples, 100);
  const m = analyzeSpeech({ envelope: env, durationSec: 5, wordCount: 10, windowSec: 0.05 });
  assert.ok(m.wpm > 70 && m.wpm < 210, `正常语速应落在区间，实际 ${m.wpm}`);
  assert.ok(m.pauseCount >= 3, "三次长静音应被记为犹豫");
  assert.equal(m.flags.hesitant, true);
  assert.equal(m.flags.ok, false);
});

test("analyzeSpeech：过慢/过快边界", () => {
  const { samples } = synth(10);
  const env = rmsEnvelope(samples, 100);
  const slow = analyzeSpeech({ envelope: env, durationSec: 10, wordCount: 8, windowSec: 0.1 });
  assert.equal(slow.flags.tooSlow, true, "10 秒读 8 词应判过慢");
  const fast = analyzeSpeech({ envelope: env, durationSec: 2, wordCount: 10, windowSec: 0.02 });
  assert.equal(fast.flags.tooFast, true, "2 秒读 10 词应判过快");
});

test("speechVerdict：生成人类可读反馈", () => {
  const notes = speechVerdict({ wpm: 120, pauseCount: 1, flags: { ok: true, tooSlow: false, tooFast: false, hesitant: false, monotone: false, tooShort: false } });
  assert.equal(notes.length, 1);
  assert.equal(notes[0].level, "ok");
  const hesitant = speechVerdict({ wpm: 100, pauseCount: 4, flags: { ok: false, tooSlow: false, tooFast: false, hesitant: true, monotone: false, tooShort: false } });
  assert.ok(hesitant.some(n => n.text.includes("停顿")));
});
