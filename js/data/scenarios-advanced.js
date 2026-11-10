// 场景库：basic = A2/B1 生存与生活线（11 个），advanced = B1+/C1 进阶线 + 服务线补充（14 个）。
// beat 字段约定见 scenarios-basic.js 文件头。结构由 tests/content.test.js 门禁校验。

export const SCENARIOS_ADVANCED = [
  {
    id: "supermarket",
    title: "超市结账",
    icon: "🛒",
    level: "A2",
    goal: "找到商品、选袋子、完成结账",
    partner: { name: "Nate", role: "Cashier", lang: "en-US", pitch: 1.0, rate: 1.0 },
    slots: {
      item: ["milk", "eggs", "bread", "butter", "cheese", "apples", "bananas", "rice", "juice", "yogurt"],
      counter: ["checkout", "self checkout", "counter", "aisle"],
      bag: ["plastic bag", "reusable bag", "paper bag", "my bag", "no bag"],
      pay: ["card", "cash", "phone", "visa"],
      yesno: ["yes", "yeah", "sure", "ok", "please", "no", "no thanks"]
    },
    beats: [
      {
        id: "greet", objective: "结账问好", optional: true, skillId: "greet-small",
        bot: [
          "Hi there! Did you find everything okay?",
          "Hello! All set to check out?",
          "Hey, how are you today? Find everything?"
        ],
        hints: ["Yes, thanks, I found everything."]
      },
      {
        id: "bag", objective: "回答是否需要袋子", requires: ["bag"], skillId: "specify", allowIncident: true,
        bot: [
          "Would you like a bag today?",
          "Do you need a bag, or did you bring your own?",
          "Bag for you? We have paper or reusable."
        ],
        hints: ["Just a plastic bag, please.", "No bag, I brought my own."]
      },
      {
        id: "pay", objective: "完成支付", requires: ["pay"], skillId: "ask-price",
        bot: [
          "That's twenty-three eighty. How are you paying?",
          "Twenty-three eighty altogether — card or cash?",
          "Alright, twenty-three eighty. Tap or insert?"
        ],
        hints: ["By card, please."]
      },
      {
        id: "close", objective: "道别", optional: true, skillId: "greet-small",
        bot: [
          "Here's your receipt. Have a good one!",
          "All done — receipt in the bag. See you next time!",
          "Thanks for shopping with us. Take care!"
        ],
        hints: ["Thank you, bye!"]
      }
    ],
    incidents: [
      {
        id: "scan-error", minDifficulty: 2, objective: "应对扫码价格不符",
        bot: "Hmm, the eggs are scanning at six fifty, but the shelf said four ninety. Let me get a price check — it'll just be a moment, okay?",
        accept: ["ok", "okay", "sure", "fine", "yes", "wait", "thanks", "no problem"],
        zhs: "扫码价与货架价不符，等价格核对",
        hints: ["Sure, no problem.", "That's fine, I'll wait."]
      },
      {
        id: "card-min", minDifficulty: 3, objective: "应对刷卡最低消费",
        bot: "Just a heads-up — the card machine has a ten-dollar minimum, and you're at eight twenty. Would you like to grab something small, or pay cash?",
        accept: ["cash", "add", "grab", "something", "ok", "okay", "sure", "fine", "chocolate", "gum", "yes"],
        zhs: "刷卡有最低消费，凑单或付现金",
        hints: ["I'll grab a chocolate bar.", "Let me pay cash then."]
      },
      {
        id: "out-of-stock", minDifficulty: 2, objective: "应对缺货",
        bot: "Oh — I'm afraid this yogurt expired today, we can't sell it. There's more in aisle six, or I can call someone. What would you like?",
        accept: ["aisle", "get", "another", "replace", "ok", "okay", "sure", "fine", "yes", "different", "call"],
        zhs: "酸奶过期不能卖，去货架换或叫人",
        hints: ["I'll grab another one, be right back.", "Could someone get one for me?"]
      }
    ]
  },

  {
    id: "salon",
    title: "理发店",
    icon: "💈",
    level: "A2",
    goal: "说清发型要求，处理一个意外",
    partner: { name: "Alex", role: "Hairdresser", lang: "en-GB", pitch: 1.05, rate: 0.98 },
    slots: {
      cut: ["trim", "short cut", "buzz cut", "layers", "bob", "a trim", "haircut"],
      length: ["short", "medium", "long", "little off", "an inch", "two inches", "off the shoulders"],
      wash: ["wash", "shampoo", "no wash", "quick wash"],
      color: ["dye", "color", "highlights", "no color", "balayage"],
      pay: ["card", "cash", "phone"]
    },
    beats: [
      {
        id: "greet", objective: "进店问好", optional: true, skillId: "greet-small",
        bot: [
          "Hi! Come on in — take a seat. What are we doing today?",
          "Hey, welcome! What can I do for you today?",
          "Hello! Just waiting? No? Great — what are we working with?"
        ],
        hints: ["Hi! I'd like a trim, please."]
      },
      {
        id: "style", objective: "说明想要的发型", requires: ["cut"], skillId: "specify", allowIncident: true,
        bot: [
          "Sure! And how much are we taking off?",
          "Got it. How much length are we losing?",
          "Nice. Short, medium, or just the ends?"
        ],
        hints: ["Just a trim — maybe an inch off the ends.", "Cut it short, please."]
      },
      {
        id: "length", objective: "确认长度", requires: ["length"], skillId: "clarify",
        bot: [
          "Perfect. Would you like a wash as well? It's included.",
          "Okay! Shampoo first, then?",
          "Right — quick wash before we start?"
        ],
        hints: ["Yes, a wash would be great.", "No wash today, thanks."]
      },
      {
        id: "wash", objective: "回答洗头/染色", requires: ["wash"], skillId: "specify",
        bot: [
          "Lovely. Any color today, or keep it natural?",
          "While we're at it — thinking about any color?",
          "All set. Color too, or just the cut?"
        ],
        hints: ["No color today, thanks.", "Actually, could you add some highlights?"]
      },
      {
        id: "close", objective: "剪完道别", optional: true, skillId: "greet-small",
        bot: [
          "All done! What do you think? That'll be eighteen pounds.",
          "Ta-da! Eighteen at the counter — card or cash?",
          "Finished! Let's settle up — eighteen today."
        ],
        hints: ["Looks great, thank you! Card please."]
      }
    ],
    incidents: [
      {
        id: "double-booked", minDifficulty: 2, objective: "应对预约冲突等待",
        bot: "Oh no — I'm so sorry, my last client is running fifteen minutes late. Would you like to wait with a coffee, or pop back in a bit?",
        accept: ["wait", "coffee", "pop back", "come back", "later", "ok", "okay", "sure", "fine", "yes"],
        zhs: "上一个客人拖延，等待或晚点回来",
        hints: ["I'll wait with a coffee, thanks.", "I'll pop back in fifteen."]
      },
      {
        id: "too-short", minDifficulty: 3, objective: "应对剪太短的确认",
        bot: "Before I go further — this is quite short already. Want me to stop here, or take it up another half inch? I can't put it back, so say the word.",
        accept: ["stop", "here", "keep", "ok", "okay", "yes", "sure", "half inch", "continue", "go", "fine"],
        zhs: "已经很短，确认停还是继续",
        hints: ["Let's stop there, actually.", "Keep going, it's fine."]
      },
      {
        id: "color-wait", minDifficulty: 2, objective: "应对染色加时",
        bot: "Just so you know, the color needs forty minutes to develop — that pushes your appointment by an hour. Still okay?",
        accept: ["ok", "okay", "sure", "fine", "yes", "no", "wait", "another day", "reschedule", "next time", "skip"],
        zhs: "染色要多等一小时，接受或改天",
        hints: ["That's fine, I've got time.", "Let's skip the color today then."]
      }
    ]
  },

  {
    id: "cinema",
    title: "看电影",
    icon: "🎬",
    level: "A2",
    goal: "买票选场次、加零食，处理一个意外",
    partner: { name: "Robin", role: "Box Office Clerk", lang: "en-US", pitch: 1.08, rate: 1.0 },
    slots: {
      movie: ["action movie", "comedy", "horror", "drama", "animated", "the new one", "space movie"],
      time: ["seven o'clock", "eight", "nine", "morning show", "evening", "late show"],
      seats: ["two seats", "two tickets", "one ticket", "three tickets", "seat"],
      snack: ["popcorn", "coke", "nachos", "sweet popcorn", "salted popcorn", "water"],
      pay: ["card", "cash", "phone"]
    },
    beats: [
      {
        id: "greet", objective: "售票口问好", optional: true, skillId: "greet-small",
        bot: [
          "Hi! What can I get you?",
          "Evening! Picking a movie tonight?",
          "Hello! For which show?"
        ],
        hints: ["Hi! Two tickets for tonight, please."]
      },
      {
        id: "pick", objective: "选电影和场次", requires: ["movie", "time"], skillId: "order-food", allowIncident: true,
        bot: [
          "Sure — and for which showing? We have seven and nine thirty.",
          "Good pick! Seven o'clock or the late show?",
          "Yep, that one's on at seven and nine thirty. Which works?"
        ],
        hints: ["Two tickets for the seven o'clock show, please."]
      },
      {
        id: "seats", objective: "确认票数和座位", requires: ["seats"], skillId: "specify",
        bot: [
          "Any snacks with that? Popcorn's fresh!",
          "Want to add popcorn and a drink for six dollars?",
          "The combo deal is popcorn plus a drink — interested?"
        ],
        hints: ["Yes, a salted popcorn and a coke, please.", "No snacks, just the tickets."]
      },
      {
        id: "close", objective: "取票道别", optional: true, skillId: "ask-price",
        bot: [
          "That's twenty-four all in — enjoy the show!",
          "Twenty-four total. Screen three, on your left!",
          "Here you go — screen three. Enjoy!"
        ],
        hints: ["By card. Thank you!"]
      }
    ],
    incidents: [
      {
        id: "sold-out", minDifficulty: 2, objective: "应对场次售罄",
        bot: "Ah, the seven o'clock is sold out, I'm afraid. We've got the nine thirty, or the 3D version at eight for two dollars more. What do you think?",
        accept: ["nine", "nine thirty", "3d", "eight", "next", "later", "ok", "okay", "sure", "yes", "wait"],
        zhs: "七点场售罄，改九点半或 3D 场",
        hints: ["The nine thirty is fine.", "Let's try the 3D one."]
      },
      {
        id: "apart", minDifficulty: 3, objective: "应对座位不连",
        bot: "Heads up — only single seats are left together-ish: F3 and F7, one row apart. Take those, or try tomorrow's show?",
        accept: ["take", "ok", "okay", "sure", "yes", "tomorrow", "another", "different", "wait", "fine"],
        zhs: "只剩分开的座位，接受或改天",
        hints: ["We'll take them, it's fine.", "Let's come back tomorrow then."]
      },
      {
        id: "projector", minDifficulty: 2, objective: "应对放映故障退票",
        bot: "Really sorry — the projector's acting up for that screen. We can refund you fully, or swap you into the ten o'clock with a free popcorn. What works?",
        accept: ["refund", "money back", "swap", "ten", "popcorn", "ok", "okay", "sure", "yes", "free", "later"],
        zhs: "放映机故障，全额退票或换场+爆米花",
        hints: ["We'll take the refund, thanks.", "Swap us into the ten o'clock, sure."]
      }
    ]
  },

  {
    id: "pharmacy",
    title: "药房买药",
    icon: "💊",
    level: "A2",
    goal: "描述症状、选药，处理一个意外",
    partner: { name: "Grace", role: "Pharmacist", lang: "en-US", pitch: 1.1, rate: 0.95 },
    slots: {
      symptom: ["headache", "cough", "cold", "fever", "allergy", "sore throat", "runny nose", "stomach"],
      medicine: ["painkillers", "cough syrup", "allergy pills", "vitamins", "cold medicine", "ibuprofen", "lozenges"],
      form: ["tablets", "syrup", "spray", "cream", "capsules"],
      prescription: ["prescription", "no prescription", "doctor's note", "without prescription"],
      yesno: ["yes", "yeah", "no", "nope", "sure", "ok"]
    },
    beats: [
      {
        id: "greet", objective: "柜台问好", optional: true, skillId: "greet-small",
        bot: [
          "Hello! How can I help you today?",
          "Hi there — what can I get for you?",
          "Good afternoon! What are you looking for?"
        ],
        hints: ["Hi! Something for a cough, please."]
      },
      {
        id: "symptom", objective: "描述症状", requires: ["symptom"], skillId: "specify", allowIncident: true,
        bot: [
          "I see. Dry cough or with a fever?",
          "Okay — is it just the cough, or anything else going on?",
          "Alright. Any fever or sore throat with it?"
        ],
        hints: ["A dry cough and a bit of a sore throat.", "Just the cough, no fever."]
      },
      {
        id: "form", objective: "选药剂形式", requires: ["form"], skillId: "specify",
        bot: [
          "We have it as syrup or tablets. Which do you prefer?",
          "Syrup works faster, tablets are easier to carry — your call!",
          "Would you like the syrup or the tablets?"
        ],
        hints: ["The syrup, please.", "Tablets are easier for me."]
      },
      {
        id: "close", objective: "听用药叮嘱", optional: true, skillId: "clarify",
        bot: [
          "Here you go — twice daily after meals. If it lasts more than a week, see a doctor. Get well soon!",
          "That's the one. Two spoonfuls morning and night. Take care!",
          "All set — and plenty of fluids! Hope you feel better soon."
        ],
        hints: ["Got it, thank you so much!"]
      }
    ],
    incidents: [
      {
        id: "need-prescription", minDifficulty: 2, objective: "应对需要处方",
        bot: "I'm afraid the stronger version needs a prescription. The over-the-counter one is milder — or you could see the doctor next door. What would you like?",
        accept: ["milder", "over the counter", "doctor", "prescription", "ok", "okay", "sure", "yes", "the mild", "weaker", "next door"],
        zhs: "强效药需处方，选温和版或看医生",
        hints: ["The milder one is fine.", "I'll go see the doctor then."]
      },
      {
        id: "generic", minDifficulty: 3, objective: "应对品牌缺货换仿制药",
        bot: "We're out of the brand name, but the generic has the exact same ingredient — it's three dollars cheaper. Shall I grab that instead?",
        accept: ["generic", "yes", "sure", "ok", "okay", "cheaper", "grab", "fine", "thanks", "same"],
        zhs: "品牌药缺货，同成分仿制药更便宜",
        hints: ["Sure, the generic works.", "Is it really the same? Then yes."]
      },
      {
        id: "allergy-check", minDifficulty: 2, objective: "应对过敏询问",
        bot: "Quick check before you take it — any allergies to aspirin or ibuprofen? Just want to be safe.",
        accept: ["no", "none", "no allergies", "not allergic", "yes", "allergic", "aspirin", "penicillin", "dont think", "don't think", "ok"],
        zhs: "购药前询问药物过敏",
        hints: ["No allergies that I know of.", "Actually, aspirin upsets my stomach."]
      }
    ]
  },

  {
    id: "post",
    title: "寄快递",
    icon: "📦",
    level: "A2",
    goal: "寄包裹、选速度，处理一个意外",
    partner: { name: "Sam", role: "Postal Clerk", lang: "en-GB", pitch: 1.0, rate: 0.97 },
    slots: {
      service: ["send a package", "mail a letter", "postcard", "express", "international", "parcel"],
      destination: ["china", "usa", "uk", "australia", "canada", "europe", "japan"],
      speed: ["standard", "express", "fast", "economy", "air mail", "sea mail"],
      weight: ["one kilo", "two kilos", "half a kilo", "five hundred grams", "kilo"],
      pay: ["card", "cash", "phone"]
    },
    beats: [
      {
        id: "greet", objective: "柜台问好", optional: true, skillId: "greet-small",
        bot: [
          "Morning! Sending something today?",
          "Hello! Post office — what can I do for you?",
          "Hi there! Posting a parcel?"
        ],
        hints: ["Hi! I'd like to send this package, please."]
      },
      {
        id: "service", objective: "说明寄什么、去哪", requires: ["service", "destination"], skillId: "order-food", allowIncident: true,
        bot: [
          "Sure! And where's it heading?",
          "Right — which country are we sending to?",
          "Got it. Destination?"
        ],
        hints: ["To China, please. It's about two kilos."]
      },
      {
        id: "speed", objective: "选邮寄速度", requires: ["speed"], skillId: "specify",
        bot: [
          "Express takes five days at forty-two, standard is two weeks at twenty-eight. Which one?",
          "We've got express — five days — or the slower economy option. Your pick!",
          "Fast or cheap, the eternal question. Which shall it be?"
        ],
        hints: ["Standard is fine, I'm not in a hurry.", "Express, please — it's a gift."]
      },
      {
        id: "close", objective: "付邮费道别", optional: true, skillId: "ask-price",
        bot: [
          "That's twenty-eight altogether. Here's your tracking number — keep it safe!",
          "Twenty-eight, please. The tracking code's on the receipt.",
          "All done! Tracking number's on there. Anything else?"
        ],
        hints: ["By card. Thank you!"]
      }
    ],
    incidents: [
      {
        id: "customs", minDifficulty: 2, objective: "应对需要报关单",
        bot: "Since it's going abroad, you'll need to fill in a customs form — what's inside, roughly? Books, clothes, gifts?",
        accept: ["books", "clothes", "gift", "gifts", "food", "form", "ok", "okay", "sure", "yes", "fill", "electronics", "tea"],
        zhs: "国际件需填报关单",
        hints: ["Just some books and a scarf as a gift.", "Clothes, nothing valuable."]
      },
      {
        id: "box-damaged", minDifficulty: 3, objective: "应对包装不合格",
        bot: "Hmm, this box is a bit battered — it might not survive the trip. We sell a proper box for three dollars, or you can repack it yourself at the table over there. What do you prefer?",
        accept: ["buy", "box", "repack", "table", "ok", "okay", "sure", "yes", "three dollars", "new box", "fine"],
        zhs: "包装破损，买新箱或自行重新打包",
        hints: ["I'll buy the box, easier.", "Let me repack it over there."]
      },
      {
        id: "delay", minDifficulty: 2, objective: "应对时效延误提示",
        bot: "Small heads-up — there's a backlog to China right now, so even express may take an extra week. Still want to send it today?",
        accept: ["yes", "still", "send", "ok", "okay", "sure", "wait", "later", "next week", "come back", "fine"],
        zhs: "清关积压时效延长，仍寄或改天",
        hints: ["That's okay, send it today please.", "I might wait then — I'll come back next week."]
      }
    ]
  },

  {
    id: "train",
    title: "火车站购票",
    icon: "🚆",
    level: "A2",
    goal: "买票选班次，处理一个意外",
    partner: { name: "Olivia", role: "Ticket Agent", lang: "en-GB", pitch: 1.12, rate: 0.98 },
    slots: {
      destination: ["london", "manchester", "leeds", "york", "birmingham", "the airport", "cambridge"],
      time: ["next train", "nine o'clock", "ten", "morning", "afternoon", "evening", "return"],
      ticket: ["single", "return", "one way", "round trip", "day return"],
      class: ["first class", "standard", "economy", "second class"],
      pay: ["card", "cash", "phone"]
    },
    beats: [
      {
        id: "greet", objective: "售票处问好", optional: true, skillId: "greet-small",
        bot: [
          "Good morning! Where to today?",
          "Hello! Single or return?",
          "Morning! Which destination?"
        ],
        hints: ["Good morning! A return to London, please."]
      },
      {
        id: "book", objective: "说目的地和班次", requires: ["destination", "time"], skillId: "book-arrange", allowIncident: true,
        bot: [
          "London — of course. Single or return?",
          "Sure. One way or round trip?",
          "Right. And just the one way, or coming back?"
        ],
        hints: ["A return for the next train, please."]
      },
      {
        id: "ticket", objective: "选票种", requires: ["ticket"], skillId: "specify",
        bot: [
          "And standard or first class? First is quieter, with wifi.",
          "Standard's forty-two, first is seventy. Which takes your fancy?",
          "Any preference on class?"
        ],
        hints: ["Standard is fine, thank you."]
      },
      {
        id: "close", objective: "取票找站台", optional: true, skillId: "clarify",
        bot: [
          "Here you go — platform six, departing in twelve minutes. Mind the gap!",
          "All sorted! Platform six, leaves at nine oh two. Have a good trip!",
          "Tickets printed — platform six. Run, you'll just make it!"
        ],
        hints: ["Thank you so much!"]
      }
    ],
    incidents: [
      {
        id: "cancelled", minDifficulty: 2, objective: "应对班次取消",
        bot: "Bad news, I'm afraid — the nine o'clock is cancelled due to signalling faults. There's the ten fifteen, or a slower stopping service at nine forty. What would you prefer?",
        accept: ["ten", "ten fifteen", "nine forty", "slower", "next", "later", "ok", "okay", "sure", "yes", "wait", "refund"],
        zhs: "九点班次取消，改十点十五或慢车",
        hints: ["The ten fifteen works, thanks.", "When's the next one I can catch?"]
      },
      {
        id: "strike", minDifficulty: 3, objective: "应对罢工改大巴",
        bot: "There's a strike on Friday — trains are replaced by buses part of the way. It adds about forty minutes. Do you still want that ticket, or travel Thursday instead?",
        accept: ["bus", "still", "thursday", "yes", "ok", "okay", "sure", "refund", "change", "later", "fine"],
        zhs: "罢工日火车改大巴绕行",
        hints: ["I'll take my chances with the bus.", "Let me switch to Thursday then."]
      },
      {
        id: "reservation", minDifficulty: 2, objective: "应对需订座",
        bot: "Small thing — that train requires a seat reservation, which is free. Window or aisle?",
        accept: ["window", "aisle", "any", "dont mind", "don't mind", "ok", "okay", "sure", "yes", "whatever", "quiet"],
        zhs: "该班次需订座（免费），选靠窗/过道",
        hints: ["Window seat, please.", "Whatever's free, I don't mind."]
      }
    ]
  },

  {
    id: "carrental",
    title: "租车",
    icon: "🚗",
    level: "B1",
    goal: "选车型、定保险，处理一个意外",
    partner: { name: "Max", role: "Rental Agent", lang: "en-US", pitch: 0.98, rate: 1.0 },
    slots: {
      cartype: ["compact", "suv", "sedan", "convertible", "van", "economy"],
      days: ["one day", "two days", "three days", "a week", "weekend", "five days"],
      insurance: ["full insurance", "basic insurance", "no insurance", "full cover", "basic cover"],
      extra: ["gps", "child seat", "additional driver", "no extras", "nothing"],
      pay: ["card", "credit card", "cash"]
    },
    beats: [
      {
        id: "greet", objective: "柜台问好", optional: true, skillId: "greet-small",
        bot: [
          "Welcome in! Picking up a rental today?",
          "Afternoon! Have a reservation with us?",
          "Hi there! Looking to rent a car?"
        ],
        hints: ["Hi! Yes, I'd like to rent a car for the weekend."]
      },
      {
        id: "car", objective: "选车型和天数", requires: ["cartype", "days"], skillId: "order-food", allowIncident: true,
        bot: [
          "Nice. And what level of cover would you like — basic or full?",
          "Great choice. Now, insurance: basic covers the car, full covers everything. Which one?",
          "Perfect. Let's talk insurance — full peace of mind, or keep it basic?"
        ],
        hints: ["A compact SUV for two days.", "An economy car for a week, please."]
      },
      {
        id: "insurance", objective: "定保险", requires: ["insurance"], skillId: "specify",
        bot: [
          "Good call. Any extras — GPS, child seat, additional driver?",
          "Sure. Would you like to add anything on top?",
          "Any add-ons, or keep it simple?"
        ],
        hints: ["Full insurance, please. And a GPS.", "Basic cover is fine, no extras."]
      },
      {
        id: "extra", objective: "选附加项", requires: ["extra"], skillId: "ask-price",
        bot: [
          "Perfect. I'll just need a card for the deposit — two hundred, refunded when you bring her back clean.",
          "All set! Deposit's two hundred on a card, and you're good to go.",
          "Great — card for the deposit, please. Sign here and the keys are yours."
        ],
        hints: ["Here's my card.", "Could I pay the deposit in cash?"]
      },
      {
        id: "close", objective: "取车验车", optional: true, skillId: "clarify",
        bot: [
          "She's in bay eleven — fuel's full, bring it back full. Enjoy the drive!",
          "Here are the keys! Bay eleven. Watch the scratch on the bumper, it's noted.",
          "All yours! Check the car over first, then off you go. Safe driving!"
        ],
        hints: ["Great, thanks! One more thing — is the fuel policy full-to-full?"]
      }
    ],
    incidents: [
      {
        id: "model-out", minDifficulty: 2, objective: "应对预订车型无车",
        bot: "Bit of a snag — we're out of compacts until tomorrow. I can upgrade you to the SUV free of charge, or a smaller economy with ten dollars off. What suits you?",
        accept: ["suv", "upgrade", "economy", "smaller", "ten", "discount", "ok", "okay", "sure", "yes", "tomorrow", "wait", "free"],
        zhs: "预订车型没车，免费升级或降级减钱",
        hints: ["The free upgrade sounds great.", "I'll take the cheaper one."]
      },
      {
        id: "deposit", minDifficulty: 3, objective: "应对押金金额争议",
        bot: "Just to flag — for the convertible the deposit is five hundred, not two. It drops off after a week. Still okay, or switch to the sedan?",
        accept: ["ok", "okay", "sure", "fine", "yes", "sedan", "switch", "keep", "convertible", "five hundred", "no problem"],
        zhs: "押金比预期高，接受或换车",
        hints: ["That's fine, I'll keep it.", "Let me switch to the sedan then."]
      },
      {
        id: "mileage", minDifficulty: 2, objective: "应对里程限制",
        bot: "One heads-up — this rate includes two hundred kilometers a day, extra miles are thirty cents each. If you're driving far, the unlimited package is fifteen a day. Interested?",
        accept: ["unlimited", "package", "yes", "ok", "okay", "sure", "no", "stay", "fine", "fifteen", "interested", "thanks"],
        zhs: "每日限 200 公里，超程计费或买不限量包",
        hints: ["I'll take the unlimited package.", "No thanks, we're staying local."]
      }
    ]
  },

  {
    id: "renting",
    title: "看房租房",
    icon: "🏠",
    level: "B1",
    goal: "问房型设施、报预算，处理一个意外",
    partner: { name: "Chloe", role: "Letting Agent", lang: "en-GB", pitch: 1.08, rate: 0.98 },
    slots: {
      rooms: ["one bedroom", "two bedrooms", "studio", "three bedrooms", "one bed", "two bed"],
      feature: ["balcony", "parking", "garden", "furnished", "pet friendly", "lift", "elevator"],
      budget: ["eight hundred", "a thousand", "one thousand", "twelve hundred", "nine hundred", "budget"],
      movein: ["next week", "this weekend", "end of month", "immediately", "first of month", "asap"],
      yesno: ["yes", "yeah", "no", "not really", "sure", "ok"]
    },
    beats: [
      {
        id: "greet", objective: "见面寒暄", optional: true, skillId: "greet-small",
        bot: [
          "Hi, you must be the ten o'clock viewing! I'm Chloe. Ready to have a look around?",
          "Hello! Lovely to meet you. Shall we start upstairs?",
          "Morning! You found the place okay? Great — let's go up."
        ],
        hints: ["Hi Chloe! Yes, ready when you are."]
      },
      {
        id: "rooms", objective: "确认房型需求", requires: ["rooms"], skillId: "specify", allowIncident: true,
        bot: [
          "So this is the two-bed. What made you look at this area — work, or just fancied it?",
          "It's a good size, right? Are you looking for yourself or sharing?",
          "Nice light in here, isn't it? How many people would be living here?"
        ],
        hints: ["I'm looking for a one-bedroom, just for me."]
      },
      {
        id: "feature", objective: "问设施偏好", requires: ["feature"], skillId: "specify",
        bot: [
          "And what's on your must-have list — parking, a balcony, somewhere for a desk?",
          "Anything non-negotiable for you? Pets, storage, natural light?",
          "What would make or break it for you?"
        ],
        hints: ["Natural light and somewhere to park would be ideal.", "I have a cat, so it needs to be pet-friendly."]
      },
      {
        id: "budget", objective: "报预算", requires: ["budget"], skillId: "clarify",
        bot: [
          "Perfect, good to know. And your budget — where are you comfortable landing?",
          "Mind me asking what range you're working with?",
          "What's the ceiling on rent for you?"
        ],
        hints: ["Around a thousand a month, ideally including bills.", "My budget's about twelve hundred."]
      },
      {
        id: "movein", objective: "说明入住时间", requires: ["movein"], skillId: "book-arrange",
        bot: [
          "Great. And when were you hoping to move in?",
          "What's your timeline like?",
          "When would you want to start, ideally?"
        ],
        hints: ["End of the month would be perfect.", "As soon as possible, honestly."]
      },
      {
        id: "close", objective: "结束看房", optional: true, skillId: "socialize-network",
        bot: [
          "Well, take my card — email me if you want it, and I'll hold off listing it for a day.",
          "It's been lovely showing you around. Applications are online, but call me with any questions!",
          "What did you think overall? No pressure — sleep on it and let me know by Friday."
        ],
        hints: ["I love it — I'll email you this afternoon!"]
      }
    ],
    incidents: [
      {
        id: "other-applicant", minDifficulty: 2, objective: "应对有其他申请人",
        bot: "I should be straight with you — there's another application in already. If you want it, the landlord reviews tonight. Shall I put yours in too?",
        accept: ["yes", "put", "apply", "application", "ok", "okay", "sure", "tonight", "go ahead", "please", "do it"],
        zhs: "已有其他申请，今晚房东定夺",
        hints: ["Yes please, put mine in tonight!", "What are my chances, honestly?"]
      },
      {
        id: "no-parking", minDifficulty: 3, objective: "应对不含停车位",
        bot: "One catch — parking isn't included; it's a street permit, about sixty a month, or a garage two streets away. Is that a dealbreaker?",
        accept: ["ok", "okay", "fine", "street", "permit", "garage", "yes", "no", "dealbreaker", "no problem", "sixty", "manage"],
        zhs: "不含停车位，街边许可或远处车库",
        hints: ["I can live with a street permit.", "Hmm, that's disappointing — I'll think about it."]
      },
      {
        id: "min-term", minDifficulty: 2, objective: "应对最短租期",
        bot: "Heads-up — the landlord wants a twelve-month minimum. You mentioned shorter? He might take ten with a small premium. Want me to ask?",
        accept: ["ask", "yes", "ok", "okay", "sure", "ten", "twelve", "premium", "fine", "no", "forget", "never mind"],
        zhs: "房东要一年起租，可谈十个月加价",
        hints: ["Could you ask about ten months?", "Twelve is fine actually."]
      }
    ]
  },

  {
    id: "emergency",
    title: "挂失报警",
    icon: "🆘",
    level: "B1",
    goal: "报告丢失物品、做笔录、问下一步",
    partner: { name: "Officer Reed", role: "Police Officer", lang: "en-US", pitch: 0.92, rate: 0.95 },
    slots: {
      item: ["passport", "wallet", "phone", "bag", "backpack", "purse"],
      location: ["park", "mall", "station", "restaurant", "street", "hotel", "bus", "metro"],
      report: ["report", "file a report", "report it", "a report"],
      contact: ["embassy", "consulate", "insurance", "bank", "hotline"],
      time: ["today", "yesterday", "this morning", "this afternoon", "now", "an hour ago"]
    },
    beats: [
      {
        id: "greet", objective: "报警台陈述来意", optional: true, skillId: "greet-small",
        bot: [
          "Good evening, officer will see you now. What seems to be the problem?",
          "Evening. Come forward please — what happened?",
          "Hello. Take a breath — tell me what's going on."
        ],
        hints: ["Good evening. I've lost my passport and I need to report it."]
      },
      {
        id: "what", objective: "说明丢了什么", requires: ["item"], skillId: "narrate", allowIncident: true,
        bot: [
          "I see. When did you last have it — today, yesterday?",
          "Okay. When did you notice it was missing?",
          "Right. When was the last time you saw it?"
        ],
        hints: ["My passport and my wallet, both gone.", "I lost my backpack with everything in it."]
      },
      {
        id: "when", objective: "说明时间地点", requires: ["time", "location"], skillId: "narrate",
        bot: [
          "Alright. And where were you when you noticed?",
          "Okay — do you remember where you were around then?",
          "Whereabouts did this happen?"
        ],
        hints: ["This morning, at the central station.", "Yesterday afternoon, somewhere in the park."]
      },
      {
        id: "report", objective: "正式做笔录", requires: ["report"], skillId: "clarify",
        bot: [
          "Thank you. I'll write that up — give me one moment... Here's your report copy with the reference number.",
          "Let me type this up for you... Done. This copy has the case number on top.",
          "Okay, statement taken. This is your copy — reference's at the top."
        ],
        hints: ["Yes, I need a formal report for the embassy.", "Could I get a copy of the report?"]
      },
      {
        id: "next", objective: "问下一步", requires: ["contact"], skillId: "ask-price",
        bot: [
          "You'll want to contact your embassy for a new passport — here's the address. Anything else I can do?",
          "Next step is your embassy, first thing tomorrow. And cancel those cards tonight!",
          "Call your bank to freeze the cards, then the embassy in the morning. Here's the info sheet."
        ],
        hints: ["Should I contact my embassy or the consulate?", "Do I need this report for the insurance?"]
      }
    ],
    incidents: [
      {
        id: "id-proof", minDifficulty: 2, objective: "应对需要身份证明",
        bot: "One snag — to file the report I need some form of ID. Do you have anything on you? Driving licence, a copy, even a photo on your phone?",
        accept: ["license", "licence", "driving", "copy", "photo", "phone", "id card", "no", "nothing", "dont have", "don't have", "passport copy", "yes"],
        zhs: "做笔录需要任何身份证明",
        hints: ["I have a photo of my passport on my phone.", "I'm afraid they took everything."]
      },
      {
        id: "come-back", minDifficulty: 3, objective: "应对需明天再来",
        bot: "The reporting system just went into night maintenance — full outage until six a.m. If your flight's not urgent, come back tomorrow; if it is, I'll do a paper form now. Which is it?",
        accept: ["tomorrow", "come back", "paper", "urgent", "now", "flight", "ok", "okay", "sure", "six", "morning", "yes", "no"],
        zhs: "系统夜间维护，明天再来或纸质表格",
        hints: ["My flight is tomorrow — paper form please!", "I'll come back in the morning."]
      },
      {
        id: "found", minDifficulty: 2, objective: "应对可能有失物消息",
        bot: "Actually — quick question. Someone turned in a bag this evening near the station. Could you describe what's inside, to check if it's yours?",
        accept: ["laptop", "book", "keys", "wallet", "jacket", "glasses", "bottle", "charger", "red", "blue", "black", "yes", "inside"],
        zhs: "有人捡到包，描述内物核对",
        hints: ["There's a blue laptop and my reading glasses inside.", "A grey jacket and a charger."]
      }
    ]
  },

  {
    id: "phone-complaint",
    title: "客服投诉",
    icon: "📞",
    level: "B1",
    goal: "说清问题、给订单号、提出诉求，处理一个意外",
    partner: { name: "Rita", role: "Support Agent", lang: "en-US", pitch: 1.06, rate: 0.99 },
    slots: {
      problem: ["internet is down", "wifi", "billing error", "double charged", "broken screen", "delivery late", "not working", "no signal"],
      account: ["account number", "order number", "reference", "invoice", "customer number"],
      solution: ["refund", "replacement", "repair", "cancel", "discount", "technician", "exchange"],
      time: ["today", "tomorrow", "this week", "forty-eight hours", "48 hours", "asap", "monday"],
      yesno: ["yes", "yeah", "no", "nope", "sure", "ok"]
    },
    beats: [
      {
        id: "greet", objective: "接通说明来意", optional: true, skillId: "greet-small",
        bot: [
          "Thank you for calling FiberFast, this is Rita. How can I help today?",
          "FiberFast support, Rita speaking. What seems to be the issue?",
          "Good morning, you're through to Rita at FiberFast. How may I help?"
        ],
        hints: ["Hi Rita. I'm calling about my internet — it's been down since yesterday."]
      },
      {
        id: "problem", objective: "说清问题", requires: ["problem"], skillId: "complain-resolve", allowIncident: true,
        bot: [
          "I'm sorry to hear that. Can I take your account or order number to pull this up?",
          "Oh no — let me look into that. Do you have your account number handy?",
          "Thanks for flagging that. May I have a reference or order number?"
        ],
        hints: ["The wifi has been down since yesterday morning.", "I've been double charged on my last bill."]
      },
      {
        id: "account", objective: "提供账号/订单号", requires: ["account"], skillId: "clarify",
        bot: [
          "Perfect, I can see it. So the router shows offline — and what would you like me to do: send a technician, or try fixing it here first?",
          "Got the account up. What resolution would work best for you?",
          "Thank you. I can see the issue logged. What outcome are you after?"
        ],
        hints: ["My order number is 4-4-7-7-2.", "The account number's on my bill — hang on."]
      },
      {
        id: "solution", objective: "提出诉求", requires: ["solution"], skillId: "complain-resolve",
        bot: [
          "That's fair. I've booked a technician for tomorrow morning, nine to twelve. Does that work?",
          "Done — I've processed that for you. You'll get a confirmation text in a few minutes.",
          "Absolutely, I can do that. Anything else while I have you?"
        ],
        hints: ["I'd like a refund for the days without service, please.", "Could you send a technician as soon as possible?"]
      },
      {
        id: "close", objective: "确认结束", optional: true, skillId: "clarify",
        bot: [
          "You're all set — reference number is 8842 if you need to call back. Have a lovely day!",
          "Anything else? ...No? Thanks for your patience, and sorry again for the trouble!",
          "Great. Is there anything else I can help with today?"
        ],
        hints: ["No, that's everything. Thanks for your help, Rita."]
      }
    ],
    incidents: [
      {
        id: "queue", minDifficulty: 2, objective: "应对无人工坐席",
        bot: "I do apologize — we're unusually busy today. I can offer a callback within the hour, or you can hold. Which would you prefer?",
        accept: ["callback", "call back", "hold", "wait", "ok", "okay", "sure", "yes", "hour", "fine"],
        zhs: "坐席繁忙，回拨或继续等待",
        hints: ["A callback works, thanks.", "I'll hold — I have time."]
      },
      {
        id: "warranty", minDifficulty: 3, objective: "应对过保收费",
        bot: "I've checked — your device is two months out of warranty, I'm afraid. The repair would be ninety pounds, or there's a thirty-percent loyalty discount. How would you like to proceed?",
        accept: ["repair", "ninety", "discount", "thirty", "ok", "okay", "sure", "yes", "no", "cancel", "think", "fine", "proceed", "loyalty"],
        zhs: "过保需付费维修，有忠诚折扣",
        hints: ["With the discount, that's acceptable.", "Ninety is steep — let me think about it."]
      },
      {
        id: "escalate", minDifficulty: 2, objective: "应对转接主管",
        bot: "I understand this is frustrating. I've done all I'm authorized to — would you like me to escalate to my supervisor? It's about a ten-minute wait.",
        accept: ["supervisor", "escalate", "yes", "ok", "okay", "sure", "wait", "ten", "no", "fine", "please"],
        zhs: "权限不足，转接主管需再等",
        hints: ["Yes please, escalate it.", "Ten more minutes... fine, I'll wait."]
      }
    ]
  },

  {
    id: "presentation",
    title: "演讲与答疑",
    icon: "🎤",
    level: "B1+",
    goal: "陈述核心内容、应对提问与澄清",
    partner: { name: "Prof. Hale", role: "Audience / Client", lang: "en-US", pitch: 1.0, rate: 1.0 },
    slots: {
      topic: ["results", "strategy", "roadmap", "budget", "findings", "proposal", "plan", "numbers"],
      question: ["could you", "can you", "what", "how", "why", "when", "where", "which"],
      data: ["numbers", "chart", "slide", "graph", "data", "revenue", "percentage", "figure"],
      clarify: ["sorry", "repeat", "mean", "clarify", "excuse me", "come again", "pardon"],
      yesno: ["yes", "yeah", "sure", "ok", "no"]
    },
    beats: [
      {
        id: "open", objective: "开场点题", optional: true, skillId: "present-ideas",
        bot: [
          "Thanks for presenting today. Perhaps start with the headline — what are we looking at?",
          "Alright, over to you. Give us the summary first, then the detail.",
          "We have twenty minutes. Kick us off — what's the big picture?"
        ],
        hints: ["Today I'll walk you through our Q3 results and next year's roadmap."]
      },
      {
        id: "core", objective: "陈述核心内容", requires: ["topic"], skillId: "present-ideas", allowIncident: true,
        bot: [
          "Interesting. Could you go deeper on the numbers behind that?",
          "Okay — where exactly does that figure come from?",
          "I'd like to probe that. What's driving the change?"
        ],
        hints: ["Our revenue grew twenty percent, driven mainly by the new subscription tier."]
      },
      {
        id: "data", objective: "用数据支撑", requires: ["data"], skillId: "present-ideas",
        bot: [
          "Hmm, let me push back a little — how solid is that assumption?",
          "Forgive me, that was a lot. Could you clarify the last part?",
          "Sorry — say that last bit again? The comparison, I mean."
        ],
        hints: ["If you look at the chart on slide four, the trend is consistent across regions."]
      },
      {
        id: "clarify", objective: "应对澄清请求", requires: ["clarify"], skillId: "clarify",
        bot: [
          "That's clearer, thank you. One final question from me...",
          "Got it now. Alright, last thing from my side...",
          "Much better. Okay, wrapping up my questions..."
        ],
        hints: ["Of course — let me put that another way.", "Sure, what I mean is the margin, not the revenue."]
      },
      {
        id: "close", objective: "收尾", optional: true, skillId: "present-ideas",
        bot: [
          "Thank you — clear and well-argued. We'll follow up by email this week.",
          "Good stuff. Send the deck over and we'll take it from there.",
          "Appreciated. Let's park the rest for the follow-up meeting."
        ],
        hints: ["Thank you for your time — I'll send the deck and follow up Monday."]
      }
    ],
    incidents: [
      {
        id: "projector", minDifficulty: 2, objective: "应对设备故障",
        bot: "Ah — the projector's frozen on us. While IT sorts it, could you continue without the slides? Summarize the key numbers verbally.",
        accept: ["yes", "sure", "ok", "okay", "summarize", "verbally", "continue", "go ahead", "no problem", "fine"],
        zhs: "投影仪故障，脱稿继续讲",
        hints: ["No problem — the headline numbers are...", "Sure, let me talk you through it."]
      },
      {
        id: "out-of-scope", minDifficulty: 3, objective: "应对超纲尖锐问题",
        bot: "That touches the reorganization, which honestly isn't my area. I'd rather not speculate — is it alright if I take that away and follow up?",
        accept: ["yes", "sure", "ok", "okay", "follow up", "take it away", "later", "email", "fine", "of course", "no problem"],
        zhs: "问题超出范围，承诺跟进",
        hints: ["Fair enough — follow up by Friday?", "Sure, let's park that one."]
      },
      {
        id: "time-cut", minDifficulty: 2, objective: "应对时间被砍",
        bot: "Bad news — your slot's been halved; we need the room in five minutes. Could you skip to your conclusions and recommendations?",
        accept: ["yes", "sure", "ok", "okay", "skip", "conclusions", "recommendations", "summarize", "fine", "go ahead"],
        zhs: "时间减半，直接跳结论",
        hints: ["Of course — bottom line, we recommend option B.", "Sure, the two takeaways are..."]
      }
    ]
  },

  {
    id: "networking",
    title: "行业社交",
    icon: "🤝",
    level: "B1+",
    goal: "自我介绍、找共同点、交换联系方式",
    partner: { name: "Jordan", role: "Fellow Attendee", lang: "en-US", pitch: 1.02, rate: 1.02 },
    slots: {
      role: ["developer", "designer", "manager", "founder", "student", "analyst", "engineer", "marketer"],
      industry: ["tech", "finance", "marketing", "design", "healthcare", "education", "ai", "gaming"],
      interest: ["startups", "ai", "coffee", "travel", "music", "sports", "books", "photography", "hiking"],
      exchange: ["card", "linkedin", "contact", "email", "number", "instagram"],
      plan: ["lunch", "coffee", "chat", "call", "follow up", "meet again"]
    },
    beats: [
      {
        id: "greet", objective: "破冰开场", optional: true, skillId: "socialize-network",
        bot: [
          "Hi! Mind if I join you? These things are impossible alone.",
          "Hey there — first time at one of these? I'm Jordan.",
          "Hello! Great turn-out tonight, huh? I'm Jordan."
        ],
        hints: ["Hi! Not at all — I'm new here myself."]
      },
      {
        id: "role", objective: "交换职业信息", requires: ["role"], skillId: "socialize-network", allowIncident: true,
        bot: [
          "Nice! And what field are you in?",
          "Cool — so are you on the tech side, or more the business side?",
          "Interesting! What's the industry — fintech, health, something else?"
        ],
        hints: ["I'm a developer, mostly backend work.", "I work in marketing at a startup."]
      },
      {
        id: "industry", objective: "聊行业", requires: ["industry"], skillId: "greet-small",
        bot: [
          "Oh nice, that space is heating up. Out of curiosity — what's keeping you busy outside work?",
          "Same world here, small world! So what do you do for fun, or is it all work?",
          "Got it. Weekend plans — anything fun, or recovering from the week?"
        ],
        hints: ["Honestly, most of my free time goes to photography.", "I'm big into hiking and terrible sci-fi movies."]
      },
      {
        id: "interest", objective: "找到共同话题", requires: ["interest"], skillId: "greet-small",
        bot: [
          "No way, me too! Okay, we should absolutely swap contacts before they kick us out. LinkedIn or a card?",
          "That's a coincidence! How do I find you online — LinkedIn?",
          "Love that. Give me your card, or shall we just connect on LinkedIn?"
        ],
        hints: ["Me too! Let's exchange LinkedIn.", "Here's my card."]
      },
      {
        id: "exchange", objective: "交换联系方式", requires: ["exchange"], skillId: "socialize-network",
        bot: [
          "Got it! And hey — there's a coffee thing after this tomorrow. Worth continuing the chat?",
          "Connected! We should grab a coffee sometime this month.",
          "Great meeting you, truly. Lunch next week, maybe?"
        ],
        hints: ["Absolutely — here's my LinkedIn.", "Sure! Let's do coffee."]
      },
      {
        id: "close", objective: "道别", optional: true, skillId: "socialize-network",
        bot: [
          "Brilliant. Enjoy the rest of the night — I'll ping you!",
          "Pleasure meeting you! Don't be a stranger.",
          "Take care, and talk soon!"
        ],
        hints: ["You too, Jordan! Great meeting you."]
      }
    ],
    incidents: [
      {
        id: "no-cards", minDifficulty: 2, objective: "应对名片用完",
        bot: "Ha — I've just run out of cards, classic. Phone numbers then? Or find me on LinkedIn, Jordan M.",
        accept: ["phone", "number", "linkedin", "ok", "okay", "sure", "yes", "type it", "airdrop", "fine"],
        zhs: "名片用完，改电话或 LinkedIn",
        hints: ["No worries — let's do LinkedIn.", "Sure, here's my number."]
      },
      {
        id: "name-forgot", minDifficulty: 3, objective: "应对忘名的尴尬",
        bot: "This is awkward — I'm drawing a blank. Sorry, remind me your name again? The room was loud.",
        accept: ["name is", "it's", "i'm", "call me", "no worries", "dont worry", "don't worry", "sure", "it happens", "thats", "that's"],
        zhs: "对方忘了你的名字，礼貌化解",
        hints: ["No problem at all — I'm Alex.", "Happens to the best of us! Alex."]
      },
      {
        id: "competitor", minDifficulty: 2, objective: "应对竞争对手打探",
        bot: "Interesting — speaking of your project, how are the user numbers looking? Asking for, uh, a friend at a big company.",
        accept: ["cant share", "can't share", "confidential", "sorry", "not public", "growing", "good", "cant talk", "can't talk", "let's talk offline", "another topic", "haha", "nice try"],
        zhs: "被竞品打探数据，礼貌回避",
        hints: ["Ha — those numbers stay confidential, but things are going well!", "Let's just say we're happy with growth."]
      }
    ]
  },

  {
    id: "debate",
    title: "观点交锋",
    icon: "⚖️",
    level: "B1+",
    goal: "站队、给理由、举例子、回应反驳",
    partner: { name: "Casey", role: "Debate Partner", lang: "en-GB", pitch: 0.98, rate: 1.05 },
    slots: {
      opinion: ["agree", "disagree", "i think", "in my opinion", "believe", "personally"],
      reason: ["because", "the reason", "that's why", "since", "the thing is"],
      example: ["for example", "for instance", "like when", "such as", "take"],
      counter: ["but", "however", "on the other hand", "that said", "although", "true but", "i see your point but"],
      stance: ["remote work", "ai", "social media", "electric cars", "cities", "universities"]
    },
    beats: [
      {
        id: "open", objective: "引入辩题", optional: true, skillId: "persuade-negotiate",
        bot: [
          "Alright — today's question: should companies go fully remote? Where do you land?",
          "Let's argue something fun: is social media doing more harm than good? Your side?",
          "Pick a side with me: AI in schools — yes or no?"
        ],
        hints: ["Honestly, I think remote work is here to stay."]
      },
      {
        id: "stance", objective: "亮明观点", requires: ["opinion"], skillId: "persuade-negotiate", allowIncident: true,
        bot: [
          "Bold! And why do you think that? What's the reasoning?",
          "Interesting position. What's it grounded in?",
          "Okay, defend that — give me your best reason."
        ],
        hints: ["I believe remote work helps most people focus better."]
      },
      {
        id: "reason", objective: "给出理由", requires: ["reason"], skillId: "persuade-negotiate",
        bot: [
          "Fair. Can you point to anything concrete — an example or a case?",
          "Makes sense on paper. Any real-world example?",
          "Reasonable — now make it concrete for me."
        ],
        hints: ["Because commute time just turns into productive hours."]
      },
      {
        id: "example", objective: "举出实例", requires: ["example"], skillId: "narrate",
        bot: [
          "Okay, I'll play devil's advocate: what about lonely juniors who can't learn by osmosis? Doesn't that outweigh it?",
          "Counterpoint — collaboration dies on video calls. What do you say to that?",
          "Hmm. But managers say culture suffers. Rebut that."
        ],
        hints: ["For example, my team shipped our biggest project fully remote last year."]
      },
      {
        id: "counter", objective: "回应反驳", requires: ["counter"], skillId: "persuade-negotiate",
        bot: [
          "That's... actually a decent rebuttal. Shall we call it a draw over coffee?",
          "Alright, you've made your points well. Truce?",
          "Well argued! I'll concede that round."
        ],
        hints: ["That said, I see your point — maybe a hybrid solves both.", "However, loneliness can be fixed with better onboarding."]
      },
      {
        id: "close", objective: "收尾共识", optional: true, skillId: "socialize-network",
        bot: [
          "Good spar! Same topic next week, opposite sides?",
          "Enjoyed that. You'd survive a real debate club.",
          "Nicely done — let's argue again soon."
        ],
        hints: ["Ha! Deal. Same time next week."]
      }
    ],
    incidents: [
      {
        id: "harden", minDifficulty: 2, objective: "应对对方立场变强硬",
        bot: "Actually, I've changed my mind mid-debate — I'm doubling down against you now. Convince me in one sentence.",
        accept: ["one", "sentence", "because", "the reason", "simply", "think about", "just", "look", "ok", "okay", "try"],
        zhs: "对方中途立场变强硬，要求一句话说服",
        hints: ["Fine, one sentence: the data shows productivity flat or up everywhere.", "Simply this — nobody misses two hours of traffic."]
      },
      {
        id: "switch-sides", minDifficulty: 3, objective: "应对被要求换边站",
        bot: "Twist! Argue the opposite side now — you've got thirty seconds to flip your own argument. Ready?",
        accept: ["ready", "ok", "okay", "sure", "yes", "challenge accepted", "let's go", "fine", "alright"],
        zhs: "被要求换边自驳",
        hints: ["Challenge accepted — here goes nothing.", "Alright, flip mode on."]
      },
      {
        id: "personal", minDifficulty: 2, objective: "应对私人化追问",
        bot: "Interesting — is that what you do at work, or are you speaking from personal experience? Just curious how invested you are.",
        accept: ["personally", "experience", "at work", "both", "curious", "fair", "haha", "my", "we", "i", "colleagues", "team"],
        zhs: "被追问个人立场来源",
        hints: ["A bit of both — my team went hybrid last year.", "Personally, yes — two years fully remote."]
      }
    ]
  },

  {
    id: "negotiation",
    title: "薪资谈判",
    icon: "💼",
    level: "B1+",
    goal: "报期望、给依据、谈弹性与福利，达成一致",
    partner: { name: "Dana", role: "HR Manager", lang: "en-US", pitch: 1.0, rate: 0.97 },
    slots: {
      ask: ["sixty", "sixty-five", "seventy", "seventy-five", "thousand", "percent", "raise", "increase", "five percent", "ten percent"],
      justify: ["market", "experience", "results", "contribution", "competing offer", "competing", "scope", "responsibility"],
      flexible: ["flexible", "negotiable", "open", "range", "depending"],
      benefit: ["remote", "vacation", "stock", "bonus", "title", "relocation", "training", "learning budget"],
      accept: ["accept", "deal", "agreed", "sounds good", "yes", "shake on it", "sign"]
    },
    beats: [
      {
        id: "open", objective: "开启谈判", optional: true, skillId: "persuade-negotiate",
        bot: [
          "Thanks for making time. So — the offer stage. What are your expectations?",
          "Let's talk numbers. Where do you see your compensation?",
          "We're excited about you. What did you have in mind salary-wise?"
        ],
        hints: ["Thanks, Dana. Based on my experience, I'm targeting sixty-five."]
      },
      {
        id: "ask", objective: "报出期望", requires: ["ask"], skillId: "persuade-negotiate", allowIncident: true,
        bot: [
          "That's above our band. Help me understand — what's behind that number?",
          "Okay, noted. What justifies that figure for you?",
          "Mm, that's a stretch for this level. Walk me through your reasoning."
        ],
        hints: ["I'm asking for seventy thousand.", "A ten percent raise from my current base."]
      },
      {
        id: "justify", objective: "给出依据", requires: ["justify"], skillId: "persuade-negotiate",
        bot: [
          "Fair points. Is there wiggle room, or is that a hard number?",
          "Understood. How firm are you on that figure?",
          "Okay. Is that your floor, or shall we explore?"
        ],
        hints: ["My last two projects delivered about thirty percent growth.", "Market rates for this role are in that band."]
      },
      {
        id: "flexible", objective: "表明弹性", requires: ["flexible"], skillId: "persuade-negotiate",
        bot: [
          "Good to hear. If I can't move much on base — would stock options or extra vacation interest you?",
          "Let's get creative. What non-salary pieces matter to you?",
          "Suppose base stays — what else would make this a yes?"
        ],
        hints: ["I'm flexible if the total package works.", "There's some room — depends on the whole picture."]
      },
      {
        id: "benefit", objective: "谈非薪资福利", requires: ["benefit"], skillId: "persuade-negotiate",
        bot: [
          "Here's my best: sixty-two base, plus stock and one extra week of vacation. Do we have a deal?",
          "Final offer: sixty-two, full remote, and the title you wanted. Yes?",
          "Let's close this: sixty-two base plus bonus. Shall we shake on it?"
        ],
        hints: ["Remote work and a learning budget matter a lot to me.", "Extra vacation and stock would help."]
      },
      {
        id: "close", objective: "达成一致", optional: true, skillId: "persuade-negotiate",
        bot: [
          "Wonderful — welcome aboard! The written offer lands in your inbox today.",
          "Pleasure doing business. HR will send the paperwork tonight.",
          "Delighted we made it work. Onboarding details coming by email!"
        ],
        hints: ["Deal. Thank you, Dana!", "I accept — send it over."]
      }
    ],
    incidents: [
      {
        id: "frozen", minDifficulty: 2, objective: "应对预算冻结",
        bot: "Candor time: the salary budget is frozen until April. I could revisit then with a review, or add a one-time signing bonus now. Which appeals?",
        accept: ["bonus", "signing", "april", "review", "revisit", "ok", "okay", "sure", "yes", "one-time", "now", "later", "fine", "deal"],
        zhs: "薪资预算冻结，签约奖或四月复审",
        hints: ["What size signing bonus are we talking?", "I could wait for the April review."]
      },
      {
        id: "counter-lower", minDifficulty: 3, objective: "应对还价更低",
        bot: "Best I can do today is fifty-eight. We're two apart — meet me at sixty and I'll fight for the extra week of vacation?",
        accept: ["sixty", "deal", "meet", "ok", "okay", "yes", "agreed", "fight", "extra week", "fine", "accept", "sure"],
        zhs: "HR 还价 58，提出 60 + 假期交换",
        hints: ["Sixty with the extra week — deal.", "Make it sixty-one and we shake hands now."]
      },
      {
        id: "proof", minDifficulty: 2, objective: "应对索要竞对 offer 证明",
        bot: "About that competing offer — would you be able to share the letter? Policy, nothing personal.",
        accept: ["share", "letter", "happy to", "sure", "ok", "okay", "cant share", "can't share", "confidential", "prefer not", "take my word", "no", "rather not"],
        zhs: "被要求出示竞对 offer 证明",
        hints: ["I'd rather not share it, but I'm happy to describe the terms.", "Sure, I can forward the letter."]
      }
    ]
  }
];
