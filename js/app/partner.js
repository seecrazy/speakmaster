// 双人语伴模式：两个人面对面练同一个场景，App 只当提词卡。
// B（伙伴）念机器人台词，A（学习者）自由口头回应——没有识别、没有打分，
// 只有真实的人与人的对话；卡住时可以看参考表达，中途可以"加戏"注入意外。
import { SCENARIOS } from "../data/scenarios.js";
import { pickLine } from "../engine/director.js";
import { speak, stopSpeaking } from "../speech/tts.js";
import * as store from "../store.js";

const $ = (sel) => document.querySelector(sel);
let scenario = null;
let step = 0;          // 当前节拍索引
let revealed = false;  // 参考表达是否已展开
let usedIncidents = [];

export function initPartner() {
  const grid = $("#partner-picker");
  grid.innerHTML = SCENARIOS.map(s => `
    <button class="scenario-card" data-id="${s.id}">
      <span class="scenario-icon">${s.icon}</span>
      <span class="scenario-title">${s.title}</span>
      <span class="scenario-meta">${s.level} · 双人语伴</span>
      <span class="scenario-goal">${s.goal}</span>
    </button>
  `).join("");
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".scenario-card");
    if (card) startPartner(card.dataset.id);
  });
  $("#partner-next").onclick = nextStep;
  $("#partner-reveal").onclick = revealHint;
  $("#partner-incident").onclick = injectIncident;
  $("#partner-tts").onclick = playLine;
  $("#partner-exit").onclick = exitPartner;
  $("#partner-swap").onclick = () => { exitPartner(); $("#partner-picker").scrollIntoView(); };
}

function startPartner(id) {
  scenario = SCENARIOS.find(s => s.id === id);
  if (!scenario) return;
  step = 0;
  revealed = false;
  usedIncidents = [];
  $("#partner-picker").style.display = "none";
  $("#partner-stage").style.display = "block";
  $("#partner-title").textContent = `👥 ${scenario.title} · 双人练习`;
  $("#partner-partner-name").textContent = `B 扮演：${scenario.partner.name}（${scenario.partner.role}）`;
  renderStep();
}

function currentLine() {
  const line = $("#partner-line").dataset.raw || "";
  return line;
}

function renderStep(inc) {
  revealed = false;
  const beats = scenario.beats;
  const beat = beats[Math.min(step, beats.length - 1)];
  const line = inc ? inc.bot : pickLine(beat.bot);

  if (step >= beats.length) {
    finishPartner();
    return;
  }
  $("#partner-progress").textContent = `第 ${step + 1}/${beats.length} 步 · ${beat.objective}`;
  const lineEl = $("#partner-line");
  lineEl.textContent = line;
  lineEl.dataset.raw = line;
  $("#partner-hint").textContent = "";
  $("#partner-hint").style.display = "none";
  $("#partner-reveal").style.display = "";
  $("#partner-reveal").textContent = "💡 看参考表达";
  $("#partner-incident").style.display = usedIncidents.length < scenario.incidents.length ? "" : "none";
  $("#partner-done").style.display = "none";
}

function nextStep() {
  stopSpeaking();
  step++;
  if (step >= scenario.beats.length) finishPartner();
  else renderStep();
}

function revealHint() {
  const beats = scenario.beats;
  const beat = beats[Math.min(step, beats.length - 1)];
  const hintEl = $("#partner-hint");
  if (revealed) { hintEl.style.display = "none"; $("#partner-reveal").textContent = "💡 看参考表达"; revealed = false; return; }
  const hints = beat.hints || [];
  const last = $("#partner-line").dataset.hint;
  const text = last || (hints[0] || "自由发挥就好——重点是说出口");
  hintEl.textContent = `A 可以这样说：${text}`;
  hintEl.style.display = "block";
  $("#partner-reveal").textContent = "🙈 收起参考";
  revealed = true;
}

// 加戏：随机注入一个未用过的意外（B 念意外台词，A 应对，参考 = 意事 hints）
function injectIncident() {
  const pool = scenario.incidents.filter(i => !usedIncidents.includes(i.id));
  if (!pool.length) return;
  const inc = pool[Math.floor(Math.random() * pool.length)];
  usedIncidents.push(inc.id);
  const lineEl = $("#partner-line");
  lineEl.textContent = `⚡ ${pickLine(inc.bot)}`;
  lineEl.dataset.hint = (inc.hints && inc.hints[0]) || "";
  $("#partner-progress").textContent = `🎯 加戏：${inc.objective}（${inc.zhs}）`;
  $("#partner-incident").style.display = usedIncidents.length < scenario.incidents.length ? "" : "none";
}

function playLine() {
  const line = currentLine().replace(/^⚡ /, "");
  const s = store.get().settings;
  speak(line, { voiceURI: s.ttsVoice || undefined, rate: 0.9 * (s.ttsRate || 1) });
}

function finishPartner() {
  $("#partner-progress").textContent = "🎉 完成";
  $("#partner-line").textContent = "这一轮双人练习完成！交换角色再来一遍效果最好。";
  $("#partner-line").dataset.hint = "";
  $("#partner-hint").style.display = "none";
  $("#partner-reveal").style.display = "none";
  $("#partner-incident").style.display = "none";
  $("#partner-done").style.display = "block";
  $("#partner-swap").style.display = "";
  store.trackActivity(1);
  store.get().stats.sessions += 1;
  store.save();
}

function exitPartner() {
  stopSpeaking();
  scenario = null;
  step = 0;
  $("#partner-stage").style.display = "none";
  $("#partner-picker").style.display = "grid";
}
