// 应用入口：路由 + 仪表盘 + 全局命名空间（供内联 onclick 与测试钩子）。
import * as store from "./store.js";
import { initDialogue, onMicClick, submitTurn, restart as restartDialogue, leaveRoom } from "./app/dialogue.js";
import { initRetell } from "./app/retell.js";
import { initClinic, submit as clinicSubmit, restart as clinicRestart, back as clinicBack } from "./app/clinic.js";
import { initPartner } from "./app/partner.js";
import { renderSkillsPage } from "./app/skills-page.js";
import { initSettings } from "./app/settings-page.js";
import { dueQueue, summarize } from "./engine/srs.js";
import { overallMastery, rankOf } from "./engine/skills.js";
import { SKILL_DEFS } from "./data/skills.js";
import { SCENARIOS } from "./data/scenarios.js";

const $ = (sel) => document.querySelector(sel);

const PAGES = ["home", "dialogue", "retell", "clinic", "partner", "skills", "settings"];

function showPage(page) {
  PAGES.forEach(p => {
    const el = $(`#page-${p}`);
    if (el) el.classList.toggle("active", p === page);
  });
  document.querySelectorAll(".nav-btn").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.page === page)
  );
  if (page === "skills") renderSkillsPage();
  if (page === "home") renderDashboard();
}

function renderDashboard() {
  const state = store.get();
  $("#dash-streak").textContent = `${state.profile.streak || 0} 天`;
  $("#dash-today").textContent = String(store.todayCount());
  const srs = summarize(state.srs);
  $("#dash-due").textContent = String(srs.due);
  const ratio = overallMastery(state.skills, SKILL_DEFS);
  const rank = rankOf(ratio);
  $("#dash-mastery").textContent = Math.round(ratio * 100) + "%";
  $("#dash-rank").textContent = `${rank.icon} ${rank.name}`;
  $("#dash-sessions").textContent = String(state.stats.sessions);
  renderTodayPlan(ratio, rank);
}

// 今日任务：到期复习项 + 按掌握度推荐下一个场景
function renderTodayPlan(ratio, rank) {
  const state = store.get();
  const due = dueQueue(state.srs, Date.now(), 30);
  const dueRetells = due.filter(id => id.startsWith("retell:")).length;
  const dueSounds = due.filter(id => id.startsWith("sound:")).length;

  const recommended = SCENARIOS.find(s => {
    const ids = [...new Set(s.beats.map(b => b.skillId))];
    const avg = ids.reduce((a, id) => a + (state.skills[id] ? state.skills[id].mastery : 0), 0) / ids.length;
    return avg < 0.6;
  });

  const items = [];
  const stuck = state.profile.stuck;
  if (stuck && Date.now() - (stuck.at || 0) < 7 * 86400000) {
    items.push(`<button class="plan-chip main" onclick="sm.showPage('partner')">🧑‍🤝‍🧑 上次在「${stuck.scenario}」卡关——约同学用语伴模式破局</button>`);
  }
  if (recommended) {
    items.push(`<button class="plan-chip main" onclick="sm.showPage('dialogue')">${recommended.icon} 推荐场景：${recommended.title} <i>${recommended.level}</i></button>`);
  }
  if (dueSounds) items.push(`<button class="plan-chip" onclick="sm.showPage('clinic')">🩺 发音复习 ${dueSounds} 项</button>`);
  if (dueRetells) items.push(`<button class="plan-chip" onclick="sm.showPage('retell')">🎧 复述复习 ${dueRetells} 项</button>`);
  if (!items.length) {
    items.push(`<span class="plan-empty">${ratio >= 0.85 ? "🏆 没有到期任务——大师也需要保持手感，随便挑个场景热热身" : "暂无到期任务，开一个新场景继续点亮技能雷达"}</span>`);
  }

  $("#today-plan").innerHTML =
    `<div class="plan-head">📋 今日任务 <span class="plan-rank">${rank.icon} 当前段位：${rank.name}（${Math.round(ratio * 100)}% → 大师 85%）</span></div>
     <div class="plan-chips">${items.join("")}</div>`;
}

function boot() {
  try {
    store.load();
    initDialogue();
    initRetell();
    initClinic();
    initPartner();
    initSettings();

    document.querySelectorAll(".nav-btn").forEach(btn =>
      btn.addEventListener("click", () => showPage(btn.dataset.page))
    );
    document.querySelectorAll("[data-goto]").forEach(btn =>
      btn.addEventListener("click", () => showPage(btn.dataset.goto))
    );

    $("#mic-button").addEventListener("click", onMicClick);
    $("#chat-input-send").addEventListener("click", () => {
      const input = $("#chat-input");
      const v = input.value.trim();
      if (v) { input.value = ""; submitTurn(v); }
    });
    $("#chat-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") $("#chat-input-send").click();
    });
    $("#room-exit").addEventListener("click", leaveRoom);
    $("#retell-exit").addEventListener("click", () => {
      $("#retell-stage").style.display = "none";
      $("#retell-picker").style.display = "grid";
    });
    $("#clinic-mic").addEventListener("click", clinicSubmit);
    $("#clinic-check").addEventListener("click", clinicSubmit);

    showPage("home");
  } catch (e) {
    window.__bootErr = String(e && e.stack || e);
    console.error("boot failed", e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

// 全局命名空间（内联 onclick + 测试/无麦克风回退）
window.sm = {
  dialogue: { submitTurn, restart: restartDialogue },
  clinic: { submit: clinicSubmit, restart: clinicRestart, back: clinicBack },
  showPage,
  store
};
