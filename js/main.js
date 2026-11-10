// 应用入口：路由 + 仪表盘 + 全局命名空间（供内联 onclick 与测试钩子）。
import * as store from "./store.js";
import { initDialogue, onMicClick, submitTurn, restart as restartDialogue, leaveRoom } from "./app/dialogue.js";
import { initRetell } from "./app/retell.js";
import { initClinic, submit as clinicSubmit, restart as clinicRestart, back as clinicBack } from "./app/clinic.js";
import { renderSkillsPage } from "./app/skills-page.js";
import { initSettings } from "./app/settings-page.js";
import { dueQueue, summarize } from "./engine/srs.js";

const $ = (sel) => document.querySelector(sel);

const PAGES = ["home", "dialogue", "retell", "clinic", "skills", "settings"];

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
  const avg = Object.values(state.skills);
  const avgMastery = avg.length
    ? Math.round((avg.reduce((a, b) => a + b.mastery, 0) / avg.length) * 100)
    : 0;
  $("#dash-mastery").textContent = avgMastery + "%";
  $("#dash-sessions").textContent = String(state.stats.sessions);
}

function boot() {
  try {
    store.load();
    initDialogue();
    initRetell();
    initClinic();
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
