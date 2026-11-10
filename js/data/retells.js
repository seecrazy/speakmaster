// 复述模式语料：听一段 → 用自己的话复述 → 关键点覆盖评分。
// keyPoints.groups：每组内任一同义词命中即该组覆盖，全部组覆盖才算该要点达成。

export const RETELL_PASSAGES = [
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
  }
];
