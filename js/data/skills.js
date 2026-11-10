// 功能技能库：口语能力的原子拆解（MVP 先做"功能"维度，后续加语法/发音/语用维度）
export const SKILL_DEFS = [
  { id: "greet-small", group: "社交启动", name: "问候与寒暄", zh: "打招呼、回应、简单寒暄" },
  { id: "order-food", group: "生存交易", name: "点单/购买", zh: "说出想要的商品与规格" },
  { id: "specify", group: "生存交易", name: "细节指定", zh: "杯型/数量/口味等规格表达" },
  { id: "respond-change", group: "应变", name: "应对变化", zh: "面对卖完/改期/换货等意外" },
  { id: "ask-price", group: "生存交易", name: "询价与支付", zh: "问价格、付款方式" },
  { id: "book-arrange", group: "生活安排", name: "预约与安排", zh: "订票、订座、约时间" },
  { id: "clarify", group: "应变", name: "澄清与确认", zh: "没听懂时请求重复或确认" },
  { id: "narrate", group: "叙述", name: "复述与转述", zh: "把听到的内容用自己的话说出来" },
  { id: "th-sound", group: "发音", name: "/θ/ vs /s/", zh: "think↔sink 类最小对" },
  { id: "v-w-sound", group: "发音", name: "/v/ vs /w/", zh: "very↔wary 类最小对" },
  { id: "l-end-sound", group: "发音", name: "词尾 /l/ vs /n/", zh: "call↔con 类尾音" },
  { id: "ii-sound", group: "发音", name: "/iː/ vs /ɪ/", zh: "seat↔sit 类长短音" },
  { id: "ae-e-sound", group: "发音", name: "/æ/ vs /e/", zh: "bad↔bed 类开口度" },
  { id: "r-l-sound", group: "发音", name: "/r/ vs /l/", zh: "right↔light 类最小对" },
  { id: "s-sh-sound", group: "发音", name: "/s/ vs /ʃ/", zh: "see↔she 类最小对" },
  { id: "p-b-sound", group: "发音", name: "/p/ vs /b/", zh: "pig↔big 清浊对立" },
  { id: "h-sound", group: "发音", name: "词首 /h/", zh: "heat↔eat 防丢 h" }
];

export const SKILL_BY_ID = Object.fromEntries(SKILL_DEFS.map(d => [d.id, d]));
