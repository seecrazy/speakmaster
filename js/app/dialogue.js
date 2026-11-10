// 对话训练页：场景选择 → 与 AI 陪练自由对话（导演驱动）→ 复盘。
import { SCENARIOS } from "../data/scenarios.js";
import { SKILL_DEFS } from "../data/skills.js";
import { Director } from "../engine/director.js";
import { performanceBySkill, updateMastery } from "../engine/skills.js";
import { isAsrSupported, startListening } from "../speech/asr.js";
import { speak, stopSpeaking } from "../speech/tts.js";
import { createProvider, rewriteInstruction } from "../llm/provider.js";
import * as store from "../store.js";

let director = null;
let scenario = null;
let busy = false;

const $ = (sel) => document.querySelector(sel);

export function initDialogue() {
  const grid = $("#dialogue-picker");
  grid.innerHTML = SCENARIOS.map(s => `
    <button class="scenario-card" data-id="${s.id}">
      <span class="scenario-icon">${s.icon}</span>
      <span class="scenario-title">${s.title}</span>
      <span class="scenario-meta">${s.level} · ${s.beats.length} 个目标 · ${s.incidents.length} 个意外</span>
      <span class="scenario-goal">${s.goal}</span>
    </button>
  `).join("");
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".scenario-card");
    if (card) startScenario(card.dataset.id);
  });
}

async function startScenario(id) {
  scenario = SCENARIOS.find(s => s.id === id);
  if (!scenario) return;
  const cfg = store.get().settings.llm;
  director = new Director(scenario, { llm: createProvider(cfg) });
  busy = false;

  $("#dialogue-picker").style.display = "none";
  $("#dialogue-room").style.display = "flex";
  $("#room-partner").textContent = `${scenario.partner.name} · ${scenario.partner.role}`;
  $("#room-title").textContent = scenario.title;
  $("#chat-log").innerHTML = "";
  $("#debrief").classList.remove("show");
  updateDirectorBadge();

  const opening = director.opening();
  await botSay(opening.say);
}

async function botSay(line, context = {}) {
  appendBubble("bot", line);
  // LLM 可用则改写台词（失败静默回退原文）
  let finalLine = line;
  if (director && director.llm && context.rewritable) {
    try {
      finalLine = await director.llm.rewriteLine(
        rewriteInstruction(scenario, scenario.partner, line, context)
      );
      // 状态提示/支架括号内容不进 TTS
    } catch (e) { finalLine = line; }
  }
  const ttsLine = finalLine.replace(/\(You can say:.*?\)\s*$/i, "").trim();
  if (ttsLine) {
    await speak(ttsLine, {
      voiceURI: store.get().settings.ttsVoice || undefined,
      rate: (store.get().settings.ttsRate || 1) * (context.botSlow ? 0.8 : 1) * scenario.partner.rate,
      pitch: scenario.partner.pitch
    });
  }
}

function appendBubble(who, text) {
  const log = $("#chat-log");
  const el = document.createElement("div");
  el.className = "bubble " + who;
  el.textContent = text;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}

function appendNotice(text) {
  const log = $("#chat-log");
  const el = document.createElement("div");
  el.className = "notice";
  el.textContent = text;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}

function updateDirectorBadge(extra = "") {
  if (!director) return;
  const d = director.state;
  $("#director-badge").innerHTML =
    `难度 ${["Ⅰ", "Ⅱ", "Ⅲ"][d.difficulty - 1]}` +
    (d.scaffolding ? ` · <span class="warn">支架辅助</span>` : "") +
    (extra ? ` · ${extra}` : "");
  const obj = director.beat ? director.beat.objective : "";
  $("#beat-objective").textContent = obj ? `🎯 当前目标：${obj}` : "";
}

// 一次用户输入（麦克风或文本回退），驱动整个回合
export async function submitTurn(transcript) {
  if (!director || director.state.finished || busy) return;
  busy = true;
  try {
    appendBubble("user", transcript);
    const turn = await director.handleUserInput(transcript);
    updateDirectorBadge();
    renderHints(turn.hints || []);

    if (turn.done) {
      finishScenario(turn.debrief);
    } else {
      if (turn.incident) {
        appendNotice("⚡ 意外：" + (turn.incidentText || "出现了新情况"));
      }
      await botSay(turn.say, {
        rewritable: true,
        scaffolding: director.state.scaffolding,
        difficulty: director.state.difficulty,
        incident: turn.incident,
        botSlow: turn.botSlow
      });
      updateDirectorBadge();
    }
  } finally {
    busy = false;
  }
}

function renderHints(hints) {
  const box = $("#hint-chips");
  box.innerHTML = "";
  hints.forEach(h => {
    const chip = document.createElement("button");
    chip.className = "hint-chip";
    chip.textContent = h;
    chip.onclick = () => submitTurn(h);
    box.appendChild(chip);
  });
}

export async function onMicClick() {
  const status = $("#mic-status");
  if (!isAsrSupported()) {
    status.textContent = "当前浏览器不支持语音识别，请用 Chrome / Edge，或在下方输入回答。";
    return;
  }
  if (busy) return;
  const mic = $("#mic-button");
  mic.classList.add("listening");
  status.textContent = "🎙 正在聆听……说完停顿一秒";
  try {
    const transcript = await startListening();
    status.textContent = "";
    await submitTurn(transcript);
  } catch (e) {
    const msg = {
      "no-speech": "没听到声音，再试一次",
      "listening-timeout": "超时了，再试一次",
      "not-allowed": "麦克风权限被拒绝，请在地址栏允许",
      "network": "语音识别需要网络",
      "audio-capture": "没找到麦克风"
    }[e.message] || ("识别出错：" + e.message);
    status.textContent = msg;
  } finally {
    mic.classList.remove("listening");
  }
}

function finishScenario(debrief) {
  // 技能更新
  const perf = performanceBySkill(debrief.logs);
  for (const [skillId, performance] of Object.entries(perf)) {
    const cur = store.get().skills[skillId];
    const mastery = cur ? cur.mastery : 0;
    store.applySkillUpdate(skillId, updateMastery(mastery, performance));
  }
  store.get().stats.sessions += 1;
  store.get().stats.turns += debrief.turns;
  store.trackActivity(1);
  store.save();

  const skillNames = Object.keys(perf).map(id => {
    const def = SKILL_DEFS.find(d => d.id === id);
    return def ? def.name : id;
  });
  $("#debrief").innerHTML = `
    <h3>🎉 场景完成：${scenario.title}</h3>
    <div class="debrief-grid">
      <div><b>${debrief.turns}</b><span>轮对话</span></div>
      <div><b>${debrief.avgScore}%</b><span>平均表现</span></div>
      <div><b>${debrief.incidents}</b><span>处理意外</span></div>
      <div><b>${["Ⅰ", "Ⅱ", "Ⅲ"][debrief.peakDifficulty - 1]}</b><span>难度峰值</span></div>
    </div>
    <p class="zh">本次训练的技能：${skillNames.join("、") || "—"}</p>
    <div class="controls">
      <button class="btn" onclick="document.querySelector('#dialogue-room').style.display='none';document.querySelector('#dialogue-picker').style.display='grid';">返回场景列表</button>
      <button class="btn btn-ghost" onclick="sm.dialogue.restart()">再来一次</button>
    </div>
  `;
  $("#debrief").classList.add("show");
  updateDirectorBadge("已完成");
}

export function restart() {
  if (scenario) startScenario(scenario.id);
}

export function leaveRoom() {
  stopSpeaking();
  director = null;
  $("#dialogue-room").style.display = "none";
  $("#dialogue-picker").style.display = "grid";
}
