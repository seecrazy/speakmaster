// 声学分析引擎（纯函数，可在 node 单测）：能量包络 → 语速/停顿/能量起伏指标。
// 这不是音素级对齐（那需要重型模型），而是录音级纠音的实用层：
// 让学习者"听见自己"（回放）+ "看见自己"（波形/停顿）+ 量化节奏。

// 计算 RMS 能量包络：samples → windows 个 0..1 归一化值
export function rmsEnvelope(samples, windows = 100) {
  const n = samples.length;
  if (!n) return new Float32Array(windows);
  const out = new Float32Array(windows);
  const size = Math.max(1, Math.floor(n / windows));
  let max = 1e-9;
  for (let w = 0; w < windows; w++) {
    const start = w * size;
    const end = Math.min(n, start + size);
    let sum = 0;
    for (let i = start; i < end; i++) sum += samples[i] * samples[i];
    const rms = Math.sqrt(sum / Math.max(1, end - start));
    out[w] = rms;
    if (rms > max) max = rms;
  }
  for (let w = 0; w < windows; w++) out[w] = out[w] / max;
  return out;
}

// 停顿检测：能量低于阈值且持续 ≥ minWindows 的区段
export function detectPauses(envelope, { threshold = 0.12, minWindows = 4 } = {}) {
  const pauses = [];
  let start = -1;
  for (let i = 0; i <= envelope.length; i++) {
    const low = i < envelope.length && envelope[i] < threshold;
    if (low && start < 0) start = i;
    if (!low && start >= 0) {
      if (i - start >= minWindows) pauses.push({ start, end: i - 1 });
      start = -1;
    }
  }
  return pauses;
}

// 综合声学指标：语速（wpm）、停顿、能量起伏（重音动态的代理）
// durationSec: 录音时长；wordCount: 目标句词数；windowSec: 每个包络窗口的秒数
export function analyzeSpeech({ envelope, durationSec, wordCount, windowSec }) {
  const pauses = detectPauses(envelope, { threshold: 0.12, minWindows: Math.max(2, Math.round(0.3 / Math.max(windowSec, 1e-4))) });
  const pauseSec = pauses.length * (windowSec * 4); // 粗略：按最少窗口数估计

  const speechSec = Math.max(0.5, durationSec - Math.min(pauseSec, durationSec * 0.6));
  const wpm = wordCount > 0 ? Math.round((wordCount / speechSec) * 60) : 0;

  let mean = 0;
  for (const v of envelope) mean += v;
  mean /= envelope.length;
  let variance = 0;
  for (const v of envelope) variance += (v - mean) * (v - mean);
  variance /= envelope.length;
  const energyStd = Math.sqrt(variance);

  const flags = {
    tooSlow: wpm > 0 && wpm < 70,
    tooFast: wpm > 210,
    hesitant: pauses.length >= 3,
    monotone: energyStd < 0.12,
    tooShort: durationSec < 1,
    ok: false
  };
  flags.ok = !flags.tooSlow && !flags.tooFast && !flags.hesitant && !flags.tooShort;

  return { wpm, pauseCount: pauses.length, pauseSec: Math.round(pauseSec * 10) / 10, energyStd, pauses, flags };
}

export function speechVerdict(metrics) {
  const notes = [];
  if (metrics.flags.tooShort) notes.push({ level: "warn", text: "录音太短，重新读一遍完整句子" });
  if (metrics.flags.tooSlow) notes.push({ level: "warn", text: `语速 ${metrics.wpm} wpm 偏慢（目标 90–180），试着不打断地整句连读` });
  if (metrics.flags.tooFast) notes.push({ level: "warn", text: `语速 ${metrics.wpm} wpm 偏快（目标 90–180），留出重音和停顿` });
  if (metrics.flags.hesitant) notes.push({ level: "warn", text: `检测到 ${metrics.pauseCount} 次明显停顿，先把整句在心里过一遍再开口` });
  if (metrics.flags.monotone) notes.push({ level: "info", text: "能量起伏偏平（重音不够突出），把关键词读得比虚词更响" });
  if (metrics.flags.ok) notes.push({ level: "ok", text: `节奏不错：${metrics.wpm} wpm、${metrics.pauseCount} 次停顿` });
  return notes;
}
