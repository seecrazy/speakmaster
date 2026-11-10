// 发音诊所：最小对判别 + 目标句跟读，诊断 5 组高频混淆音。
import { PHONEME_SOUNDS } from "../data/phonemes.js";
import { normalize, tokenize, scoreShadow } from "../engine/scoring.js";
import { schedule, newItem } from "../engine/srs.js";
import { updateMastery } from "../engine/skills.js";
import { isAsrSupported, startListening } from "../speech/asr.js";
import { speak, stopSpeaking } from "../speech/tts.js";
import * as store from "../store.js";

const getSrsItem = store.getSrsItem;

const $ = (sel) => document.querySelector(sel);
let active = null;
let pairIndex = 0;
let results = [];   // { pair, heard: "target"|"confused"|"none" }
let drillDone = null;

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
