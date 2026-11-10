# SpeakMaster 设计文档

> 定位：口语陪练（sparring partner）——不是"内容容器"，而是"能力教练"。
> 前身项目 `../oralenglishmaster` 是教材网页化；本项目回答它的结构性缺席：**真实交互、即兴输出、精准纠音**。
> 配套：[进度记录](PROGRESS.md) · [使用说明](README.md)

## 0. 三个范式转变（本项目的"宪法"）

1. **从"内容容器"到"能力教练"**：核心不是章节列表，而是学习者模型（技能掌握度）+ 实时调控。
2. **从"照读"到"即兴生成"**：输入只是热身，核心练习是自由口语应对与复述。
3. **从"打分"到"诊断+处方"**：每次输出都更新技能掌握度并安排针对性复习（SRS）。

## 1. 架构总览

```
本地优先（零构建，ES Modules，无框架）
├── js/engine/    纯逻辑引擎（node --test 可测，不依赖 DOM）
│   ├── director.js   场景导演：状态机 + DDA + 意外注入 + 支架
│   ├── scoring.js    槽位抽取 / 关键点覆盖 / 词级对齐
│   ├── skills.js     技能掌握度更新（类 Elo）+ 雷达聚合
│   └── srs.js        通用间隔重复（一切可复习项共用）
├── js/data/      场景库 / 复述语料 / 音素库 / 技能库（内容=数据，扩内容不改代码）
├── js/speech/    TTS（多声音+安全超时）/ ASR（Web Speech 封装）
├── js/llm/       OpenAI 兼容适配器（BYO key，只当"配音演员"）
├── js/app/       页面控制器（对话/复述/诊所/雷达/设置）
└── js/store.js   localStorage 状态 + 打卡 + 导出导入
```

**关键决策：LLM 只是配音演员，不是大脑。** 导演的状态机（节拍/槽位/难度/意外/评分）100% 本地规则驱动——可测试（20 个单测）、可离线、可在浏览器自动化验证。配置了 OpenAI 兼容接口后，LLM 只把导演决定好的台词改写得更自然，失败静默回退。这样产品永远"开箱能玩"，LLM 是增强不是依赖。

## 2. 导演引擎（核心创新）

场景 = **目标树（beats）+ 信息槽词典 + 意外库**。`Director.handleUserInput(transcript)` 是唯一入口，每轮：

```
用户输入 → 评分（槽位/词组命中 + 礼貌加分）
        → DDA 调控（连续 2 顺 → 难度+1；连续 2 卡 → 支架模式）
        → 节拍推进（requires 槽齐 → 过；可选节拍说了就过）
        → 推进时：刚完成的节拍 allowIncident 且难度≥2 → 插入"意外节拍"
                 已被满足的后续节拍自动跳过（意外里答过的不再追问）
        → 全部完成 → debrief（轮次/均分/意外数/难度峰值/技能日志）
```

- **意外（incident）**：每个场景 2 个（minDifficulty 2/3），应对判定走词组命中（`accept`），应对中给出的信息会填充场景槽。
- **支架模式**：机器人放慢重问并给出可点击的提示句（提示下答对打 7 折计分）。
- **意外节拍技能归属** `respond-change`；正常节拍归属 beat.skillId。

## 3. 评分引擎（无 LLM 的本地语义评估）

| 模式 | 算法 | 输出 |
| --- | --- | --- |
| 对话轮 | 槽位抽取（多词别名优先）× requires 覆盖率 + 礼貌加分（≤0.15）；<2 词打折 | score ∈ [0,1]、missing |
| 复述 | 关键点覆盖（组内任一同义命中即覆盖）80% + 词汇重叠 20% | 0-100 分 + 逐点清单 |
| 跟读/最小对 | 词级 Levenshtein 对齐 | pct + 错词明细 |

## 4. 技能模型与 SRS

- 13 个原子技能（MVP：功能 8 个 + 发音 5 个），掌握度 `updateMastery`：成功 `m + 0.2(1-m)·p`（增益递减），失败 `×0.85`。雷达图按功能组聚合。
- 通用 SRS：box 0-5，间隔 10min→1d→3d→7d→21d→60d；again 归零。复述段与音素音都入 `srs` 表（`retell:` / `sound:` 前缀）。

## 5. 语音与 LLM

- ASR：Web Speech 单轮封装，取多候选择词数最多者；不支持时所有页面都有文本输入回退（同时是无障碍与自动化测试通道）。
- TTS：多声音 + 变速；**安全超时**（按文本长度估算上限）防个别环境 `onend` 不触发冻死回合（实际踩过的坑）。
- LLM：`createProvider(config)` → `rewriteLine(instruction)`，12s 超时，输出 >400 字符视为失败回退。

## 6. 存储（localStorage `speakmaster-v1`）

```
profile  { streak, lastActiveDay, activity:{"YYYY-MM-DD":n} }
skills   { [skillId]: { mastery, reps, lastAt } }
srs      { [itemId]: { id, box, due, lapses, reps } }
stats    { sessions, turns, retells, drills }
settings { ttsVoice, ttsRate, llm:{baseUrl,apiKey,model} }
```

换设备：设置页导出/导入 JSON。

## 7. 已知边界（v0.1）

- ASR 依赖 Chrome/Edge（Safari 部分支持）；文本回退保底。
- 规则导演的槽位词典有限，离谱回答会被判 0 分进支架——这是特性（逼你重说清楚），但语料需要持续扩充。
- 音素诊断是"最小对判别"级别（ASR 听感代理），非声学层面；真正的共振峰/对齐分析在路线图。

## 8. 路线图

1. 导演 LLM 深度模式（LLM 生成意外与追问，本地状态机校验兜底）
2. 复述段落与场景的批量内容管线（LLM 生成 + 人工审校）
3. 真人要素：tandem 匹配、卡关检测 → 建议真人课
4. 发音：录音回放对比、音素强制对齐（Whisper WASM）
5. 移动渗透：锁屏一句、3 分钟微课、手表
