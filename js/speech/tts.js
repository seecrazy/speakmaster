// TTS：多声音、变速。语音优先的界面基调下，这是"陪练的声音"。

let cachedVoices = [];

export function getVoices() {
  if (!("speechSynthesis" in window)) return [];
  const v = window.speechSynthesis.getVoices();
  if (v.length) cachedVoices = v;
  return cachedVoices;
}

export function onVoicesReady(cb) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.onvoiceschanged = () => { getVoices(); cb(getVoices()); };
}

export function englishVoices() {
  return getVoices().filter(v => /^en/i.test(v.lang));
}

export function speak(text, opts = {}) {
  if (!("speechSynthesis" in window)) return Promise.resolve();
  return new Promise(resolve => {
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    // 安全兜底：个别环境 TTS 不触发 onend，按文本时长估算上限，避免回合卡死
    const safetyMs = Math.max(4000, String(text).length * 90 + 3000);
    const timer = setTimeout(finish, safetyMs);
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const u = new SpeechSynthesisUtterance(text);
      const voices = getVoices();
      if (opts.voiceURI) {
        const picked = voices.find(v => v.voiceURI === opts.voiceURI || v.name === opts.voiceURI);
        if (picked) { u.voice = picked; u.lang = picked.lang; }
      } else {
        const en = voices.find(v => /^en/i.test(v.lang));
        if (en) { u.voice = en; u.lang = en.lang; }
      }
      u.pitch = Math.max(0.1, Math.min(2, opts.pitch ?? 1));
      u.rate = Math.max(0.1, Math.min(2, opts.rate ?? 1));
      u.onend = () => { clearTimeout(timer); finish(); };
      u.onerror = () => { clearTimeout(timer); finish(); };
      window.speechSynthesis.speak(u);
    }, 60);
  });
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
