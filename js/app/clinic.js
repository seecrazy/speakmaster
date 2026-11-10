// 发音诊所：最小对判别 + 目标句跟读 + 录音级纠音（波形/语速/停顿 + A/B 回放）。
import { PHONEME_SOUNDS } from "../data/phonemes.js";
import { normalize, tokenize, scoreShadow } from "../engine/scoring.js";
import { rmsEnvelope, analyzeSpeech, speechVerdict } from "../engine/audio.js";
import { schedule, newItem } from "../engine/srs.js";
import { updateMastery } from "../engine/skills.js";
import { isAsrSupported, startListening } from "../speech/asr.js";
import { speak, stopSpeaking } from "../speech/tts.js";
import { isRecordingSupported, startRecording, stopRecording, decodeRecording, playBlob } from "../speech/recorder.js";
import * as store from "../store.js";

const getSrsItem = store.getSrsItem;

const $ = (sel) => document.querySelector(sel);
let active = null;
let pairIndex = 0;
let results = [];   // { pair, heard: "target"|"confused"|"none" }
let drillDone = null;
let lastBlob = null;
let recording = false;

export function initClinic() {
  const list = $("#clinic-picker");
  list.innerHTML = PHONEME_SOUNDS.map(s => {
    const m = store.get().skills[s.skillId];
    const pct = m ? Math.round(m.mastery * 100) : 0;
    return `
      <button class="sound-card" data-id="${s.id}">
        <span class="sound-ipa">${s.ipa}</span>
        <span class="sound-name">${s.name}</span>
        <span class="sound-mastery">${pct}%</span>
      </button>
    `;
  }).join("");
  list.addEventListener("click", (e) => {
    const card = e.target.closest(".sound-card");
    if (card) openSound(card.dataset.id);
  });
  $("#clinic-next").onclick = nextStep;
  $("#clinic-model").onclick = replayModel;
  $("#clinic-record").onclick = onRecordClick;
  $("#clinic-playback").onclick = () => playBlob(lastBlob);
  if (!isRecordingSupported()) {
    const rec = $("#clinic-record");
    if (rec) rec.style.display = "none";
  }
}

function resetRecordingUI() {
  lastBlob = null;
  recording = false;
  const recBtn = $("#clinic-record");
  if (!recBtn) return;
  recBtn.textContent = "⏺ 录音跟读";
  recBtn.classList.remove("listening");
  $("#clinic-playback").style.display = "none";
  $("#clinic-wave").style.display = "none";
  $("#clinic-metrics").innerHTML = "";
}

function replayModel() {
  if (!active) return;
  const s = store.get().settings;
  const line = pairIndex < active.minimalPairs.length
    ? active.minimalPairs[pairIndex][active.targetSide]
    : active.drill;
  speak(line, { voiceURI: s.ttsVoice || undefined, rate: 0.9 * (s.ttsRate || 1) });
}

// 录音流程：第一次点=开始，第二次点=停止并分析。
// recorder.startRecording() 返回的 promise 在 stop 时 resolve(blob)，这里保存引用。
let recordingPromise = null;

async function onRecordClick() {
  if (!active) return;
  if (!recording) {
    resetRecordingUI();
    recordingPromise = startRecording({ maxMs: 8000 });
    recordingPromise.catch(e => {
      $("#clinic-status").textContent = e.message === "mic-denied"
        ? "麦克风权限被拒绝，请在地址栏允许"
        : "录音启动失败：" + e.message;
    });
    recording = true;
    const btn = $("#clinic-record");
    btn.textContent = "⏹ 停止录音";
    btn.classList.add("listening");
    $("#clinic-status").textContent = "🔴 录音中……念完点停止（最长 8 秒）";
    return;
  }
  recording = false;
  const btn = $("#clinic-record");
  btn.textContent = "⏺ 录音跟读";
  btn.classList.remove("listening");
  $("#clinic-status").textContent = "⏳ 分析中……";
  stopRecording();
  try {
    const blob = await recordingPromise;
    lastBlob = blob;
    await analyzeRecording(blob);
  } catch (e) {
    $("#clinic-status").textContent = "录音失败：" + e.message;
  }
}

