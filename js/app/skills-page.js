// 技能页：段位认证 + 雷达图（canvas 手绘）+ 分组技能条。
import { SKILL_DEFS } from "../data/skills.js";
import { radarData, masteryLabel, overallMastery, rankOf } from "../engine/skills.js";
import * as store from "../store.js";

const $ = (sel) => document.querySelector(sel);

export function renderSkillsPage() {
  const state = store.get();
  const data = radarData(SKILL_DEFS, state.skills);
  drawRadar($("#radar"), data);

  const ratio = overallMastery(state.skills, SKILL_DEFS);
  const rank = rankOf(ratio);
  const masteredCount = SKILL_DEFS.filter(d => state.skills[d.id] && state.skills[d.id].mastery >= 0.85).length;
  $("#skill-rank").innerHTML =
    `${rank.icon} <b>${rank.name}</b> · 总掌握度 ${Math.round(ratio * 100)}%（大师线 85%）
     <span class="rank-sub">${rank.desc} · 已达"掌握"的技能 ${masteredCount}/${SKILL_DEFS.length}</span>`;

  const groups = {};
  for (const def of SKILL_DEFS) {
    if (!groups[def.group]) groups[def.group] = [];
    groups[def.group].push(def);
  }
  $("#skill-groups").innerHTML = Object.entries(groups).map(([group, defs]) => `
    <div class="skill-group">
      <h3>${group}</h3>
      ${defs.map(def => {
        const m = state.skills[def.id];
        const pct = m ? Math.round(m.mastery * 100) : 0;
        return `
          <div class="skill-row" title="${def.zh}">
            <span class="skill-name">${def.name}</span>
            <div class="skill-bar"><div class="skill-fill" style="width:${pct}%"></div></div>
            <span class="skill-pct">${pct}% <i>${masteryLabel(m ? m.mastery : 0)}</i></span>
          </div>
        `;
      }).join("")}
    </div>
  `).join("");
}

function drawRadar(canvas, data) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width = canvas.offsetWidth * 2;
  const H = canvas.height = canvas.offsetHeight * 2;
  ctx.scale(1, 1);
  const cx = W / 2, cy = H / 2;
  const R = Math.min(W, H) / 2 - 60;
  const n = data.length;

  const point = (i, r) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const styles = getComputedStyle(document.documentElement);
  const border = styles.getPropertyValue("--border").trim() || "#3b4552";
  const accent = styles.getPropertyValue("--accent").trim() || "#e07a5f";
  const ink = styles.getPropertyValue("--ink").trim() || "#e8edf2";

  // 网格
  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  for (let ring = 1; ring <= 4; ring++) {
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const [x, y] = point(i % n, (R * ring) / 4);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  for (let i = 0; i < n; i++) {
    const [x, y] = point(i, R);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // 掌握度多边形
  ctx.beginPath();
  data.forEach((d, i) => {
    const [x, y] = point(i, R * Math.max(0.02, d.mastery));
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = accent + "44";
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.stroke();

  // 标签
  ctx.fillStyle = ink;
  ctx.font = "22px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  data.forEach((d, i) => {
    const [x, y] = point(i, R + 34);
    ctx.fillText(d.group, x, y);
  });
}
