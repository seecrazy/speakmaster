// 功能技能模型：口语能力拆成原子技能，掌握度按表现更新。
// mastery ∈ [0,1]。成功按"越接近 1 增量越小"更新（类 Elo），失败衰减。

// performance ∈ [0,1]，低于 FAIL_THRESHOLD 视为失败
const FAIL_THRESHOLD = 0.5;

export function updateMastery(current, performance) {
  const base = typeof current === "number" ? current : 0;
  if (performance < FAIL_THRESHOLD) {
    return Math.max(0, base * 0.85);
  }
  const gain = 0.2 * (1 - base) * performance;
  return Math.min(1, base + gain);
}

export function masteryLabel(mastery) {
  if (mastery >= 0.85) return "掌握";
  if (mastery >= 0.6) return "熟练";
  if (mastery >= 0.3) return "入门";
  if (mastery > 0) return "接触";
  return "未开始";
}

export function masteryLevel(mastery) {
  if (mastery >= 0.85) return 4;
  if (mastery >= 0.6) return 3;
  if (mastery >= 0.3) return 2;
  if (mastery > 0) return 1;
  return 0;
}

// 雷达图数据：按功能组聚合平均掌握度
export function radarData(skillDefs, skillState) {
  const groups = {};
  for (const def of skillDefs) {
    if (!groups[def.group]) groups[def.group] = [];
    groups[def.group].push(skillState[def.id] ? skillState[def.id].mastery : 0);
  }
  return Object.entries(groups).map(([group, values]) => ({
    group,
    mastery: values.reduce((a, b) => a + b, 0) / values.length
  }));
}

// 一次对话/练习的成绩单 → 各技能的表现映射
// beatLogs: [{ beat, score }]，beat.skillId ∈ skillDefs[].id
export function performanceBySkill(beatLogs) {
  const bySkill = {};
  for (const log of beatLogs) {
    if (!log.skillId) continue;
    if (!bySkill[log.skillId]) bySkill[log.skillId] = [];
    bySkill[log.skillId].push(log.score);
  }
  const out = {};
  for (const [skillId, scores] of Object.entries(bySkill)) {
    out[skillId] = scores.reduce((a, b) => a + b, 0) / scores.length;
  }
  return out;
}