async function analyzeRecording(blob) {
  const { samples, durationSec } = await decodeRecording(blob);
  const envelope = rmsEnvelope(samples, 100);
  const wordCount = pairIndex < active.minimalPairs.length ? 1 : active.drillWords.length;
  const metrics = analyzeSpeech({ envelope, durationSec, wordCount, windowSec: durationSec / 100 });

  drawWave($("#clinic-wave"), envelope, metrics.pauses);
  $("#clinic-wave").style.display = "block";
  $("#clinic-playback").style.display = "";
  const notes = speechVerdict(metrics);
  $("#clinic-metrics").innerHTML = `
    <div class="metric-row"><b>${durationSec.toFixed(1)}s</b><span>时长</span></div>
    <div class="metric-row"><b>${wordCount === 1 ? "—" : metrics.wpm + " wpm"}</b><span>语速${wordCount === 1 ? "（单词不适用）" : ""}</span></div>
    <div class="metric-row"><b>${metrics.pauseCount}</b><span>明显停顿</span></div>
    ${notes.map(n => `<div class="metric-note ${n.level}">${n.level === "ok" ? "✅" : n.level === "warn" ? "⚠️" : "💡"} ${n.text}</div>`).join("")}
    <div class="metric-note info">🎧 对比听：先点「🔊 再听示范」，再点「▶️ 听我的录音」，差异自己最听得出来。</div>
  `;
  $("#clinic-status").textContent = "录音分析完成（听感对比是最有效的纠音手段）";
}

function drawWave(canvas, envelope, pauses) {
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue("--accent").trim() || "#ff7a59";
  const border = styles.getPropertyValue("--border").trim() || "#323d4a";
  const ink = styles.getPropertyValue("--ink").trim() || "#e8edf2";
  const W = canvas.width = canvas.offsetWidth * 2;
  const H = canvas.height = 160;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = "rgba(224,108,108,.12)";
  for (const p of pauses) {
    ctx.fillRect((p.start / envelope.length) * W, 0, ((p.end - p.start + 1) / envelope.length) * W, H);
  }

  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, H / 2);
  ctx.lineTo(W, H / 2);
  ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < envelope.length; i++) {
    const x = (i / (envelope.length - 1)) * W;
    const y = H / 2 - (envelope[i] * (H / 2 - 10));
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = ink;
  ctx.font = "20px -apple-system, sans-serif";
  ctx.fillText("你的声音能量（红色底 = 停顿）", 10, 24);
}

function openSound(id) {
  active = PHONEME_SOUNDS.find(s => s.id === id);
  pairIndex = 0;
  results = [];
  drillDone = null;
  $("#clinic-picker").style.display = "none";
  $("#clinic-stage").style.display = "block";
  $("#sound-title").textContent = `${active.name} ${active.ipa}`;
  $("#sound-explain").textContent = active.explain;
  nextStep();
}

function nextStep() {
  stopSpeaking();
  resetRecordingUI();
  const s = store.get().settings;
  if (pairIndex < active.minimalPairs.length) {
    const pair = active.minimalPairs[pairIndex];
    $("#clinic-instruction").textContent = `第 ${pairIndex + 1}/${active.minimalPairs.length} 组：听提示，然后说出这个词 —— ${pair[active.targetSide].toUpperCase()}`;
    $("#clinic-input").value = "";
    speak(`Say: ${pair[active.targetSide]}. ${pair[active.targetSide]}`, { voiceURI: s.ttsVoice || undefined, rate: 0.9 * (s.ttsRate || 1) });
    $("#clinic-status").textContent = "";
  } else if (!drillDone) {
    $("#clinic-instruction").textContent = "最后一关：跟读这句话";
    $("#clinic-input").value = "";
    speak(active.drill, { voiceURI: s.ttsVoice || undefined, rate: 0.9 * (s.ttsRate || 1) });
    $("#clinic-status").textContent = "";
  } else {
    finish();
  }
}

