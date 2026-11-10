// 全局状态 + localStorage 持久化 + 导出/导入（解决数据孤岛的第一步）
const STORAGE_KEY = "speakmaster-v1";

const defaults = () => ({
  profile: { streak: 0, lastActiveDay: "", activity: {} },
  skills: {},        // { [skillId]: { mastery, reps, lastAt } }
  srs: {},           // { [itemId]: SRS item }，itemId 前缀区分类型: retell:/sound:/line:
  stats: { sessions: 0, turns: 0, retells: 0, drills: 0 },
  settings: {
    ttsVoice: "",
    ttsRate: 1,
    llm: { baseUrl: "", apiKey: "", model: "" }
  }
});

let state = defaults();

export function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state = {
        ...defaults(),
        ...parsed,
        profile: { ...defaults().profile, ...(parsed.profile || {}) },
        settings: { ...defaults().settings, ...(parsed.settings || {}), llm: { ...defaults().settings.llm, ...((parsed.settings && parsed.settings.llm) || {}) } }
      };
    }
  } catch (e) {
    console.warn("load state failed", e);
  }
  return state;
}

export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("save state failed", e);
  }
}

export function get() { return state; }

export function reset() {
  state = defaults();
  save();
}

// ---- 打卡 ----
function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function trackActivity(count = 1) {
  const today = dayKey();
  const p = state.profile;
  if (p.lastActiveDay !== today) {
    const yesterday = dayKey(new Date(Date.now() - 86400000));
    p.streak = p.lastActiveDay === yesterday ? p.streak + 1 : 1;
    p.lastActiveDay = today;
  }
  p.activity[today] = (p.activity[today] || 0) + count;
  const keys = Object.keys(p.activity);
  if (keys.length > 400) keys.sort().slice(0, keys.length - 400).forEach(k => delete p.activity[k]);
  save();
}

export function todayCount() {
  return state.profile.activity[dayKey()] || 0;
}

// ---- 技能 ----
export function recordSkillPerformances(perfBySkill) {
  for (const [skillId, performance] of Object.entries(perfBySkill)) {
    const cur = state.skills[skillId] || { mastery: 0, reps: 0, lastAt: 0 };
    state.skills[skillId] = cur; // 由 skills.updateMastery 在外部计算后写入
  }
  save();
}

export function applySkillUpdate(skillId, newMastery) {
  const cur = state.skills[skillId] || { mastery: 0, reps: 0, lastAt: 0 };
  cur.mastery = newMastery;
  cur.reps += 1;
  cur.lastAt = Date.now();
  state.skills[skillId] = cur;
}

// ---- SRS ----
export function srsItems() { return state.srs; }
export function putSrsItem(item) { state.srs[item.id] = item; save(); }
export function getSrsItem(id) { return state.srs[id] || null; }

// ---- 导出/导入 ----
export function exportData() {
  return JSON.stringify(state, null, 2);
}

export function importData(json) {
  const parsed = JSON.parse(json);
  if (!parsed || typeof parsed !== "object" || !parsed.profile) throw new Error("格式不正确");
  state = { ...defaults(), ...parsed };
  save();
  return true;
}
