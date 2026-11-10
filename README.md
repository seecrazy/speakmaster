# SpeakMaster · 口语陪练

不是电子书，是陪练：**它会实时理解你的水平——你顺，它加难度、抛意外；你卡，它放慢、递提示。**

## 三种训练

| 模式 | 练什么 | 怎么练 |
| --- | --- | --- |
| 💬 对话训练 | 即兴应对 | 自由口语推进场景目标；导演控难度，顺利就"导演意外"（燕麦奶卖完了、大杯用完了…），挣扎就进支架模式给提示句 |
| 🎧 复述训练 | 产出能力 | 听一段 → 用自己的话复述；按关键信息点评分，换词表达也算对 |
| 🩺 发音诊所 | 音素准确 | 5 组中国学习者高频混淆音（th/s、v/w、词尾 l/n、长短 i、æ/e），最小对判别 + 跟读句诊断，弱项自动进复习 |

所有练习都会更新 **技能雷达**（13 个原子技能的掌握度）并进入 **间隔复习** 队列。

## 快速开始

```bash
npm start          # 或: node serve.mjs 8900
# 打开 http://127.0.0.1:8900/index.html
```

macOS 也可双击 `start_server.command`。

- 语音识别需要 **Chrome / Edge**（Safari 部分支持）；所有模式都有文本输入回退
- 数据存浏览器 localStorage，设置页可导出/导入 JSON
- 可选：设置里填任意 **OpenAI 兼容接口**（Base URL + Key + Model），陪练台词会由大模型改写得更自然；不填完全离线可用——导演引擎 100% 本地运行

## 测试与开发

```bash
npm test           # 引擎层 20 个单测（node --test）
```

零构建、无依赖、ES Modules。改内容 = 改 `js/data/` 下的数据文件，不用碰逻辑。

## 部署到 GitHub Pages

纯静态站、全部相对路径，两种方式任选：

1. **Actions 自动部署（带单测门禁，推荐）**：`.github/workflows/pages.yml` 已配置——push 到 `master` 自动跑 `npm test`，**单测全绿才部署**；然后在仓库 **Settings → Pages → Source 选择 "GitHub Actions"**。
2. **分支直部署**：Settings → Pages → Source 选 "Deploy from a branch"（`master` / root）。不走单测门禁，适合临时预览。

部署后访问 `https://<用户名>.github.io/speakmaster/`。注意：学习数据按域名+浏览器隔离，线上与本地进度不互通，可用设置页导出/导入 JSON。

## 项目结构

```text
js/engine/   导演/评分/技能/SRS（纯逻辑，可单测）
js/data/     场景库、复述语料、音素库、技能库
js/app/      页面控制器    js/speech/  TTS/ASR 封装
js/llm/      可选 LLM 适配  js/store.js 状态与存储
tests/       引擎单测      serve.mjs   开发服务器（禁缓存）
```

设计理念与架构详见 [DESIGN.md](DESIGN.md)，版本交付记录见 [PROGRESS.md](PROGRESS.md)。