async function capture() {
  if (!active) return;
  const typed = $("#clinic-input").value.trim();
  let transcript = typed;
  if (!typed) {
    if (!isAsrSupported()) {
      $("#clinic-status").textContent = "此浏览器不支持语音识别，可把听到的词打在输入框。";
      return;
    }
    $("#clinic-mic").classList.add("listening");
    try {
      transcript = await startListening({ timeoutMs: 8000 });
    } catch (e) {
      $("#clinic-status").textContent = e.message === "no-speech" ? "没听到，再试一次" : "识别出错：" + e.message;
      return;
    } finally {
      $("#clinic-mic").classList.remove("listening");
    }
  }
  judge(transcript);
}

function judge(transcript) {
  const text = " " + normalize(transcript) + " ";
  if (pairIndex < active.minimalPairs.length) {
    const pair = active.minimalPairs[pairIndex];
    const target = pair[active.targetSide];
    const confuser = pair[1 - active.targetSide];
    const heardTarget = text.includes(" " + target + " ");
    const heardConfused = text.includes(" " + confuser + " ");
    const verdict = heardTarget && !heardConfused ? "target" : heardConfused && !heardTarget ? "confused" : "none";
    results.push({ pair, heard: verdict, transcript });
    const note = verdict === "target"
      ? `✅ 正确：识别为 ${target}`
      : verdict === "confused"
        ? `❌ 混淆：你说成了 ${confuser}（应为 ${target}）`
        : `⚠️ 没听清（识别为 "${transcript}"）`;
    $("#clinic-status").textContent = note;
    pairIndex++;
    setTimeout(nextStep, 1400);
  } else {
    // 跟读句：评分 + 目标词是否被识别
    const shadow = scoreShadow(active.drill, transcript);
    const heardWords = new Set(tokenize(transcript));
    const targetHits = active.drillWords.filter(w => heardWords.has(normalize(w)));
    drillDone = { pct: shadow.pct, targetHits, transcript };
    $("#clinic-status").textContent = `跟读得分 ${shadow.pct}%，目标音词命中 ${targetHits.length}/${active.drillWords.length}`;
    setTimeout(finish, 1600);
  }
}

function finish() {
  const correct = results.filter(r => r.heard === "target").length;
  const total = results.length || 1;
  const pairAcc = correct / total;
  const drillAcc = drillDone ? drillDone.targetHits.length / active.drillWords.length : 0;
  const overall = Math.round((pairAcc * 0.6 + drillAcc * 0.4) * 100);

  const cur = store.get().skills[active.skillId];
  store.applySkillUpdate(active.skillId, updateMastery(cur ? cur.mastery : 0, overall / 100));

  const itemId = "sound:" + active.id;
  const prev = getSrsItem(itemId) || newItem(itemId);
  store.putSrsItem(schedule(prev, overall >= 85 ? 2 : overall >= 60 ? 1 : 0));

  store.get().stats.drills += 1;
  store.trackActivity(1);

  const confusions = results.filter(r => r.heard === "confused").map(r => r.pair.join(" ↔ "));
  $("#clinic-summary").innerHTML = `
    <h3>诊断结果：${overall} 分</h3>
    <p class="zh">最小对判别 ${correct}/${results.length} · 跟读得分 ${drillDone ? drillDone.pct + "%" : "—"}</p>
    ${confusions.length ? `<p class="zh warn">易混淆：${confusions.join("、")}</p>` : `<p class="zh ok">本组音暂无明显混淆 🎉</p>`}
    <p class="zh">已按掌握度安排复习：${overall >= 85 ? "远期" : overall >= 60 ? "近期" : "10 分钟后"}再见这个音。</p>
    <div class="controls">
      <button class="btn btn-ghost" onclick="sm.clinic.restart()">再测一次</button>
      <button class="btn" onclick="sm.clinic.back()">返回音素列表</button>
    </div>
  `;
  $("#clinic-summary").classList.add("show");
}

export function restart() {
  if (active) openSound(active.id);
}
export function back() {
  stopSpeaking();
  active = null;
  $("#clinic-stage").style.display = "none";
  $("#clinic-picker").style.display = "grid";
  $("#clinic-summary").classList.remove("show");
  initClinic();
}

export { capture as submit };
