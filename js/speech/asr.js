// ASR：Web Speech Recognition 的 Promise 封装。
// 单轮模式：startListening() → 说出一句 → resolve(transcript)。
// 不支持的浏览器抛出明确错误，UI 给出引导（Chrome/Edge 最佳）。

export function isAsrSupported() {
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function startListening({ lang = "en-US", timeoutMs = 12000 } = {}) {
  return new Promise((resolve, reject) => {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) {
      reject(new Error("当前浏览器不支持语音识别，请使用 Chrome 或 Edge。"));
      return;
    }
    const rec = new Rec();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 3;

    let settled = false;
    let best = "";
    let bestScore = -1;

    const timer = setTimeout(() => {
      if (!settled) {
        try { rec.stop(); } catch (e) {}
        settled = true;
        reject(new Error("listening-timeout"));
      }
    }, timeoutMs);

    rec.onresult = (event) => {
      const result = event.results[0];
      for (let i = 0; i < result.length; i++) {
        const t = result[i].transcript;
        const words = t.trim().split(/\s+/).filter(Boolean).length;
        const score = words; // 简单启发：词多的候选通常更完整
        if (score > bestScore) { bestScore = score; best = t; }
      }
    };
    rec.onerror = (event) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error(event.error || "asr-error"));
    };
    rec.onend = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (best) resolve(best.trim());
      else reject(new Error("no-speech"));
    };
    try {
      rec.start();
    } catch (e) {
      clearTimeout(timer);
      reject(e);
    }
  });
}
