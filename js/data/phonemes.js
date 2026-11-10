// 发音诊所 MVP：针对中国学习者 5 组高频混淆音。
// 每组含最小对（判别 ASR 听到的接近哪个词）+ 含目标音的跟读句 + 讲解。

export const PHONEME_SOUNDS = [
  {
    id: "th-s",
    skillId: "th-sound",
    ipa: "/θ/ vs /s/",
    name: "th 咬舌音 vs s",
    explain: "发 /θ/ 时舌尖轻触上齿，气流从舌齿间流出；发 /s/ 时舌尖靠近上齿龈。中文没有 /θ/，常被发成 /s/：think → sink。",
    minimalPairs: [["think", "sink"], ["three", "free"], ["math", "mass"], ["path", "pass"]],
    targetSide: 0,
    drill: "I think three thousand thoughts on Thursday.",
    drillWords: ["think", "three", "thousand", "thoughts", "Thursday"]
  },
  {
    id: "v-w",
    skillId: "v-w-sound",
    ipa: "/v/ vs /w/",
    name: "咬唇 v vs 圆唇 w",
    explain: "/v/ 上齿轻咬下唇摩擦出声；/w/ 双唇收圆没有摩擦。very 常被读成 wary，west 读成 vest。",
    minimalPairs: [["very", "wary"], ["vest", "west"], ["vine", "wine"], ["verse", "worse"]],
    targetSide: 0,
    drill: "Victor's wet vest was very warm in the west wind.",
    drillWords: ["Victor's", "vest", "very", "west", "wind"]
  },
  {
    id: "l-end",
    skillId: "l-end-sound",
    name: "词尾 /l/ vs /n/",
    ipa: "/l/ vs /n/",
    explain: "词尾 /l/ 舌尖抵上齿龈且舌面略塌（暗音 /l/）；/n/ 同位置但气流走鼻腔。call 发成 cone、well 发成 when 是常见混淆。",
    minimalPairs: [["call", "con"], ["well", "when"], ["all", "on"], ["cold", "cone"]],
    targetSide: 0,
    drill: "I will call you well before the cold night falls.",
    drillWords: ["will", "call", "well", "cold", "falls"]
  },
  {
    id: "ii",
    skillId: "ii-sound",
    name: "长音 /iː/ vs 短音 /ɪ/",
    ipa: "/iː/ vs /ɪ/",
    explain: "/iː/ 拉长且嘴角咧开（微笑位）；/ɪ/ 短促、口腔更松。seat↔sit、beach↔bitch 要特别小心。",
    minimalPairs: [["seat", "sit"], ["beat", "bit"], ["cheap", "chip"], ["feel", "fill"]],
    targetSide: 0,
    drill: "Please sit on this seat and eat the cheap chips.",
    drillWords: ["sit", "seat", "eat", "cheap", "chips"]
  },
  {
    id: "ae-e",
    skillId: "ae-e-sound",
    name: "/æ/ vs /e/",
    ipa: "/æ/ vs /e/",
    explain: "/æ/ 嘴张大（可塞两指），/e/ 半开。bad↔bed、man↔men 混淆会让意思跑偏。",
    minimalPairs: [["bad", "bed"], ["man", "men"], ["sad", "said"], ["cat", "kept"]],
    targetSide: 0,
    drill: "The sad man said the bad cat kept him awake.",
    drillWords: ["sad", "man", "said", "bad", "cat", "kept"]
  },
  {
    id: "r-l",
    skillId: "r-l-sound",
    name: "r vs l",
    ipa: "/r/ vs /l/",
    explain: "/r/ 舌尖卷起不触任何地方（圆拢）；/l/ 舌尖抵上齿龈。right↔light、road↔load 混淆普遍。",
    minimalPairs: [["right", "light"], ["road", "load"], ["correct", "collect"], ["arrive", "alive"]],
    targetSide: 0,
    drill: "Rory really likes the red lily by the lake road.",
    drillWords: ["Rory", "really", "likes", "red", "lily", "lake", "road"]
  },
  {
    id: "s-sh",
    skillId: "s-sh-sound",
    name: "s vs sh",
    ipa: "/s/ vs /ʃ/",
    explain: "/s/ 舌尖靠近齿龈、气流窄而尖；/ʃ/ 双唇略突、舌面抬、气流宽。see↔she、sip↔ship 要分清。",
    minimalPairs: [["see", "she"], ["sip", "ship"], ["mass", "mash"], ["seat", "sheet"]],
    targetSide: 0,
    drill: "She sees the ship slowly sail south of Spain.",
    drillWords: ["She", "sees", "ship", "slowly", "sail", "south"]
  },
  {
    id: "p-b",
    skillId: "p-b-sound",
    name: "清音 p vs 浊音 b",
    ipa: "/p/ vs /b/",
    explain: "/p/ 只送气不发声，/b/ 声带振动。手摸喉咙发 b 会震、发 p 不震。pig↔big、pay↔bay。",
    minimalPairs: [["pig", "big"], ["pay", "bay"], ["pack", "back"], ["pride", "bride"]],
    targetSide: 0,
    drill: "Please put the big purple backpack behind the blue pig.",
    drillWords: ["Please", "put", "big", "purple", "backpack", "behind", "blue", "pig"]
  },
  {
    id: "h-drop",
    skillId: "h-sound",
    name: "词首 h（易丢）",
    ipa: "/h/ vs ∅",
    explain: "很多方言把词首 h 丢掉：heat 说成 eat、hair 说成 air。发 /h/ 像哈气，声带不振动、喉咙放松。",
    minimalPairs: [["eat", "heat"], ["ill", "hill"], ["air", "hair"], ["old", "hold"]],
    targetSide: 1,
    drill: "He held his hat in his hand on the high hill.",
    drillWords: ["He", "held", "his", "hat", "hand", "high", "hill"]
  }
];
