// 场景库：每个场景 = 目标树（beats）+ 信息槽词典 + 意外库。
// beat 字段：
//   id / objective(中文目标) / bot(机器人的台词，字符串或数组=变体随机抽)
//   requires(必须命中的槽位，必须是 slots 的 key) / optional(可选节拍，说了就过)
//   allowIncident(完成本节拍时允许注入意外) / hints(支架提示句) / skillId(技能映射)
// incident 字段：id / objective / bot(可数组) / accept(可接受的应答词组) /
//   hints / minDifficulty(2|3) / zhs(中文说明)
// 内容门禁：tests/content.test.js 校验本文件结构（槽位引用/技能映射/意外数量等）。

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
        bot: [
          "Hi there! Welcome to Sunrise Coffee. What can I get for you today?",
          "Good morning! Welcome to Sunrise Coffee — what'll it be today?",
          "Hey, welcome to Sunrise Coffee! What can I start for you?"
        ],
        hints: ["Hi! Could I get a large latte, please?"]
      },
      {
        id: "order", objective: "点出饮品和杯型", requires: ["drink", "size"], skillId: "order-food", allowIncident: true,
        bot: [
          "Great choice! What size would you like?",
          "Nice pick — and what size for that?",
          "Sure thing! Which size do you need?"
        ],
        hints: ["A large latte, please.", "Can I get a medium cappuccino?"]
      },
      {
        id: "milk", objective: "回答奶的选择", requires: ["milk"], skillId: "specify",
        bot: [
          "And which milk would you like with that?",
          "Perfect — any milk preference for your drink?",
          "Good! What milk should I use?"
        ],
        hints: ["Oat milk, please.", "Could I have whole milk?"]
      },
      {
        id: "pay", objective: "完成支付", requires: ["pay"], skillId: "ask-price",
        bot: [
          "Perfect. That'll be five fifty. How would you like to pay?",
          "Alright, five fifty altogether — card or cash?",
          "That comes to five fifty. How are you paying today?"
        ],
        hints: ["By card, please.", "Can I pay with cash?"]
      },
      {
        id: "close", objective: "收尾致谢", optional: true, skillId: "greet-small",
        bot: [
          "Here you go! One large latte with oat milk. Have a great day!",
          "All set — enjoy your drink, and have a good one!",
          "Here's your order! Thanks for stopping by Sunrise Coffee."
        ],
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
      },
      {
        id: "card-broken", minDifficulty: 2, objective: "应对刷卡机故障",
        bot: "Ugh, our card machine just froze. Would you mind paying another way — cash or a phone app?",
        accept: ["cash", "app", "phone", "apple pay", "ok", "okay", "sure", "fine", "yes", "another"],
        zhs: "刷卡机坏了，改用现金或手机支付",
        hints: ["Sure, I can pay cash.", "No problem, Apple Pay works."]
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
        bot: [
          "Good evening! Welcome to The Green Table. Do you have a reservation?",
          "Good evening, welcome in! Table for how many tonight?",
          "Hello! Welcome to The Green Table — reserved or walking in?"
        ],
        hints: ["Hi! A table for two, please."]
      },
      {
        id: "table", objective: "说明人数和时间", requires: ["people"], skillId: "book-arrange", allowIncident: true,
        bot: [
          "Of course. A table for two — smoking or non-smoking? And would you like to sit by the window?",
          "Certainly. Any preference on where you sit — window or garden side?",
          "No problem at all. Would the window table work for you?"
        ],
        hints: ["Non-smoking, please. By the window would be lovely."]
      },
      {
        id: "order", objective: "点主菜", requires: ["dish"], skillId: "order-food",
        bot: [
          "Here are the menus. What would you like for your main course?",
          "May I take your order for the mains?",
          "Ready to order? The salmon is lovely tonight."
        ],
        hints: ["I'll have the steak, medium rare, please.", "Could I get the salmon?"]
      },
      {
        id: "drink", objective: "点饮品", requires: ["drink"], skillId: "specify",
        bot: [
          "Excellent choice. And anything to drink?",
          "Lovely. Can I get you something to drink?",
          "Very good — and for drinks?"
        ],
        hints: ["Just sparkling water, please.", "A glass of red wine, please."]
      },
      {
        id: "close", objective: "确认订单", optional: true, skillId: "clarify",
        bot: [
          "Perfect — one steak, medium rare, and sparkling water. I'll be right back with your order.",
          "So that's one steak and a sparkling water — I'll get that started for you.",
          "Great choices! Your order will be with you shortly."
        ],
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
      },
      {
        id: "slow-kitchen", minDifficulty: 2, objective: "应对出餐慢",
        bot: "I'm so sorry about the wait — the kitchen is slammed tonight. Your food will be about ten more minutes. Would you like a free appetizer while you wait?",
        accept: ["yes", "yeah", "sure", "ok", "okay", "thanks", "thank", "appetizer", "no thanks", "fine"],
        zhs: "厨房忙、出餐慢，赠送前菜安抚",
        hints: ["That would be lovely, thank you.", "No worries, we'll wait."]
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
        bot: [
          "Morning! Where are you headed today?",
          "Hey there! Where to?",
          "Good morning — destination, please?"
        ],
        hints: ["Good morning! Could you take me to the airport, please?"]
      },
      {
        id: "destination", objective: "说明目的地和紧迫度", requires: ["destination"], skillId: "specify", allowIncident: true,
        bot: [
          "The airport, got it. Which terminal are you flying from?",
          "Airport — sure. Terminal one or two?",
          "Right, the airport. Which terminal, mate?"
        ],
        hints: ["Terminal two, please. My flight is at ten, so I'm in a bit of a hurry."]
      },
      {
        id: "route", objective: "回应路线选择", requires: ["yesno"], skillId: "respond-change",
        bot: [
          "There's some construction on the highway. Shall I take the riverside road instead? It's a bit longer but usually faster at this hour.",
          "Heads up — the highway's slow today. Want me to try the riverside road instead?",
          "Wanna take the riverside route? Highway's a parking lot right now."
        ],
        hints: ["Yes, please take the faster one.", "Whatever's quickest, thanks."]
      },
      {
        id: "pay", objective: "完成支付", requires: ["pay"], skillId: "ask-price",
        bot: [
          "Here we are. That's twenty-two dollars altogether. Card or cash?",
          "That's twenty-two all in — how are you paying?",
          "We've arrived — twenty-two dollars. Card machine's right here."
        ],
        hints: ["Card, please.", "I'll pay by card."]
      },
      {
        id: "close", objective: "道别", optional: true, skillId: "greet-small",
        bot: [
          "All done. Good luck with your flight!",
          "Here you go — safe travels!",
          "We're here. Have a great flight!"
        ],
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
      },
      {
        id: "wrong-address", minDifficulty: 2, objective: "应对导航地址错误",
        bot: "Hold on — the GPS is taking us to a depot with the same name, not the passenger terminal. Should I follow the airport signs instead?",
        accept: ["yes", "yeah", "sure", "ok", "okay", "signs", "please", "follow"],
        zhs: "导航定位到同名货运区，需改跟路牌走",
        hints: ["Yes, please follow the signs.", "That GPS is wrong — follow the terminal signs, please."]
      }
    ]
  },

  {
    id: "hotel",
    title: "酒店入住",
    icon: "🏨",
    level: "A2",
    goal: "办理入住、表达偏好、处理一个意外",
    partner: { name: "Lisa", role: "Receptionist", lang: "en-US", pitch: 1.1, rate: 0.95 },
    slots: {
      roomtype: ["single room", "double room", "twin room", "king room", "suite"],
      nights: ["one night", "two nights", "three nights", "four nights", "one", "two", "three"],
      floor: ["high floor", "low floor", "ground floor", "quiet floor"],
      breakfast: ["breakfast", "no breakfast", "with breakfast"],
      pay: ["card", "credit card", "cash", "phone", "visa"],
      yesno: ["yes", "yeah", "sure", "ok", "please", "no", "nope"]
    },
    beats: [
      {
        id: "greet", objective: "前台问好", optional: true, skillId: "greet-small",
        bot: [
          "Good afternoon! Welcome to the Harborview Hotel. How may I help you?",
          "Hello! Front desk — checking in?",
          "Good afternoon, welcome! Do you have a booking with us?"
        ],
        hints: ["Hi! I'd like to check in, please. I have a reservation."]
      },
      {
        id: "book", objective: "说明房型和晚数", requires: ["roomtype", "nights"], skillId: "book-arrange", allowIncident: true,
        bot: [
          "Certainly. And how many nights will you be staying?",
          "Of course — and for how many nights?",
          "Great. May I confirm the number of nights?"
        ],
        hints: ["A double room for two nights, please."]
      },
      {
        id: "preference", objective: "表达楼层/早餐偏好", requires: ["floor"], skillId: "specify",
        bot: [
          "Would you prefer a high floor or a low floor?",
          "Any preference on the floor level?",
          "We have rooms on several floors — do you like it high or low?"
        ],
        hints: ["A high floor, please. Somewhere quiet.", "Low floor is fine for me."]
      },
      {
        id: "pay", objective: "完成押金/支付", requires: ["pay"], skillId: "ask-price",
        bot: [
          "Thank you. Could I take a card for the deposit?",
          "I'll just need a payment method for the deposit — card or cash?",
          "One card for the deposit, please."
        ],
        hints: ["Here's my card.", "I can pay the deposit by card."]
      },
      {
        id: "close", objective: "拿房卡道谢", optional: true, skillId: "greet-small",
        bot: [
          "Here are your key cards — room 806, eighth floor. Breakfast is on the second floor until ten. Enjoy your stay!",
          "All set! Room 806, lifts are to your right. Enjoy your stay!",
          "Here you go — two keys for room 806. Wi-Fi password is on the card. Have a wonderful stay!"
        ],
        hints: ["Great, thank you very much!"]
      }
    ],
    incidents: [
      {
        id: "room-not-ready", minDifficulty: 2, objective: "应对房间未打扫完",
        bot: "I'm so sorry — your room isn't quite ready yet; housekeeping needs about thirty minutes. Would you like to wait in the lounge, or store your luggage and step out?",
        accept: ["wait", "lounge", "luggage", "store", "ok", "okay", "sure", "yes", "later", "fine"],
        zhs: "房间还没打扫好，选择等待或寄存行李",
        hints: ["I'll wait in the lounge, thanks.", "Could you store my luggage? I'll take a walk."]
      },
      {
        id: "overbooked", minDifficulty: 3, objective: "应对超售升级",
        bot: "There's been a small mix-up — your room type is overbooked tonight. I can upgrade you to a suite at no extra charge. Would that be alright?",
        accept: ["yes", "yeah", "sure", "ok", "okay", "suite", "upgrade", "fine", "thank", "great"],
        zhs: "房型超售，免费升级套房",
        hints: ["Oh — yes, that would be great!", "Sure, an upgrade works for me."]
      },
      {
        id: "elevator", minDifficulty: 2, objective: "应对电梯维修",
        bot: "Just to let you know — one elevator is under maintenance, so there may be a short wait during peak hours. Is that okay, or would you prefer a lower floor?",
        accept: ["ok", "okay", "sure", "fine", "yes", "low", "lower", "no problem", "thanks"],
        zhs: "电梯维修，接受等待或换低楼层",
        hints: ["That's fine, no problem.", "Could I have a lower floor then?"]
      }
    ]
  },

  {
    id: "airport",
    title: "机场值机",
    icon: "✈️",
    level: "A2",
    goal: "值机选座、托运行李，处理一个意外",
    partner: { name: "Mike", role: "Check-in Agent", lang: "en-US", pitch: 1.0, rate: 0.98 },
    slots: {
      docs: ["passport", "ticket", "boarding pass", "visa", "booking"],
      seat: ["window seat", "aisle seat", "middle seat", "window", "aisle"],
      bags: ["one bag", "two bags", "bag", "bags", "suitcase", "backpack", "no bags"],
      pay: ["card", "credit card", "cash", "phone"],
      yesno: ["yes", "yeah", "sure", "ok", "please", "no", "no thanks"]
    },
    beats: [
      {
        id: "greet", objective: "柜台问好", optional: true, skillId: "greet-small",
        bot: [
          "Good morning! May I see your passport and ticket, please?",
          "Hello! Passport and booking, please.",
          "Morning — checking in? I'll need your passport."
        ],
        hints: ["Good morning! Here's my passport and ticket."]
      },
      {
        id: "docs", objective: "出示证件", requires: ["docs"], skillId: "specify",
        bot: [
          "Perfect. Would you prefer a window or an aisle seat?",
          "Thank you. Any seat preference — window or aisle?",
          "Got it. Window or aisle for you today?"
        ],
        hints: ["A window seat, please."]
      },
      {
        id: "seat", objective: "选座位", requires: ["seat"], skillId: "book-arrange", allowIncident: true,
        bot: [
          "And how many bags are you checking in today?",
          "Great. Any bags to check?",
          "Window it is. Do you have luggage to check?"
        ],
        hints: ["Just one suitcase to check.", "I have two bags to check in."]
      },
      {
        id: "close", objective: "拿登机牌", optional: true, skillId: "clarify",
        bot: [
          "Here's your boarding pass — gate twelve, boarding at nine forty. Have a nice flight!",
          "All done! Gate twelve, boarding nine forty. Enjoy your trip!",
          "You're all set — gate twelve. Boarding starts at nine forty."
        ],
        hints: ["Great, thank you very much!"]
      }
    ],
    incidents: [
      {
        id: "delay", minDifficulty: 2, objective: "应对航班延误",
        bot: "I'm afraid your flight is delayed by about two hours due to weather. Would you like to rebook to a later connecting flight, or keep your current one?",
        accept: ["rebook", "keep", "later", "ok", "okay", "sure", "fine", "yes", "wait", "next"],
        zhs: "航班延误 2 小时，选择改签或等待",
        hints: ["I'll keep my current flight, thanks.", "Could you rebook me on the next one?"]
      },
      {
        id: "overweight", minDifficulty: 3, objective: "应对行李超重",
        bot: "Your suitcase is three kilos over the limit — there's a fifty-dollar excess fee. Or you could move some items into your carry-on. What would you like to do?",
        accept: ["pay", "card", "move", "take out", "rearrange", "carry", "ok", "okay", "sure", "fine", "yes"],
        zhs: "行李超重，缴费或移出物品",
        hints: ["I'll move some things to my backpack.", "I'll pay the fee by card."]
      },
      {
        id: "seat-taken", minDifficulty: 2, objective: "应对座位已被选",
        bot: "Ah, the window seats on this flight are all taken — I can offer you an aisle seat in the same row, or a middle seat further forward. Which would you prefer?",
        accept: ["aisle", "middle", "front", "forward", "ok", "okay", "sure", "fine", "yes"],
        zhs: "靠窗座位已满，换过道或前排中间座",
        hints: ["The aisle seat is fine.", "I'll take the middle one up front."]
      }
    ]
  },

  {
    id: "shopping",
    title: "买衣服",
    icon: "🛍",
    level: "A2",
    goal: "挑衣服、报尺码颜色，处理一个意外",
    partner: { name: "Sophia", role: "Shop Assistant", lang: "en-GB", pitch: 1.12, rate: 0.97 },
    slots: {
      item: ["jacket", "coat", "shirt", "t-shirt", "jeans", "pants", "trousers", "shoes", "sweater", "dress", "scarf", "hat"],
      size: ["small", "medium", "large", "extra large", "xl"],
      color: ["blue", "black", "white", "red", "green", "gray", "grey", "brown", "navy", "beige"],
      tryon: ["try it on", "try on", "fitting room", "try"],
      pay: ["card", "credit card", "cash", "phone", "visa"],
      yesno: ["yes", "yeah", "sure", "ok", "please", "no", "no thanks"]
    },
    beats: [
      {
        id: "greet", objective: "进店问好", optional: true, skillId: "greet-small",
        bot: [
          "Hi! Welcome in — are you looking for anything in particular?",
          "Hello there! Just shout if you need a hand. What are we shopping for today?",
          "Hi, welcome! Can I help you find something?"
        ],
        hints: ["Hi! I'm looking for a jacket, please."]
      },
      {
        id: "item", objective: "说出要买的商品", requires: ["item"], skillId: "order-food", allowIncident: true,
        bot: [
          "Lovely! What size do you take?",
          "Great choice. What size are you after?",
          "We have those right here — what size do you need?"
        ],
        hints: ["I'm looking for a medium, please."]
      },
      {
        id: "size", objective: "报尺码", requires: ["size"], skillId: "specify",
        bot: [
          "And what color would you like?",
          "Perfect — which color catches your eye?",
          "Any color preference?"
        ],
        hints: ["A blue one, please.", "Do you have it in black?"]
      },
      {
        id: "color", objective: "选颜色", requires: ["color"], skillId: "specify",
        bot: [
          "Would you like to try it on? The fitting rooms are just over there.",
          "Shall I open a fitting room for you?",
          "Feel free to try it on — mirrors are on the left."
        ],
        hints: ["Yes, I'd like to try it on.", "No thanks, I'll take it as is."]
      },
      {
        id: "pay", objective: "结账", requires: ["pay"], skillId: "ask-price",
        bot: [
          "That's forty-nine ninety. How would you like to pay?",
          "Forty-nine ninety altogether — card or cash?",
          "Great, it fits nicely! That'll be forty-nine ninety."
        ],
        hints: ["By card, please."]
      },
      {
        id: "close", objective: "收尾道谢", optional: true, skillId: "greet-small",
        bot: [
          "Here's your bag — the receipt's inside. See you again soon!",
          "All wrapped up! Thanks for shopping with us.",
          "Here you go. Have a lovely day!"
        ],
        hints: ["Thank you very much! Bye."]
      }
    ],
    incidents: [
      {
        id: "size-out", minDifficulty: 2, objective: "应对尺码断货",
        bot: "Oh no, we've just sold out of that size in blue — we do have it in navy, or I can check the back for the same size. What would you like me to do?",
        accept: ["navy", "check", "back", "another color", "different", "ok", "okay", "sure", "yes", "wait", "color"],
        zhs: "蓝色断码，换藏青色或去仓库找",
        hints: ["Could you check the back for me?", "Navy is fine, actually."]
      },
      {
        id: "no-refund", minDifficulty: 3, objective: "应对只换不退",
        bot: "Just so you know, this item is final sale — we can exchange it within fourteen days, but no cash refunds. Does that work for you?",
        accept: ["exchange", "ok", "okay", "sure", "fine", "yes", "no problem", "works", "credit"],
        zhs: "特价商品只换不退",
        hints: ["That's fine, I'll take it.", "Okay, as long as I can exchange it."]
      },
      {
        id: "price-tag", minDifficulty: 2, objective: "应对标价与系统价不符",
        bot: "Hmm, the system is showing sixty-nine, not forty-nine — the tag must be from last week's sale. I can honor the lower price this time. Shall I go ahead?",
        accept: ["yes", "yeah", "sure", "ok", "okay", "please", "lower", "forty", "thanks", "great"],
        zhs: "标价过期，按低价卖",
        hints: ["Yes please, that would be great."]
      }
    ]
  },

  {
    id: "doctor",
    title: "看医生",
    icon: "🩺",
    level: "B1",
    goal: "描述症状和持续时间，回答过敏史",
    partner: { name: "Dr. Shaw", role: "Doctor", lang: "en-US", pitch: 1.0, rate: 0.94 },
    slots: {
      symptom: ["headache", "stomachache", "sore throat", "fever", "cough", "cold", "back pain", "allergy", "dizzy", "runny nose"],
      duration: ["two days", "three days", "a week", "one day", "since yesterday", "since monday", "yesterday"],
      allergy: ["penicillin", "allergic", "no allergy", "none", "not allergic", "aspirin"],
      appointment: ["morning", "afternoon", "tomorrow", "today", "next week"],
      yesno: ["yes", "yeah", "no", "nope", "sure", "ok"]
    },
    beats: [
      {
        id: "greet", objective: "候诊问好", optional: true, skillId: "greet-small",
        bot: [
          "Good morning, come on in. What brings you in today?",
          "Hello! Take a seat — what seems to be the problem?",
          "Morning! How can I help you today?"
        ],
        hints: ["Good morning, doctor. I haven't been feeling well."]
      },
      {
        id: "symptom", objective: "描述症状", requires: ["symptom"], skillId: "specify", allowIncident: true,
        bot: [
          "I see. How long have you been feeling this way?",
          "Okay — and when did it start?",
          "Alright. How many days has this been going on?"
        ],
        hints: ["I've had a headache and a fever since yesterday.", "It started about three days ago."]
      },
      {
        id: "duration", objective: "说明持续时间", requires: ["duration"], skillId: "narrate",
        bot: [
          "And do you have any allergies — to medication, food, anything?",
          "Any known allergies I should know about?",
          "Are you allergic to any medicine?"
        ],
        hints: ["Not that I know of. No allergies.", "I'm allergic to penicillin."]
      },
      {
        id: "allergy", objective: "回答过敏史", requires: ["allergy"], skillId: "clarify",
        bot: [
          "Okay, that's helpful. Let me take a quick look... Your throat is a bit red, but the lungs sound clear.",
          "Good to know. Based on what you've described, this looks like a mild infection.",
          "Alright, nothing serious by the sound of it."
        ],
        hints: ["Is it anything serious, doctor?"]
      },
      {
        id: "close", objective: "听取医嘱", optional: true, skillId: "clarify",
        bot: [
          "I'll prescribe some rest and plenty of fluids — and here's a prescription if it doesn't improve in three days. Take care!",
          "Nothing an antibiotic course won't fix. Rest up, drink water, and come back if the fever climbs. Get well soon!",
          "You'll be fine — rest for a couple of days. The pharmacy is downstairs."
        ],
        hints: ["Thank you, doctor. I'll do that."]
      }
    ],
    incidents: [
      {
        id: "referral", minDifficulty: 2, objective: "应对需要转诊",
        bot: "Just to be careful, I'd like a specialist to take a quick look at you — Dr. Lee on the fourth floor. Are you free tomorrow morning, or would the afternoon suit you better?",
        accept: ["morning", "afternoon", "tomorrow", "today", "ok", "okay", "sure", "yes", "free", "next week"],
        zhs: "需要转专科医生，选择时间",
        hints: ["Tomorrow morning works for me.", "The afternoon is better for me."]
      },
      {
        id: "pharmacy-out", minDifficulty: 3, objective: "应对药房缺药",
        bot: "It seems our pharmacy is out of that medicine until Friday. There's a branch on Oak Street that has it — or I can prescribe an alternative. What would you prefer?",
        accept: ["alternative", "another", "oak street", "branch", "ok", "okay", "sure", "yes", "friday", "wait", "prescribe"],
        zhs: "药房缺药，换处方或去分店",
        hints: ["Could you prescribe an alternative?", "I can go to the Oak Street branch."]
      },
      {
        id: "flu-shot", minDifficulty: 2, objective: "应对疫苗建议",
        bot: "Since you're here — flu season is starting. Would you like a flu shot today? It only takes a minute.",
        accept: ["yes", "yeah", "sure", "ok", "no", "no thanks", "maybe", "later", "please", "why not"],
        zhs: "建议顺便打流感疫苗",
        hints: ["Sure, why not.", "Not today, thanks."]
      }
    ]
  },

  {
    id: "gym",
    title: "健身房办卡",
    icon: "🏋️",
    level: "B1",
    goal: "选会员方案、说训练目标、约课，处理一个意外",
    partner: { name: "Jake", role: "Coach", lang: "en-US", pitch: 0.95, rate: 1.02 },
    slots: {
      plan: ["monthly", "yearly", "annual", "day pass", "week pass", "trial"],
      goal: ["lose weight", "build muscle", "get fit", "flexibility", "strength", "cardio"],
      class: ["yoga", "spinning", "boxing", "pilates", "hiit", "swimming", "crossfit"],
      time: ["morning", "evening", "afternoon", "monday", "wednesday", "weekend", "tomorrow", "friday"],
      pay: ["card", "cash", "phone", "app"],
      yesno: ["yes", "yeah", "sure", "ok", "please", "no", "no thanks"]
    },
    beats: [
      {
        id: "greet", objective: "进门问好", optional: true, skillId: "greet-small",
        bot: [
          "Hey! Welcome to IronWorks. First time with us?",
          "What's up! Looking to join the gym today?",
          "Hey there! Come to check out the gym?"
        ],
        hints: ["Hi! Yes, I'd like to look at membership options."]
      },
      {
        id: "plan", objective: "选择会员方案", requires: ["plan"], skillId: "order-food", allowIncident: true,
        bot: [
          "Nice! So what are you training for — weight loss, muscle, general fitness?",
          "Great choice. What's your main goal?",
          "Perfect. What are you hoping to get out of it?"
        ],
        hints: ["I'd like the monthly plan, please. My goal is to lose weight."]
      },
      {
        id: "goal", objective: "说明训练目标", requires: ["goal"], skillId: "narrate",
        bot: [
          "Got it. We run group classes too — yoga, spinning, boxing, HIIT... any of those interest you?",
          "Makes sense. Want to add a weekly class to the plan?",
          "Nice. Our classes could help with that — anything catch your eye?"
        ],
        hints: ["Yoga sounds good.", "I'd like to try boxing."]
      },
      {
        id: "class", objective: "预约团课", requires: ["class", "time"], skillId: "book-arrange",
        bot: [
          "Awesome — we've got slots weekday mornings and evenings. What time suits you?",
          "Great pick! Mornings or evenings?",
          "Cool. When works better for you — morning or evening?"
        ],
        hints: ["Evenings work better for me.", "Wednesday morning, please."]
      },
      {
        id: "close", objective: "办卡完成", optional: true, skillId: "ask-price",
        bot: [
          "You're all set! Here's your card — the app unlocks the door. See you on the floor!",
          "Done! You'll get the app invite by email. Let's get after it!",
          "Welcome aboard! First workout's on me — just ask for Jake."
        ],
        hints: ["Thanks, Jake! See you around."]
      }
    ],
    incidents: [
      {
        id: "peak-full", minDifficulty: 2, objective: "应对团课满员",
        bot: "Heads up — evening classes are fully booked this week. The morning sessions have spots, or I can put you on the waitlist. What do you think?",
        accept: ["morning", "waitlist", "wait", "ok", "okay", "sure", "yes", "next week", "another"],
        zhs: "晚课满员，改早课或进候补",
        hints: ["Put me on the waitlist, please.", "I could do mornings instead."]
      },
      {
        id: "trainer-away", minDifficulty: 3, objective: "应对教练请假",
        bot: "Small hiccup — your coach is out sick that day. We can reschedule you, or you can train with a substitute coach. Either works for us.",
        accept: ["reschedule", "substitute", "another", "ok", "okay", "sure", "yes", "fine", "later", "next"],
        zhs: "教练请假，改期或换教练",
        hints: ["Let's reschedule for next week.", "A substitute coach is fine."]
      },
      {
        id: "pool", minDifficulty: 2, objective: "应对泳池维护",
        bot: "Oh, one thing — the pool is closed for maintenance on Thursday. Friday's open if you want to swim, or you can use the sauna for free that day.",
        accept: ["friday", "ok", "okay", "sure", "yes", "sauna", "reschedule", "tomorrow", "another", "fine"],
        zhs: "泳池周四维护，改周五或用桑拿",
        hints: ["Friday works.", "I'll use the sauna then."]
      }
    ]
  },

  {
    id: "bank",
    title: "银行办业务",
    icon: "🏦",
    level: "B1",
    goal: "说明业务需求、出示证件、回答金额，处理一个意外",
    partner: { name: "Nina", role: "Teller", lang: "en-US", pitch: 1.05, rate: 0.96 },
    slots: {
      service: ["open an account", "account", "savings account", "checking account", "credit card", "exchange", "currency", "deposit", "withdraw"],
      currency: ["dollars", "usd", "euros", "pounds", "yen", "yuan", "rmb"],
      amount: ["one hundred", "two hundred", "five hundred", "a thousand", "thousand", "hundred"],
      idword: ["passport", "id", "license", "id card", "driver's license"],
      yesno: ["yes", "yeah", "sure", "ok", "please", "no", "no thanks"]
    },
    beats: [
      {
        id: "greet", objective: "取号问好", optional: true, skillId: "greet-small",
        bot: [
          "Good morning! What can I do for you today?",
          "Hi there — what business do you have with us today?",
          "Hello! How may I help you?"
        ],
        hints: ["Hi! I'd like to open a savings account, please."]
      },
      {
        id: "service", objective: "说明业务", requires: ["service"], skillId: "specify", allowIncident: true,
        bot: [
          "Of course. May I see an ID — passport or driver's license?",
          "Sure thing. I'll just need photo ID for that.",
          "No problem — do you have your passport with you?"
        ],
        hints: ["Sure, here's my passport."]
      },
      {
        id: "id", objective: "出示证件", requires: ["idword"], skillId: "clarify",
        bot: [
          "Perfect. And how much would you like to start with?",
          "Thank you. What amount will you be depositing today?",
          "Great. How much were you thinking of depositing?"
        ],
        hints: ["Five hundred dollars to start.", "I'd like to deposit a thousand."]
      },
      {
        id: "amount", objective: "回答金额", requires: ["amount"], skillId: "specify",
        bot: [
          "Excellent. Everything's in order — your account should be active within the hour.",
          "Great, that's all set. You'll get the card by mail in five working days.",
          "Done! Here's your reference slip."
        ],
        hints: ["Great, thank you!"]
      },
      {
        id: "close", objective: "业务完成道别", optional: true, skillId: "greet-small",
        bot: [
          "Is there anything else I can help with? No? Have a great day!",
          "Anything else for you today? Enjoy the rest of your day!",
          "All done then — thanks for banking with us!"
        ],
        hints: ["No, that's all. Thank you so much!"]
      }
    ],
    incidents: [
      {
        id: "system-down", minDifficulty: 2, objective: "应对系统故障",
        bot: "I'm so sorry — our system just went down for maintenance. It should be back within an hour. Would you like to wait, or come back later this afternoon?",
        accept: ["wait", "later", "come back", "ok", "okay", "sure", "yes", "afternoon", "tomorrow", "fine"],
        zhs: "系统维护，等待或稍后再来",
        hints: ["I'll come back later this afternoon.", "I can wait for an hour."]
      },
      {
        id: "daily-limit", minDifficulty: 3, objective: "应对超出当日限额",
        bot: "Hmm, this withdrawal exceeds your daily limit. I could split it into two transactions across today and tomorrow, or you can lower the amount. What would you like?",
        accept: ["split", "tomorrow", "lower", "less", "ok", "okay", "sure", "yes", "another", "reduce", "hundred"],
        zhs: "超过当日取现限额，拆分或减额",
        hints: ["Let's split it then.", "I'll take a smaller amount today."]
      },
      {
        id: "promo", minDifficulty: 2, objective: "应对推销信用卡",
        bot: "Before you go — you're pre-approved for our new cashback credit card. First year's free. Would you like to hear more?",
        accept: ["yes", "sure", "ok", "no", "no thanks", "maybe", "later", "hear more", "tell me", "why not"],
        zhs: "推销免年费返现信用卡",
        hints: ["Maybe another time, thanks.", "Sure, tell me more."]
      }
    ]
  },

  {
    id: "interview",
    title: "工作面试",
    icon: "💼",
    level: "B1+",
    goal: "自我介绍、讲优势、回答动机问题",
    partner: { name: "Sarah", role: "Interviewer", lang: "en-US", pitch: 1.0, rate: 0.97 },
    slots: {
      years: ["two years", "three years", "five years", "one year", "ten years", "2 years", "3 years", "5 years"],
      strength: ["communication", "teamwork", "leadership", "problem solving", "coding", "design", "marketing", "learning", "fast learner", "organized"],
      why: ["growth", "challenge", "passion", "opportunity", "culture", "team", "learn", "product", "industry"],
      question: ["could you", "can you", "what", "how", "when", "where", "why"],
      yesno: ["yes", "yeah", "sure", "ok", "please", "no"]
    },
    beats: [
      {
        id: "greet", objective: "面试寒暄", optional: true, skillId: "greet-small",
        bot: [
          "Hi, thanks for coming in today. I'm Sarah, the team lead. Did you find the office okay?",
          "Hello! Great to meet you. I'm Sarah — hope the commute wasn't too rough?",
          "Hi there, welcome! I'm Sarah. Ready to get started?"
        ],
        hints: ["Hi Sarah! Yes, no problem at all. Nice to meet you."]
      },
      {
        id: "intro", objective: "自我介绍（年限）", requires: ["years"], skillId: "narrate", allowIncident: true,
        bot: [
          "Great. So, tell me a little about yourself and your experience.",
          "Let's start easy — walk me through your background.",
          "Alright, give me the two-minute version of your career so far."
        ],
        hints: ["I've been working in marketing for three years, mostly on digital campaigns."]
      },
      {
        id: "strength", objective: "讲优势", requires: ["strength"], skillId: "narrate",
        bot: [
          "Interesting. What would you say is your biggest strength?",
          "Nice background. And what do you bring that others don't?",
          "Good. If I asked your last manager — what would they praise you for?"
        ],
        hints: ["I'd say problem solving — I enjoy untangling messy situations."]
      },
      {
        id: "why", objective: "回答动机", requires: ["why"], skillId: "narrate",
        bot: [
          "Last one from me — why us? What made you apply here?",
          "So, why this company in particular?",
          "What is it about this role that interests you?"
        ],
        hints: ["Your product is in a space I really care about, and I want room to grow."]
      },
      {
        id: "close", objective: "反问环节", optional: true, skillId: "clarify",
        bot: [
          "That's everything from my side. Do you have any questions for us?",
          "Well, that's all I've got. Anything you'd like to ask me?",
          "We're out of time on my end — any questions before we wrap up?"
        ],
        hints: ["Yes — could you tell me what the team is like?", "What does success look like in the first three months?"]
      }
    ],
    incidents: [
      {
        id: "why-leave", minDifficulty: 2, objective: "应对离职原因追问",
        bot: "Before we move on — why are you leaving your current job? Just so I understand the motivation.",
        accept: ["growth", "grow", "challenge", "learn", "opportunity", "career", "team", "culture", "looking for", "next step", "company"],
        zhs: "被追问离职原因",
        hints: ["Honestly, I've grown a lot there, but I'm ready for a bigger challenge."]
      },
      {
        id: "salary", minDifficulty: 3, objective: "应对薪资期望",
        bot: "Let's address the elephant in the room — what are your salary expectations for this role?",
        accept: ["negotiable", "flexible", "open", "forty", "fifty", "sixty", "seventy", "thousand", "hundred", "based", "market", "range", "depending"],
        zhs: "被问薪资期望",
        hints: ["I'm flexible — somewhere in the market range for this role.", "Around sixty thousand, but I'm open to discussing it."]
      },
      {
        id: "weakness", minDifficulty: 2, objective: "应对缺点问题",
        bot: "Classic question, I know — what's a weakness you're actively working on?",
        accept: ["sometimes", "working on", "learning", "improve", "tend", "too", "focus", "detail", "delegate", "say no", "patience", "trying to"],
        zhs: "被问缺点",
        hints: ["I tend to dig into details too much — I'm learning to delegate sooner."]
      }
    ]
  },

  {
    id: "smalltalk",
    title: "邻居寒暄",
    icon: "💬",
    level: "A2",
    goal: "和邻居自然寒暄、回应近况、约下次见面",
    partner: { name: "Ben", role: "Neighbor", lang: "en-US", pitch: 1.02, rate: 1.0 },
    slots: {
      weather: ["sunny", "rain", "raining", "cold", "hot", "warm", "nice", "cloudy", "windy", "weekend"],
      plan: ["coffee", "lunch", "walk", "drink", "barbecue", "bbq", "party", "dinner", "game", "hike"],
      time: ["saturday", "sunday", "tomorrow", "weekend", "tonight", "this week", "next week", "morning"],
      place: ["my place", "your place", "cafe", "park", "garden", "home"],
      yesno: ["yes", "yeah", "sure", "ok", "please", "no", "nope"]
    },
    beats: [
      {
        id: "greet", objective: "见面寒暄天气", requires: ["weather"], skillId: "greet-small", allowIncident: true,
        bot: [
          "Oh hey, good morning! Beautiful day, isn't it?",
          "Morning, neighbor! Gosh, it's chilly out here today.",
          "Well hello! Lovely weather we're having, huh?"
        ],
        hints: ["Morning! Yes, such a sunny day.", "Hi! I know, it's really warm for this time of year."]
      },
      {
        id: "life", objective: "回应近况闲聊", optional: true, skillId: "greet-small",
        bot: [
          "How've you been? Still surviving the renovation?",
          "How's life on your side of the fence? Kids doing well?",
          "Good to see you out and about — how have things been?"
        ],
        hints: ["Pretty good, thanks! Busy with work, but can't complain."]
      },
      {
        id: "invite", objective: "发出或接受邀约", requires: ["plan", "time"], skillId: "book-arrange",
        bot: [
          "Listen — we should grab that coffee sometime. Are you free this weekend?",
          "Hey, we're having people over for a barbecue Saturday. Interested?",
          "We should really do that walk we keep talking about. Sunday morning?"
        ],
        hints: ["Sure! Coffee on Saturday sounds great.", "A walk Sunday morning works for me!"]
      },
      {
        id: "close", objective: "道别", optional: true, skillId: "greet-small",
        bot: [
          "Perfect, it's a plan then! See you Saturday.",
          "Great — I'll bring the pastries. See you then!",
          "Awesome. I'll knock on your door around ten!"
        ],
        hints: ["See you then. Have a good one!"]
      }
    ],
    incidents: [
      {
        id: "noise", minDifficulty: 2, objective: "应对噪音抱怨",
        bot: "Ah, before I forget — sorry again about the drill noise last week. The workers ran over schedule. Hope it wasn't too painful?",
        accept: ["no problem", "ok", "okay", "fine", "no worries", "it's fine", "dont worry", "don't worry", "thanks", "apologize", "understand", "sure"],
        zhs: "邻居为装修噪音道歉",
        hints: ["No worries at all — renovations happen!", "It's fine, though maybe warn me next time!"]
      },
      {
        id: "borrow", minDifficulty: 2, objective: "应对借东西请求",
        bot: "By the way, could we borrow your folding chairs for the barbecue? Ours are falling apart!",
        accept: ["yes", "yeah", "sure", "of course", "no problem", "ok", "okay", "no", "sorry", "can't", "cant"],
        zhs: "借折叠椅",
        hints: ["Of course, no problem!", "Sorry, we're using them that day."]
      },
      {
        id: "package", minDifficulty: 3, objective: "应对包裹代收",
        bot: "One more thing — a bulky package for you arrived at our place while you were out. Want to grab it now, or should I drop it by later?",
        accept: ["now", "grab", "later", "drop", "ok", "okay", "sure", "yes", "please", "thanks", "thank", "pick up"],
        zhs: "代收了包裹",
        hints: ["I'll grab it now, thanks so much!", "Just drop it by whenever's convenient."]
      }
    ]
  }
];
