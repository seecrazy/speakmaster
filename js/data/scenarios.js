// 场景库：每个场景 = 目标树（beats）+ 信息槽词典 + 意外库。
// beat 字段：
//   id / objective(中文目标) / bot(机器人的台词) / requires(必须命中的槽位)
//   optional(可选节拍，说了就过) / allowIncident(允许注入意外) / hints(支架提示句) / skillId(技能映射)
// incident 字段：id / objective / bot / accept(可接受的应答词→槽) / hints / minDifficulty / zhs

export const SCENARIOS = [
  {
    id: "coffee",
    title: "咖啡店点单",
    icon: "☕",
    level: "A2",
    goal: "点一杯咖啡，处理一个意外，完成支付",
    partner: { name: "Emma", role: "Barista", lang: "en-US", pitch: 1.15, rate: 0.96 },
    slots: {
      drink: ["latte", "cappuccino", "americano", "mocha", "espresso", "coffee", "tea", "hot chocolate", "regular coffee"],
      size: ["small", "medium", "large", "grande", "tall", "big"],
      milk: ["oat milk", "soy milk", "almond milk", "whole milk", "regular milk", "dairy"],
      sweet: ["sugar", "brown sugar", "no sugar", "honey", "syrup"],
      pay: ["card", "credit card", "cash", "apple pay", "phone", "visa"],
      yesno: ["yes", "yeah", "sure", "ok", "please", "right", "no", "nope"]
    },
    beats: [
      {
        id: "greet", objective: "互相问候", optional: true, skillId: "greet-small",
        bot: "Hi there! Welcome to Sunrise Coffee. What can I get for you today?",
        hints: ["Hi! Could I get a large latte, please?"]
      },
      {
        id: "order", objective: "点出饮品和杯型", requires: ["drink", "size"], skillId: "order-food", allowIncident: true,
        bot: "Great choice! What size would you like?",
        hints: ["A large latte, please.", "Can I get a medium cappuccino?"]
      },
      {
        id: "milk", objective: "回答奶的选择", requires: ["milk"], skillId: "specify",
        bot: "And which milk would you like with that?",
        hints: ["Oat milk, please.", "Could I have whole milk?"]
      },
      {
        id: "pay", objective: "完成支付", requires: ["pay"], skillId: "ask-price",
        bot: "Perfect. That'll be five fifty. How would you like to pay?",
        hints: ["By card, please.", "Can I pay with cash?"]
      },
      {
        id: "close", objective: "收尾致谢", optional: true, skillId: "greet-small",
        bot: "Here you go! One large latte with oat milk. Have a great day!",
        hints: ["Thank you so much! You too."]
      }
    ],
    incidents: [
      {
        id: "no-oat", minDifficulty: 2, objective: "应对燕麦奶卖完",
        bot: "Oh, I'm so sorry — we just ran out of oat milk. We have soy, almond, or whole milk. Which one would you like?",
        accept: ["soy", "soy milk", "almond", "almond milk", "whole milk", "regular milk", "dairy"],
        zhs: "燕麦奶卖完了，需要改选别的奶",
        hints: ["Soy milk is fine, thanks.", "Could I have almond milk instead?"]
      },
      {
        id: "size-out", minDifficulty: 3, objective: "应对大杯售罄",
        bot: "Ah, one more thing — we're out of large cups today. Would a medium be okay, or would you like to wait?",
        accept: ["medium", "ok", "okay", "sure", "fine", "yes", "wait", "small"],
        zhs: "大杯用完了，要接受中杯或等",
        hints: ["Medium is fine, thanks.", "I'll wait for the large one."]
      }
    ]
  },

  {
    id: "restaurant",
    title: "餐厅订位与点餐",
    icon: "🍽",
    level: "A2",
    goal: "订两人位、点主菜，处理一个意外",
    partner: { name: "Daniel", role: "Waiter", lang: "en-GB", pitch: 0.95, rate: 0.92 },
    slots: {
      people: ["two", "one", "three", "four", "2", "1", "couple"],
      time: ["seven", "half past seven", "eight", "six", "now", "tonight"],
      dish: ["steak", "salmon", "pasta", "burger", "salad", "chicken", "risotto", "pizza"],
      doneness: ["rare", "medium", "well done", "medium rare"],
      drink: ["water", "juice", "wine", "beer", "coke", "coffee", "tea"],
      yesno: ["yes", "yeah", "sure", "ok", "please", "no", "no thanks"]
    },
    beats: [
      {
        id: "greet", objective: "进门问位", optional: true, skillId: "greet-small",
        bot: "Good evening! Welcome to The Green Table. Do you have a reservation?",
        hints: ["Hi! A table for two, please."]
      },
      {
        id: "table", objective: "说明人数和时间", requires: ["people"], skillId: "book-arrange", allowIncident: true,
        bot: "Of course. A table for two — smoking or non-smoking? And would you like to sit by the window?",
        hints: ["Non-smoking, please. By the window would be lovely."]
      },
      {
        id: "order", objective: "点主菜和熟度", requires: ["dish"], skillId: "order-food",
        bot: "Here are the menus. What would you like for your main course?",
        hints: ["I'll have the steak, medium rare, please.", "Could I get the salmon?"]
      },
      {
        id: "drink", objective: "点饮品", requires: ["drink"], skillId: "specify",
        bot: "Excellent choice. And anything to drink?",
        hints: ["Just sparkling water, please.", "A glass of red wine, please."]
      },
      {
        id: "close", objective: "确认订单", optional: true, skillId: "clarify",
        bot: "Perfect — one steak, medium rare, and sparkling water. I'll be right back with your order.",
        hints: ["Yes, that's right. Thank you!"]
      }
    ],
    incidents: [
      {
        id: "no-steak", minDifficulty: 2, objective: "应对主菜售罄",
        bot: "I'm terribly sorry — we've just sold out of steak tonight. The salmon and the risotto are both excellent. Would you like to try one of those?",
        accept: ["salmon", "risotto", "chicken", "pasta", "burger", "salad", "pizza"],
        zhs: "主菜售罄，需要换菜",
        hints: ["Then I'll try the salmon, please.", "Could I have the risotto instead?"]
      },
      {
        id: "wait-seat", minDifficulty: 3, objective: "应对需要等位",
        bot: "I do apologize — the window table won't be free for about fifteen minutes. Would you like to wait at the bar, or take another table?",
        accept: ["wait", "bar", "ok", "okay", "sure", "fine", "yes", "another", "now"],
        zhs: "窗边位要等 15 分钟，需要选择",
        hints: ["We'll wait at the bar, thanks.", "Another table is fine."]
      }
    ]
  },

  {
    id: "taxi",
    title: "打车赶时间",
    icon: "🚕",
    level: "B1",
    goal: "告诉司机目的地，处理堵车改道，完成支付",
    partner: { name: "Carlos", role: "Driver", lang: "en-US", pitch: 0.9, rate: 1.0 },
    slots: {
      destination: ["airport", "station", "train station", "hotel", "office", "downtown", "museum", "hospital"],
      street: ["main street", "oak street", "first avenue", "second avenue", "park road"],
      time: ["ten", "fifteen", "twenty", "as soon as possible", "quickly", "fast"],
      yesno: ["yes", "yeah", "sure", "ok", "please", "no", "no thanks"],
      pay: ["card", "credit card", "cash", "phone", "app"]
    },
    beats: [
      {
        id: "greet", objective: "上车问好", optional: true, skillId: "greet-small",
        bot: "Morning! Where are you headed today?",
        hints: ["Good morning! Could you take me to the airport, please?"]
      },
      {
        id: "destination", objective: "说明目的地和紧迫度", requires: ["destination"], skillId: "specify", allowIncident: true,
        bot: "The airport, got it. Which terminal are you flying from?",
        hints: ["Terminal two, please. My flight is at ten, so I'm in a bit of a hurry."]
      },
      {
        id: "route", objective: "回应路线选择", requires: ["yesno"], skillId: "respond-change",
        bot: "There's some construction on the highway. Shall I take the riverside road instead? It's a bit longer but usually faster at this hour.",
        hints: ["Yes, please take the faster one.", "Whatever's quickest, thanks."]
      },
      {
        id: "pay", objective: "完成支付", requires: ["pay"], skillId: "ask-price",
        bot: "Here we are. That's twenty-two dollars altogether. Card or cash?",
        hints: ["Card, please.", "I'll pay by card."]
      },
      {
        id: "close", objective: "道别", optional: true, skillId: "greet-small",
        bot: "All done. Good luck with your flight!",
        hints: ["Thank you so much! Have a good one."]
      }
    ],
    incidents: [
      {
        id: "traffic", minDifficulty: 2, objective: "应对突发堵车",
        bot: "Hmm, the radio just reported an accident ahead — we might be stuck for a while. Do you want me to try the tunnel route? It costs a bit more on the meter.",
        accept: ["yes", "yeah", "sure", "ok", "tunnel", "please", "no", "wait"],
        zhs: "前方事故堵车，询问是否改走隧道",
        hints: ["Yes, let's take the tunnel, please.", "How much longer would it take?"]
      },
      {
        id: "card-broken", minDifficulty: 3, objective: "应对刷卡机故障",
        bot: "Oh, I'm sorry — my card machine just died on me. Would you mind paying cash, or should we try the app?",
        accept: ["cash", "app", "ok", "okay", "sure", "fine", "yes", "phone"],
        zhs: "刷卡机坏了，需要改现金或 App",
        hints: ["Sure, I can pay cash.", "No problem, I'll use the app."]
      }
    ]
  }
];
