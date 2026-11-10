// 设置页：TTS 声音/语速、LLM 接入（可选）、数据导出/导入、重置。
import { getVoices, onVoicesReady, englishVoices } from "../speech/tts.js";
import { speak } from "../speech/tts.js";
import * as store from "../store.js";

const $ = (sel) => document.querySelector(sel);

export function initSettings() {
  renderVoiceOptions();
  onVoicesReady(renderVoiceOptions);

  const s = store.get().settings;
  $("#tts-voice").addEventListener("change", (e) => {
    s.ttsVoice = e.target.value;
    store.save();
  });
  $("#tts-rate").addEventListener("input", (e) => {
    s.ttsRate = Number(e.target.value);
    $("#tts-rate-value").textContent = s.ttsRate.toFixed(2) + "x";
    store.save();
  });
  $("#tts-test").onclick = () => {
    speak("Hi! This is your practice partner. Let's speak some English today!", {
      voiceURI: s.ttsVoice || undefined, rate: s.ttsRate || 1
    });
  };

  $("#llm-base").value = s.llm.baseUrl;
  $("#llm-key").value = s.llm.apiKey;
  $("#llm-model").value = s.llm.model;
  $("#llm-save").onclick = () => {
    s.llm.baseUrl = $("#llm-base").value.trim();
    s.llm.apiKey = $("#llm-key").value.trim();
    s.llm.model = $("#llm-model").value.trim();
    store.save();
    $("#llm-status").textContent = s.llm.baseUrl && s.llm.apiKey && s.llm.model
      ? "✅ 已保存：对话台词将用 LLM 改写（仅改台词，状态机仍本地驱动）"
      : "已保存：未填完整将使用内置规则台词（完全离线可用）";
  };

  $("#data-export").onclick = () => {
    const blob = new Blob([store.exportData()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `speakmaster-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  $("#data-import").onclick = () => {
    try {
      store.importData($("#data-json").value);
      alert("导入成功");
      location.reload();
    } catch (e) {
      alert("导入失败：" + e.message);
    }
  };
  $("#data-reset").onclick = () => {
    if (confirm("确定清空全部学习记录？")) {
      store.reset();
      location.reload();
    }
  };
}

function renderVoiceOptions() {
  const select = $("#tts-voice");
  if (!select) return;
  const s = store.get().settings;
  const voices = [...englishVoices(), ...getVoices().filter(v => !/^en/i.test(v.lang))];
  select.innerHTML = `<option value="">系统默认（英文）</option>` + voices.map(v =>
    `<option value="${v.voiceURI || v.name}"${s.ttsVoice === (v.voiceURI || v.name) ? " selected" : ""}>${v.name}（${v.lang}）</option>`
  ).join("");
  $("#tts-rate").value = s.ttsRate || 1;
  $("#tts-rate-value").textContent = (s.ttsRate || 1).toFixed(2) + "x";
}
