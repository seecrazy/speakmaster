// LLM 适配器：OpenAI 兼容接口（BYO endpoint/key/model）。
// 设计原则：LLM 只是"配音演员"——把导演决定好的 bot 台词改写得更自然/更贴合人设，
// 状态机（节拍/槽位/难度）始终由本地规则引擎驱动，保证可测试、可离线、可回退。

export function createProvider(config) {
  if (!config || !config.baseUrl || !config.apiKey || !config.model) return null;
  return {
    model: config.model,
    async rewriteLine(instruction) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      try {
        const resp = await fetch(config.baseUrl.replace(/\/+$/, "") + "/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + config.apiKey
          },
          body: JSON.stringify({
            model: config.model,
            temperature: 0.8,
            max_tokens: 120,
            messages: [
              {
                role: "system",
                content: "You are a dialogue voice actor for an English speaking-practice app. Rewrite the given line to sound natural and in-character. Keep the SAME meaning, information, and question intent. Reply with the rewritten line only, no quotes."
              },
              { role: "user", content: instruction }
            ]
          }),
          signal: controller.signal
        });
        if (!resp.ok) throw new Error("llm-http-" + resp.status);
        const data = await resp.json();
        const text = data.choices && data.choices[0] && data.choices[0].message
          ? String(data.choices[0].message.content || "").trim() : "";
        // 防御：改写失败或过长都视为失败，回退规则台词
        if (!text || text.length > 400) throw new Error("llm-bad-output");
        return text;
      } finally {
        clearTimeout(timer);
      }
    }
  };
}

// 组装改写指令（导演 → 配音演员的话术单）
export function rewriteInstruction(scenario, partner, line, context) {
  const persona = `You are ${partner.name}, a ${partner.role} in the scenario "${scenario.title}". The learner is a Chinese English learner at ${scenario.level} level.`;
  const extras = [];
  if (context.scaffolding) extras.push("The learner is struggling: keep it short and simple.");
  else if (context.difficulty >= 3) extras.push("The learner is doing great: speak naturally, a bit faster-paced phrasing.");
  if (context.incident) extras.push("This line introduces an unexpected small problem.");
  return `${persona} ${extras.join(" ")}\nRewrite this line: "${line}"`;
}
