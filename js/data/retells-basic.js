// 复述模式语料：听一段 → 用自己的话复述 → 关键点覆盖评分。
// keyPoints.groups：每组内任一同义词命中即该组覆盖，全部组覆盖才算该要点达成。
// 内容门禁：tests/content.test.js 校验结构。

export const RETELLS_BASIC = [
  {
    id: "lighthouse",
    title: "灯塔守护人",
    level: "A2",
    en: "My neighbor Tom used to be a lighthouse keeper on a small island. He lived there alone for six years, and every night he climbed two hundred steps to turn on the light. He says it was lonely, but he never felt bored because he read hundreds of books.",
    zh: "邻居 Tom 曾是灯塔守护人，独自在岛上住了六年，每晚爬两百级台阶开灯；孤独但读了上百本书不觉得无聊。",
    keyPoints: [
      { point: "Tom 是灯塔守护人", groups: [["lighthouse", "light house"], ["keeper", "guardian"]] },
      { point: "住在小岛上", groups: [["island"], ["small", "little"]] },
      { point: "独自住了六年", groups: [["alone", "by himself"], ["six", "6"]] },
      { point: "每晚爬两百级台阶", groups: [["every night", "nightly", "each night"], ["steps", "stairs"], ["two hundred", "200"]] },
      { point: "孤独但不无聊，读了很多书", groups: [["lonely"], ["books"]] }
    ]
  },
  {
    id: "flight",
    title: "改签航班",
    level: "B1",
    en: "Sarah missed her connecting flight in Chicago because of a snowstorm. The airline rebooked her on a morning flight the next day and gave her a hotel voucher for the night. She was upset at first, but the hotel had a great gym, so she turned the delay into a workout evening.",
    zh: "Sarah 因暴风雪错过了芝加哥的转机航班；航空公司改签到次日早班并给了酒店券。她起初沮丧，但酒店健身房很棒，把延误变成了锻炼之夜。",
    keyPoints: [
      { point: "Sarah 错过转机航班", groups: [["missed", "caught", "lost"], ["flight"], ["chicago"]] },
      { point: "原因是暴风雪", groups: [["snowstorm", "snow", "storm"]] },
      { point: "改签到次日早班", groups: [["rebooked", "changed", "rescheduled", "next day", "morning"]] },
      { point: "给了酒店券", groups: [["hotel"], ["voucher", "coupon", "free"]] },
      { point: "酒店有好健身房，把延误变成锻炼", groups: [["gym"], ["workout", "exercise"]] }
    ]
  },
  {
    id: "startup",
    title: "两人创业",
    level: "B1",
    en: "Last year, two of my colleagues quit their jobs and started a small coffee roasting company. They began by selling beans at a weekend market, and within eight months they were supplying three local cafes. Their secret, they say, is replying to every customer message within an hour.",
    zh: "去年两位同事辞职创业做咖啡烘焙公司，从周末市集卖豆子开始，八个月内供货给三家本地咖啡馆；秘诀是一小时内回复每条客户消息。",
    keyPoints: [
      { point: "两个同事辞职创业", groups: [["two", "2"], ["colleagues", "coworkers", "friends"], ["quit", "left"], ["job"]] },
      { point: "咖啡烘焙公司", groups: [["coffee"], ["roasting", "roast", "company", "business"]] },
      { point: "从周末市集开始", groups: [["weekend"], ["market"]] },
      { point: "八个月内供货三家咖啡馆", groups: [["eight", "8"], ["month"], ["cafe", "cafes", "café"]] },
      { point: "秘诀：一小时内回复客户", groups: [["secret"], ["hour"], ["customer", "clients"]] }
    ]
  },
  {
    id: "moving",
    title: "搬家",
    level: "A2",
    en: "Last month, Mia moved to a new apartment near the park. It's smaller than her old one, but the rent is two hundred dollars cheaper, and she can walk to work in fifteen minutes. The only problem is the street noise at night.",
    zh: "上个月 Mia 搬到公园附近的新公寓：更小但便宜 200 美元，步行 15 分钟上班；唯一问题是夜间街噪。",
    keyPoints: [
      { point: "Mia 搬到公园附近", groups: [["moved", "moved house", "relocated"], ["park"]] },
      { point: "新家更小但房租便宜两百刀", groups: [["smaller", "small"], ["cheaper", "less", "rent"]] },
      { point: "步行十五分钟上班", groups: [["walk", "walking"], ["fifteen", "15"], ["work"]] },
      { point: "问题：夜间街噪", groups: [["noise", "noisy"], ["night"]] }
    ]
  },
  {
    id: "recipe",
    title: "祖母的汤",
    level: "A2",
    en: "My grandmother's soup recipe is simple: you need tomatoes, two potatoes, and a little butter. First, cook the tomatoes for ten minutes, then add the potatoes. She says the secret is never using any water.",
    zh: "祖母的汤谱很简单：西红柿、两个土豆、一点黄油；先煮番茄十分钟再加土豆；秘诀是绝不加水。",
    keyPoints: [
      { point: "食材：番茄、土豆、黄油", groups: [["tomatoes", "tomato"], ["potatoes", "potato"], ["butter"]] },
      { point: "先煮番茄十分钟", groups: [["ten", "10"], ["first", "cook", "then"], ["tomatoes", "tomato"]] },
      { point: "然后加土豆", groups: [["then", "after", "add"], ["potatoes", "potato"]] },
      { point: "秘诀：不加水", groups: [["secret"], ["no water", "without water", "never", "water"]] }
    ]
  },
  {
    id: "train-delay",
    title: "面试迟到危机",
    level: "B1",
    en: "David was taking the 8 a.m. train to a job interview when it stopped for forty minutes in a tunnel. He called the company, explained the delay, and they moved his interview to the afternoon. He got the job a week later.",
    zh: "David 乘早 8 点火车去面试，列车在隧道里停了 40 分钟；他致电公司说明后改约下午，一周后拿到了 offer。",
    keyPoints: [
      { point: "坐火车去面试途中停下", groups: [["train"], ["stopped", "stuck", "delayed", "waited"], ["interview"]] },
      { point: "在隧道里停了四十分钟", groups: [["tunnel"], ["forty", "40"], ["minutes"]] },
      { point: "打电话解释后改约下午", groups: [["called", "phone", "phoned"], ["afternoon", "rescheduled", "moved"]] },
      { point: "一周后得到工作", groups: [["week"], ["job", "hired", "got the job", "offer"]] }
    ]
  },
  {
    id: "dog",
    title: "收养的狗",
    level: "A2",
    en: "Sam adopted a three-year-old dog from a shelter last weekend. The dog was shy at first and hid under the table for an hour. Now he follows Sam everywhere, even to the bathroom door.",
    zh: "Sam 上周末从收容所领养了一只三岁的狗；起初害羞躲在桌下一小时，现在寸步不离跟着 Sam。",
    keyPoints: [
      { point: "从收容所领养了狗", groups: [["adopted", "adopt"], ["shelter"], ["dog"]] },
      { point: "狗三岁", groups: [["three", "3"], ["years", "year", "old"]] },
      { point: "起初害羞躲在桌下", groups: [["shy", "scared", "nervous"], ["table"], ["hid", "hide", "hidden"]] },
      { point: "现在寸步不离", groups: [["follows", "follow", "everywhere"]] }
    ]
  },
  {
    id: "library",
    title: "不只借书的图书馆",
    level: "B1",
    en: "Our local library lends more than books now — you can borrow laptops, board games, and even fishing rods for a week. Membership is free; you just need to show an ID and fill in one form.",
    zh: "本地图书馆现在不只借书——笔记本、桌游甚至钓鱼竿都能借一周；会员免费，出示证件填一张表即可。",
    keyPoints: [
      { point: "图书馆不只借书", groups: [["library"], ["more than books", "not just books", "laptops", "board games"]] },
      { point: "可以借一周", groups: [["week"], ["borrow", "loan", "lend"]] },
      { point: "会员免费", groups: [["free"], ["membership", "member"]] },
      { point: "出示证件填一张表", groups: [["id", "identification", "passport"], ["form"]] }
    ]
  },
  {
    id: "marathon",
    title: "从十分钟到半马",
    level: "B1",
    en: "Kevin couldn't run for more than ten minutes a year ago. He trained three times a week, starting with short runs around his block. Last Sunday, he finished his first half marathon in two hours and ten minutes.",
    zh: "一年前 Kevin 跑不过十分钟；每周训练三次从街区慢跑开始，上周日以 2 小时 10 分完成首个半马。",
    keyPoints: [
      { point: "一年前只能跑十分钟", groups: [["ten", "10"], ["minutes"], ["year ago", "only", "couldn't", "could not"]] },
      { point: "每周训练三次", groups: [["three", "3"], ["times", "week"], ["trained", "training", "practice"]] },
      { point: "上周日完成首个半马", groups: [["sunday"], ["half marathon", "race", "first"]] },
      { point: "成绩两小时十分", groups: [["two hours", "2 hours", "hours"], ["ten", "10"]] }
    ]
  },
  {
    id: "bookstore",
    title: "老书店的未来",
    level: "B1",
    en: "The old bookstore on Maple Street is closing after thirty years because the owner wants to retire. Regulars are sharing memories online, and a group of neighbors is trying to raise money to turn it into a community co-op.",
    zh: "枫树街的老书店因店主退休将在经营三十年后关门；老顾客网上晒回忆，一群邻居正筹钱把它改成社区合作社。",
    keyPoints: [
      { point: "老书店要关门", groups: [["bookstore", "book shop", "closing", "close"], ["maple"]] },
      { point: "开了三十年、店主退休", groups: [["thirty", "30", "years"], ["retire"]] },
      { point: "老顾客分享回忆", groups: [["memories", "memories online", "sharing"], ["customers", "regulars", "readers"]] },
      { point: "邻居筹钱改成合作社", groups: [["neighbors", "neighbours", "community"], ["money", "raise", "fund"], ["co-op", "coop", "cooperative"]] }
    ]
  },
  {
    id: "language",
    title: "看动画学英语",
    level: "B1",
    en: "Ana learned English by watching cartoons without subtitles as a teenager. At first she understood almost nothing, but after six months she could follow whole episodes. Now she works as a dubbing actress in Madrid.",
    zh: "Ana 靠少年时期看无字幕动画学英语；起初几乎听不懂，六个月后能整集跟上；如今在马德里做配音演员。",
    keyPoints: [
      { point: "看无字幕动画学英语", groups: [["cartoons", "cartoon", "animation"], ["without subtitles", "no subtitles", "subtitles"], ["english"]] },
      { point: "起初几乎听不懂", groups: [["nothing", "understand", "understood", "couldn't", "could not", "hard"]] },
      { point: "六个月后能整集跟上", groups: [["six", "6"], ["months"], ["episodes", "whole", "follow"]] },
      { point: "现在做配音演员", groups: [["dubbing", "voice", "dub"], ["actress", "actor"]] }
    ]
  },
  {
    id: "thermostat",
    title: "智能温控器",
    level: "B1",
    en: "We installed a smart thermostat last winter. It learns your schedule and lowers the heating when nobody's home. Our energy bill dropped by about twenty percent, and the house is warm exactly when we wake up.",
    zh: "去年冬天装了智能温控器：学习作息、无人时降低供暖；电费降了约 20%，起床时屋里正好是暖的。",
    keyPoints: [
      { point: "装了智能温控器", groups: [["smart", "thermostat"], ["installed", "install", "installed last winter"]] },
      { point: "学习作息、无人时降温", groups: [["schedule", "learns", "learn"], ["nobody", "no one", "empty", "away", "not home"]] },
      { point: "电费降了约两成", groups: [["bill", "energy"], ["twenty", "20", "percent"], ["dropped", "down", "lower", "less"]] },
      { point: "起床时正好是暖的", groups: [["warm", "heat"], ["wake", "morning", "up"]] }
    ]
  }
];
