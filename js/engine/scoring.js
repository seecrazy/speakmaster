// 评分引擎：无 LLM 时的本地语义评估。
// 1) 槽位抽取（对话导演用） 2) 关键点覆盖（复述模式用） 3) 词级对齐（跟读/最小对用）

export function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9' ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(text) {
  return normalize(text).split(" ").filter(Boolean);
}

// ---- 1) 槽位抽取：把自由口语映射到场景信息槽 ----
// lexicon.slots: { drink: ["latte","cappuccino",...], size: [...] }
export function extractSlots(transcript, slots) {
  const text = " " + normalize(transcript) + " ";
  const found = {};
  for (const [slot, words] of Object.entries(slots || {})) {
    // 别名支持 "regular coffee" 这类多词短语
    const sorted = [...words].sort((a, b) => b.length - a.length);
    for (const word of sorted) {
      if (text.includes(" " + word + " ") || text.includes(" " + word + "'s ")) {
        found[slot] = word;
        break;
      }
    }
  }
  return found;
}

const POLITENESS_MARKERS = ["please", "can i", "could i", "may i", "would you", "could you", "i'd like", "i would like", "thank"];

export function politenessScore(transcript) {
  const text = normalize(transcript);
  const hits = POLITENESS_MARKERS.filter(m => text.includes(m)).length;
  return Math.min(1, hits / 2);
}

// 评估一轮对话：beat.requires 是本节拍必须命中的槽位
export function evaluateTurn(beat, transcript, slots) {
  const filled = extractSlots(transcript, slots);
  const requires = beat.requires || [];
  const hits = requires.filter(slot => filled[slot] !== undefined);
  const missing = requires.filter(slot => filled[slot] === undefined);
  const wordCount = tokenize(transcript).length;

  let score = requires.length ? hits.length / requires.length : (wordCount > 0 ? 0.8 : 0);
  // 礼貌用语小幅加分（上限 1）
  score = Math.min(1, score + politenessScore(transcript) * 0.15);
  // 一词回应在需要完整句子的节拍上打折
  if (requires.length && wordCount < 2) score *= 0.6;

  return { score, filled, missing, wordCount };
}

// ---- 2) 关键点覆盖：复述模式 ----
// keyPoint: { point: "...", groups: [["seattle","washington"],["moved","relocated"]] }
// 每个 group 里任一词命中即该组覆盖；全部 group 覆盖则该关键点达成
export function scoreRetell(passage, transcript) {
  const text = normalize(transcript);
  const results = (passage.keyPoints || []).map(kp => {
    const coveredGroups = (kp.groups || []).filter(group =>
      group.some(alias => text.includes(normalize(alias)))
    );
    const covered = (kp.groups || []).length > 0 &&
      coveredGroups.length === (kp.groups || []).length;
    return { point: kp.point, covered, coveredGroups: coveredGroups.length, totalGroups: (kp.groups || []).length };
  });

  const coveredCount = results.filter(r => r.covered).length;
  const coverage = results.length ? coveredCount / results.length : 0;

  // 词汇重叠度作为次要信号
  const passageWords = new Set(tokenize(passage.en).filter(w => w.length > 3));
  const said = new Set(tokenize(transcript));
  let overlap = 0;
  for (const w of said) if (passageWords.has(w)) overlap++;
  const overlapRatio = passageWords.size ? overlap / passageWords.size : 0;

  // 总分 = 覆盖率 80% + 重叠 20%（鼓励换词表达，重叠满分不必）
  const score = Math.round(Math.min(100, coverage * 80 + Math.min(1, overlapRatio / 0.5) * 20));
  return { score, coverage: Math.round(coverage * 100), results, coveredCount, total: results.length };
}

// ---- 3) 词级对齐（跟读/最小对判别共用）----
export function alignWords(expected, said) {
  const a = tokenize(expected);
  const b = tokenize(said);
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  const ops = [];
  let i = a.length, j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
      ops.push({ type: a[i - 1] === b[j - 1] ? "ok" : "sub", word: a[i - 1], said: b[j - 1] });
      i--; j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.push({ type: "miss", word: a[i - 1] });
      i--;
    } else {
      ops.push({ type: "extra", word: b[j - 1] });
      j--;
    }
  }
  return ops.reverse();
}

export function scoreShadow(expected, said) {
  const ops = alignWords(expected, said);
  const matched = ops.filter(op => op.type === "ok").length;
  const total = tokenize(expected).length;
  const pct = total ? Math.round((matched / total) * 100) : 0;
  const problems = ops.filter(op => op.type !== "ok" && op.type !== "extra");
  return { pct, ops, problems };
}
