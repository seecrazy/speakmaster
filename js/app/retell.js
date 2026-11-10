// 复述训练：听一段 → 用自己的话复述 → 关键点覆盖评分 → 进 SRS。
import { RETELL_PASSAGES } from "../data/retells.js";
import { scoreRetell } from "../engine/scoring.js";
import { schedule, newItem } from "../engine/srs.js";
import { updateMastery } from "../engine/skills.js";
import { isAsrSupported, startListening } from "../speech/asr.js";
import { speak, stopSpeaking } from "../speech/tts.js";
import * as store from "../store.js";

const getSrsItem = store.getSrsItem;

const $ = (sel) => document.querySelector(sel);
let activePassage = null;

export function initRetell() {
  const list = $("#retell-picker");
  list.innerHTML = RETELL_PASSAGES.map(p => `
    <button class="retell-card" data-id="${p.id}">
      <span class="retell-title">${p.title}</span>
      <span class="scenario-meta">${p.level} · ${p.keyPoints.length} 个关键信息点</span>
    </button>
  `).join("");
  list.addEventListener("click", (e) => {
    const card = e.target.closest(".retell-card");
    if (card) openPassage(card.dataset.id);
  });
  $("#retell-play").onclick = playPassage;
  $("#retell-reveal").onclick = revealText;
  $("#retell-mic").onclick = () => capture(true);
  $("#retell-submit").onclick = () => capture(false);
}

function openPassage(id) {
  activePassage = RETELL_PASSAGES.find(p => p.id === id);
  $("#retell-picker").style.display = "none";
  $("#retell-stage").style.display = "block";
  $("#retell-text").textContent = "";
  $("#retell-text").classList.remove("show");
  $("#retell-result").innerHTML = `<p class="zh">先听 1–2 遍，再用自己的话复述。不要逐词背——换词表达也算对。</p>`;
  $("#retell-transcript").value = "";
  $("#retell-status").textContent = "";
  playPassage();
}

async function playPassage() {
  if (!activePassage) return;
  stopSpeaking();
  $("#retell-status").textContent = "🔊 播放中……";
  const s = store.get().settings;
  await speak(activePassage.en, { voiceURI: s.ttsVoice || undefined, rate: s.ttsRate || 1 });
  $("#retell-status").textContent = "";
}

function revealText() {
  const el = $("#retell-text");
  el.textContent = activePassage ? `${activePassage.en}\n\n${activePassage.zh}` : "";
  el.classList.add("show");
}

async function capture(useMic) {
  if (!activePassage) return;
  let transcript = $("#retell-transcript").value.trim();
  if (useMic) {
    if (!isAsrSupported()) {
      $("#retell-status").textContent = "当前浏览器不支持语音识别，请直接在输入框打字复述。";
      return;
    }
    $("#retell-mic").classList.add("listening");
    $("#retell-status").textContent = "🎙 正在聆听……请开始复述";
    try {
      transcript = await startListening({ timeoutMs: 20000 });
    } catch (e) {
      $("#retell-status").textContent = e.message === "no-speech" ? "没听到声音，再试一次" : "识别出错：" + e.message;
      return;
    } finally {
      $("#retell-mic").classList.remove("listening");
      $("#retell-status").textContent = "";
    }
    $("#retell-transcript").value = transcript;
  }
  if (!transcript) {
    $("#retell-status").textContent = "先听再复述，内容不能为空。";
    return;
  }
  grade(transcript);
}

function grade(transcript) {
  const result = scoreRetell(activePassage, transcript);

  // SRS：按分数分级入库
  const itemId = "retell:" + activePassage.id;
  const prev = getSrsItem(itemId) || newItem(itemId);
  const gradeVal = result.score >= 85 ? 2 : result.score >= 60 ? 1 : 0;
  store.putSrsItem(schedule(prev, gradeVal));

  // 技能：叙述
  const cur = store.get().skills["narrate"];
  store.applySkillUpdate("narrate", updateMastery(cur ? cur.mastery : 0, result.score / 100));
  store.get().stats.retells += 1;
  store.trackActivity(1);

  const points = result.results.map(r =>
    `<div class="kp ${r.covered ? "ok" : "miss"}">${r.covered ? "✅" : "⬜"} ${r.point}（${r.coveredGroups}/${r.totalGroups}）</div>`
  ).join("");
  const nextNote = gradeVal === 2 ? "已掌握，安排远期复习" : gradeVal === 1 ? "近期再来一次" : "10 分钟后建议重练";

  $("#retell-result").innerHTML = `
    <div class="score-big">${result.score} 分</div>
    <p class="zh">关键点覆盖 ${result.coverage}%（${result.coveredCount}/${result.total}）· ${nextNote}</p>
    ${points}
    <p class="zh" style="margin-top:10px;">你说的：${transcript}</p>
  `;
}
