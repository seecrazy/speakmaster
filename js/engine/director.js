// 导演引擎：把场景当"带目标树的状态机"来运行，实时调控难度。
//
// 设计要点（DESIGN.md §导演）：
// - 大脑是规则引擎（可测试、可离线），LLM 只当"配音演员"改写台词（可选）。
// - DDA：连续 2 轮顺利 → 难度 +1；连续 2 轮挣扎 → 进入支架模式（放慢+提示）。
// - 意外（incident）：完成 allowIncident 的节拍且难度 ≥2 时，作为"插入节拍"出现——
//   应对成功后继续原目标树；意外中给出的信息（如换奶）会填充信息槽，
//   后续被满足的节拍自动跳过，不重复追问。
// - 意外的应答判定走词组命中（accept），不走场景槽位。

import { evaluateTurn, extractSlots, normalize, tokenize, politenessScore } from "./scoring.js";

function phraseAcceptance(phrases, transcript) {
  const text = " " + normalize(transcript) + " ";
  const hit = (phrases || []).some(p => text.includes(" " + normalize(p) + " "));
  const polite = politenessScore(transcript);
  return hit ? Math.min(1, 0.75 + polite * 0.2) : polite * 0.15;
}

export class Director {
  constructor(scenario, opts = {}) {
    this.scenario = scenario;
    this.llm = opts.llm || null;
    this.state = {
      beatIndex: 0,
      difficulty: 1,        // 1..3
      smoothStreak: 0,
      struggleStreak: 0,
      scaffolding: false,
      incidentUsed: [],
      slots: {},            // 已收集信息槽（drink/size/...）
      log: [],              // {beatId, skillId, score, incident?}
      turns: 0,
      finished: false,
      peakDifficulty: 1
    };
  }

  get beat() {
    return this.scenario.beats[this.state.beatIndex];
  }

  opening() {
    const b = this.beat;
    return { say: b.bot, beatId: b.id, objective: b.objective, difficulty: this.state.difficulty };
  }

  // 主入口：用户说完一句，导演决定下一步。
  async handleUserInput(transcript) {
    if (this.state.finished) return this.debrief();
    this.state.turns++;
    const beat = this.beat;

    let turn;
    if (beat.type === "incident") {
      turn = {
        score: phraseAcceptance(beat.accept, transcript),
        filled: extractSlots(transcript, this.scenario.slots),
        missing: [],
        wordCount: tokenize(transcript).length
      };
    } else {
      turn = evaluateTurn(beat, transcript, this.scenario.slots);
    }
    Object.assign(this.state.slots, turn.filled);

    // 计分（支架提示下答对打折——真实掌握度存疑）
    const score = this.state.scaffolding ? turn.score * 0.7 : turn.score;
    this.state.log.push({ beatId: beat.id, skillId: beat.skillId, score, incident: beat.incident || null });

    // ---- DDA ----
    if (score >= 0.6) {
      this.state.smoothStreak++;
      this.state.struggleStreak = 0;
    } else {
      this.state.struggleStreak++;
      this.state.smoothStreak = 0;
    }
    if (this.state.smoothStreak >= 2 && this.state.difficulty < 3) {
      this.state.difficulty++;
      this.state.peakDifficulty = Math.max(this.state.peakDifficulty, this.state.difficulty);
      this.state.smoothStreak = 0;
    }
    if (this.state.struggleStreak >= 2) this.state.scaffolding = true;
    else if (score >= 0.6) this.state.scaffolding = false;

    // ---- 节拍推进 ----
    const beatDone = this.isBeatComplete(beat, turn);
    if (!beatDone) {
      return this.respondStay(beat, turn, score);
    }
    this.state.beatIndex++;
    if (this.state.beatIndex >= this.scenario.beats.length) {
      this.state.finished = true;
      return this.debrief();
    }
    return this.respondAdvance();
  }

  isBeatComplete(beat, turn) {
    if (beat.optional) return turn.wordCount > 0 || turn.score > 0;
    if (beat.type === "incident") return turn.score >= 0.6;
    return (beat.requires || []).every(slot => this.state.slots[slot] !== undefined);
  }

  // 留在本节拍：重问 + 必要时支架
  respondStay(beat, turn, score) {
    let say;
    if (this.state.scaffolding) {
      const hint = (beat.hints && beat.hints[0]) || "Take your time.";
      say = `${beat.bot} (You can say: "${hint}")`;
    } else {
      say = beat.bot;
    }
    return {
      say,
      botSlow: true,
      scaffold: this.state.scaffolding,
      hints: this.state.scaffolding ? (beat.hints || []) : [],
      beatId: beat.id,
      objective: beat.objective,
      difficulty: this.state.difficulty,
      score,
      missing: turn.missing,
      beatDone: false,
      done: false
    };
  }

  // 推进：先看刚完成的节拍是否触发意外，再跳过已被满足的节拍
  respondAdvance() {
    const completed = this.scenario.beats[this.state.beatIndex - 1];
    if (completed && completed.allowIncident) {
      const incident = this.pickIncident();
      if (incident) {
        this.state.incidentUsed.push(incident.id);
        const incidentBeat = {
          id: `${completed.id}+${incident.id}`,
          objective: incident.objective,
          bot: incident.bot,
          type: "incident",
          accept: incident.accept,
          hints: incident.hints,
          incident: incident.id,
          skillId: "respond-change"
        };
        const beats = [...this.scenario.beats];
        beats.splice(this.state.beatIndex, 0, incidentBeat);
        this.scenario = { ...this.scenario, beats };
        return {
          say: incidentBeat.bot,
          botSlow: false,
          incident: incident.id,
          incidentText: incident.zhs || "",
          beatId: incidentBeat.id,
          objective: incidentBeat.objective,
          difficulty: this.state.difficulty,
          beatDone: true,
          done: false
        };
      }
    }

    // 意外中已给过的信息，后续节拍不再重复追问
    while (this.beat && !this.beat.optional && this.beat.type !== "incident" &&
           (this.beat.requires || []).length > 0 &&
           (this.beat.requires).every(slot => this.state.slots[slot] !== undefined)) {
      this.state.log.push({ beatId: this.beat.id, skillId: this.beat.skillId, score: 1, auto: true });
      this.state.beatIndex++;
    }
    if (this.state.beatIndex >= this.scenario.beats.length) {
      this.state.finished = true;
      return this.debrief();
    }

    const next = this.beat;
    return {
      say: next.bot,
      botSlow: false,
      beatId: next.id,
      objective: next.objective,
      difficulty: this.state.difficulty,
      beatDone: true,
      done: false
    };
  }

  // 意外挑选：难度达标 + 未用过；高难度意外优先（顺利就该被针对）
  pickIncident() {
    if (this.state.difficulty < 2) return null;
    const pool = (this.scenario.incidents || []).filter(
      inc => !this.state.incidentUsed.includes(inc.id) &&
        (inc.minDifficulty || 2) <= this.state.difficulty
    );
    if (!pool.length) return null;
    pool.sort((a, b) => (b.minDifficulty || 2) - (a.minDifficulty || 2));
    return pool[0];
  }

  debrief() {
    const logs = this.state.log;
    const avg = logs.length ? logs.reduce((a, b) => a + b.score, 0) / logs.length : 0;
    return {
      done: true,
      debrief: {
        turns: this.state.turns,
        avgScore: Math.round(avg * 100),
        incidents: this.state.incidentUsed.length,
        peakDifficulty: this.state.peakDifficulty,
        difficulty: this.state.difficulty,
        logs,
        slots: { ...this.state.slots }
      }
    };
  }
}
