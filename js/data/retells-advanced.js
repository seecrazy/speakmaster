// 复述语料·进阶：18 段（A2×6 / B1×8 / B1+×4）。结构约定见 retells-basic.js。

export const RETELLS_ADVANCED = [
  {
    id: "garden",
    title: "屋顶菜园",
    level: "A2",
    en: "Mr. Lee turned his apartment roof into a small vegetable garden last spring. He grows tomatoes, peppers, and mint in old buckets. His neighbors thought it was strange at first, but now they trade vegetables with him every weekend.",
    zh: "李先生去年春天把楼顶改成小菜园，用旧桶种番茄、辣椒和薄荷；邻居从觉得奇怪到每周末跟他换菜。",
    keyPoints: [
      { point: "把屋顶改成菜园", groups: [["roof", "rooftop"], ["garden", "vegetable"]] },
      { point: "用旧桶种番茄辣椒薄荷", groups: [["buckets", "pots", "containers"], ["tomatoes", "peppers", "mint", "vegetables"]] },
      { point: "邻居起初觉得奇怪", groups: [["neighbors"], ["strange", "weird", "odd"]] },
      { point: "现在每周末换菜", groups: [["weekend", "weekly"], ["trade", "exchange", "swap"]] }
    ]
  },
  {
    id: "first-snow",
    title: "城市的第一场雪",
    level: "A2",
    en: "The first snow came on a Tuesday night, and by morning the whole city was white and quiet. Schools closed, buses stopped, and everyone walked slowly in the middle of empty streets, taking photos.",
    zh: "初雪在周二夜里落下，清晨全城雪白安静；学校停课、公交停运，人们在空街上慢慢走、拍照。",
    keyPoints: [
      { point: "周二夜里下第一场雪", groups: [["tuesday"], ["night"], ["snow"]] },
      { point: "早晨全城雪白安静", groups: [["morning"], ["white"], ["quiet", "silent"]] },
      { point: "学校停课、公交停运", groups: [["schools", "school"], ["closed", "stopped"], ["buses", "bus"]] },
      { point: "人们在空街拍照", groups: [["photos", "pictures"], ["streets", "street"], ["empty"]] }
    ]
  },
  {
    id: "coffee-habit",
    title: "戒不掉的咖啡",
    level: "A2",
    en: "Amy tried to give up coffee for one month. The first week was fine, but by the second week she had headaches every afternoon. On day twenty, she made a cup at three in the morning to finish a report, and decided some habits are worth keeping.",
    zh: "Amy 想戒咖啡一个月：第一周还行，第二周每天下午头疼；第 20 天为赶报告凌晨三点泡了一杯，决定有些习惯值得保留。",
    keyPoints: [
      { point: "尝试戒咖啡一个月", groups: [["coffee"], ["give up", "quit", "stop"], ["month"]] },
      { point: "第二周开始下午头疼", groups: [["headache", "headaches", "pain"], ["afternoon"], ["week"]] },
      { point: "第二十天凌晨三点泡咖啡赶报告", groups: [["twenty", "20"], ["three", "3"], ["report"]] },
      { point: "结论：有些习惯值得保留", groups: [["habit", "habits"], ["keep", "worth"]] }
    ]
  },
  {
    id: "lost-keys",
    title: "钥匙去哪了",
    level: "A2",
    en: "Leo lost his keys somewhere between the office and home. He checked his bag twice, walked back along his route, and finally found them in the fridge, next to the milk he had put away an hour earlier.",
    zh: "Leo 把钥匙丢在办公室到家之间；查了两遍包、沿路折返，最后在冰箱里找到——在 一小时前放进去的牛奶旁边。",
    keyPoints: [
      { point: "钥匙丢在办公室和家之间", groups: [["keys"], ["office"], ["home", "route"]] },
      { point: "查了两遍包、沿路折返", groups: [["bag"], ["twice", "two"], ["walked back", "returned", "back"]] },
      { point: "最后在冰箱里找到", groups: [["fridge", "refrigerator"], ["found"]] },
      { point: "在牛奶旁边（一小时前放的）", groups: [["milk"], ["hour"]] }
    ]
  },
  {
    id: "market-day",
    title: "周末市集",
    level: "A2",
    en: "Every Saturday there's a small market on our street. An old couple sells homemade bread, and a student sells plants she grew on her balcony. Everything costs a little more than the supermarket, but everyone comes for the chat.",
    zh: "每周六街上有小市集：老夫妇卖自制面包、学生卖阳台种的植物；比超市贵一点，但大家为聊天而来。",
    keyPoints: [
      { point: "每周六街上有市集", groups: [["saturday"], ["market"], ["street"]] },
      { point: "老夫妇卖自制面包", groups: [["couple", "old"], ["bread"], ["homemade"]] },
      { point: "学生卖阳台种的植物", groups: [["student"], ["plants"], ["balcony"]] },
      { point: "比超市贵但为聊天而来", groups: [["supermarket"], ["chat", "talk", "conversation"]] }
    ]
  },
  {
    id: "cat-sitter",
    title: "帮忙喂猫",
    level: "A2",
    en: "My neighbor asked me to feed her cat while she was away for a week. The cat hid for the first two days, then started sleeping on my keyboard while I worked. By Friday, I was honestly a little sad to give the keys back.",
    zh: "邻居出游一周让我喂猫：猫头两天躲着，后来睡在我键盘上；到周五我竟然有点舍不得还钥匙。",
    keyPoints: [
      { point: "邻居请我喂猫一周", groups: [["neighbor"], ["cat"], ["week", "feed"]] },
      { point: "猫头两天躲起来", groups: [["hid", "hide", "hiding"], ["two", "2"], ["days"]] },
      { point: "后来睡在键盘上", groups: [["keyboard"], ["slept", "sleep", "sleeping"]] },
      { point: "周五舍不得还钥匙", groups: [["friday", "keys"], ["sad"]] }
    ]
  },
  {
    id: "bike-share",
    title: "共享单车救急",
    level: "B1",
    en: "My bus broke down on the day of an important meeting. I grabbed a shared bike from the sidewalk, rode six kilometers in twenty minutes, and arrived with two minutes to spare — sweaty, but on time.",
    zh: "重要会议当天公交抛锚，我扫了路边的共享单车，20 分钟骑了 6 公里，提前两分钟到——一身汗但没迟到。",
    keyPoints: [
      { point: "公交车在重要会议当天抛锚", groups: [["bus"], ["broke down", "stopped", "breakdown"], ["meeting"]] },
      { point: "扫了共享单车骑六公里", groups: [["bike", "bicycle"], ["six", "6"], ["kilometers", "km"]] },
      { point: "二十分钟", groups: [["twenty", "20"], ["minutes"]] },
      { point: "提前两分钟到达，一身汗", groups: [["two", "2"], ["sweaty", "sweat"], ["time", "on time", "arrived"]] }
    ]
  },
  {
    id: "remote-day",
    title: "远程办公的一天",
    level: "B1",
    en: "Working from home sounded like freedom until I tried it. My chair hurt my back by ten, the wifi dropped during my standup call, and my cat walked across the keyboard twice. By evening, I missed the noisy office more than I expected.",
    zh: "在家办公听起来自由：十点椅子和腰开始抗议、站会时断网、猫两次踩键盘；到晚上我比想象中更想念吵闹的办公室。",
    keyPoints: [
      { point: "以为在家办公很自由", groups: [["home", "remote"], ["freedom", "free", "flexible"]] },
      { point: "椅子让背疼 + 站会断网", groups: [["chair", "back"], ["wifi", "internet", "connection"], ["call", "standup"]] },
      { point: "猫踩键盘两次", groups: [["cat"], ["keyboard"], ["twice", "two"]] },
      { point: "晚上想念办公室", groups: [["evening", "end of day"], ["missed", "miss", "office"]] }
    ]
  },
  {
    id: "wallet-returned",
    title: "钱包回来了",
    level: "B1",
    en: "I left my wallet in a taxi on Friday night and assumed it was gone forever. On Sunday, a teenager knocked on my door — his mother drives that taxi, and she'd used my gym card to find my address. Nothing was missing, not even the cash.",
    zh: "周五晚把钱包落在出租车上，以为没了；周日一个少年敲门——他妈妈开那辆车，用健身卡找到地址。分文未少。",
    keyPoints: [
      { point: "钱包落在出租车上", groups: [["wallet"], ["taxi", "cab"], ["friday", "night"]] },
      { point: "周日少年敲门归还", groups: [["sunday"], ["knocked", "door", "returned"], ["teenager", "boy", "kid"]] },
      { point: "他妈妈是司机，用健身卡找到地址", groups: [["mother", "mom", "driver"], ["gym", "card"], ["address"]] },
      { point: "分文未少", groups: [["missing", "lost"], ["cash", "money"], ["nothing"]] }
    ]
  },
  {
    id: "cooking-class",
    title: "第一节烹饪课",
    level: "B1",
    en: "I signed up for a beginner cooking class to impress nobody in particular. The chef made everything look easy; my first sauce broke, my pasta was soft, and my knife skills frightened everyone. But by week four, my risotto was genuinely good.",
    zh: "报了个初级烹饪课：大厨示范行云流水，我的酱汁水油分离、意面太软、刀工吓人；但到第四周烩饭真的能吃了。",
    keyPoints: [
      { point: "报了初级烹饪课", groups: [["cooking", "culinary"], ["class", "course"], ["beginner"]] },
      { point: "酱汁失败、意面太软", groups: [["sauce", "broke"], ["pasta", "soft", "overcooked"]] },
      { point: "刀工吓到大家", groups: [["knife"], ["frightened", "scared", "afraid"]] },
      { point: "第四周烩饭真的好吃", groups: [["four", "4", "week"], ["risotto"], ["good", "great"]] }
    ]
  },
  {
    id: "power-outage",
    title: "停电夜",
    level: "B1",
    en: "A storm knocked out power on our block for six hours. We cooked dinner on a camping stove, played cards by candlelight, and actually talked to each other. When the lights came back, everyone went straight back to their screens.",
    zh: "暴风雨让街区停电六小时：用露营炉做饭、烛光下打牌、真正地聊天；灯一亮，大家又各自回到屏幕前。",
    keyPoints: [
      { point: "暴风雨停电六小时", groups: [["storm"], ["power", "electricity", "outage"], ["six", "6"]] },
      { point: "露营炉做饭、烛光打牌", groups: [["stove", "camping"], ["candle"], ["cards"]] },
      { point: "真正地聊天", groups: [["talked", "talk", "chatted"]] },
      { point: "灯亮后回到屏幕前", groups: [["lights", "power", "electricity"], ["screens", "phones"]] }
    ]
  },
  {
    id: "beach-clean",
    title: "海滩清理",
    level: "B1",
    en: "Our company organized a beach cleanup last month. Forty volunteers filled sixty bags in three hours — mostly plastic bottles and cigarette ends. The most surprising find was a working phone, which the owner collected the next day.",
    zh: "公司上月组织净滩：40 名志愿者 3 小时装满 60 袋垃圾，多为塑料瓶和烟头；最意外的是捡到一部能用的手机，次日失主领回。",
    keyPoints: [
      { point: "公司组织净滩", groups: [["company"], ["beach"], ["cleanup", "clean"]] },
      { point: "四十人三小时六十袋", groups: [["forty", "40"], ["three", "3"], ["sixty", "60"]] },
      { point: "多为塑料瓶和烟头", groups: [["plastic", "bottles"], ["cigarette"]] },
      { point: "捡到能用的手机，失主领回", groups: [["phone"], ["owner", "collected", "returned"], ["next day"]] }
    ]
  },
  {
    id: "language-partner",
    title: "语言交换搭档",
    level: "B1",
    en: "I meet my language partner every Thursday in a bookshop café. For the first half hour we only speak Chinese, then we switch to English. We've been doing it for a year now — her English improved more than my Chinese, but neither of us minds.",
    zh: "每周四和语伴在书店咖啡角见面：前半小时只说中文，再换英文；坚持一年，她英文进步比我中文大，但谁都不介意。",
    keyPoints: [
      { point: "每周四在书店咖啡角见面", groups: [["thursday"], ["bookshop", "bookstore", "cafe"], ["meet"]] },
      { point: "前半小时中文后换英文", groups: [["half hour", "30", "thirty"], ["chinese"], ["english"], ["switch"]] },
      { point: "坚持了一年", groups: [["year"], ["been doing", "kept"]] },
      { point: "她英文比我中文进步大", groups: [["her english", "her"], ["more than", "better", "improved"]] }
    ]
  },
  {
    id: "smart-fridge",
    title: "智能冰箱的提醒",
    level: "B1",
    en: "Our new fridge sends a message when the milk is about to expire. At first we ignored it, but it also started suggesting recipes based on what was inside. Food waste in our house dropped noticeably, mostly because the reminders are slightly annoying.",
    zh: "新冰箱会在牛奶临期时发消息；起初无视，后来它按库存推荐菜谱。家里的食物浪费明显下降——主要因为提醒有点烦人。",
    keyPoints: [
      { point: "冰箱在牛奶临期时发消息", groups: [["fridge", "refrigerator"], ["milk"], ["expire", "message", "reminder"]] },
      { point: "按库存推荐菜谱", groups: [["recipes"], ["inside", "inventory", "stock"], ["suggest"]] },
      { point: "食物浪费下降", groups: [["food waste", "waste"], ["dropped", "down", "reduced", "less"]] },
      { point: "因为提醒有点烦人", groups: [["annoying", "nagging", "nudge"], ["because", "mostly"]] }
    ]
  },
  {
    id: "micro-investing",
    title: "五美元理财",
    level: "B1+",
    en: "My younger brother invests five dollars a week through an app that rounds up his purchases. He's been at it for two years and has saved around six hundred dollars — not a fortune, but he's learned more about markets than from any textbook.",
    zh: "弟弟用零钱理财 App 每周投 5 美元（消费取整），两年攒了约 600 美元——不算巨款，但他对市场的理解胜过任何教科书。",
    keyPoints: [
      { point: "每周投五美元（消费取整 App）", groups: [["five", "5"], ["week", "weekly"], ["app", "rounds up"]] },
      { point: "坚持两年攒了约六百", groups: [["two", "2", "years"], ["six hundred", "600"]] },
      { point: "不算巨款", groups: [["fortune", "rich", "lot"]] },
      { point: "对市场的理解胜过教科书", groups: [["market", "markets"], ["textbook", "book"], ["more", "learned"]] }
    ]
  },
  {
    id: "four-day-week",
    title: "四天工作制试验",
    level: "B1+",
    en: "A design studio in our building trialed a four-day week for a quarter. Meetings were cut in half, deadlines stayed the same, and clients noticed nothing. Two people quit anyway — one said Fridays at home made her feel lonelier, not freer.",
    zh: "楼里的设计工作室试点一季四天工作制：会议减半、deadline 不变、客户毫无察觉；但仍有两人离职——一位说周五在家更孤独而非更自由。",
    keyPoints: [
      { point: "设计工作室试点一季四天工作制", groups: [["design studio", "studio"], ["four-day", "four day", "4"], ["quarter", "trial"]] },
      { point: "会议减半、截止期不变", groups: [["meetings"], ["half", "fewer"], ["deadlines", "same"]] },
      { point: "客户没察觉", groups: [["clients"], ["noticed nothing", "no difference", "nothing"]] },
      { point: "两人离职：一位觉得更孤独", groups: [["two", "2"], ["quit", "left"], ["lonelier", "lonely"]] }
    ]
  },
  {
    id: "nomad-visa",
    title: "数字游民签证",
    level: "B1+",
    en: "Portugal's digital nomad visa needs proof of remote income and a clean record. A friend of mine applied, waited four months, and moved to Lisbon last autumn. Her rent doubled, but her morning commute is now a walk along the river.",
    zh: "葡萄牙数字游民签证要远程收入证明和无犯罪记录；朋友申请等了四个月，去年秋天搬去里斯本——房租翻倍，但通勤变成沿河散步。",
    keyPoints: [
      { point: "签证需要远程收入证明", groups: [["visa"], ["remote income", "income", "proof"], ["digital nomad"]] },
      { point: "等了四个月", groups: [["four", "4"], ["months"], ["waited"]] },
      { point: "去年秋天搬到里斯本", groups: [["autumn", "fall", "last year"], ["lisbon", "moved"]] },
      { point: "房租翻倍、通勤变成沿河散步", groups: [["rent"], ["doubled", "double", "twice"], ["river", "walk"]] }
    ]
  },
  {
    id: "car-free",
    title: "无车街区实验",
    level: "B1+",
    en: "Our city closed six streets to cars for the summer. Shop owners protested at first, fearing lost customers; by August, sales on those streets were up twelve percent, driven by foot traffic and outdoor tables. The experiment is now permanent.",
    zh: "市里夏季封闭六条街道禁车；商户起初怕丢客抗议，到八月这些街区销售额涨 12%，靠的是步行人流和户外桌椅；实验现已永久化。",
    keyPoints: [
      { point: "夏季封闭六条街道禁车", groups: [["six", "6"], ["streets"], ["cars", "traffic"], ["summer"]] },
      { point: "商户起初抗议怕丢客", groups: [["shop owners", "shops", "merchants"], ["protested", "against"], ["customers"]] },
      { point: "八月销售额涨 12%", groups: [["august"], ["twelve", "12"], ["sales", "up"]] },
      { point: "靠步行人流和户外桌椅，现已永久化", groups: [["foot", "walking"], ["outdoor", "tables"], ["permanent"]] }
    ]
  }
];
