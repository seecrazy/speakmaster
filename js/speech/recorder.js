// 录音封装：MediaRecorder 录制 → 解码 PCM → 交给 engine/audio 分析。
// 浏览器兼容：Chrome/Edge/Safari 均支持；不支持时给出明确错误供 UI 降级。

export function isRecordingSupported() {
  return typeof window !== "undefined" &&
    Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
}

let activeStream = null;
let activeRecorder = null;
let activeResolve = null;

export function startRecording({ maxMs = 8000 } = {}) {
  if (!isRecordingSupported()) {
    return Promise.reject(new Error("此浏览器不支持录音，请用 Chrome / Edge / Safari。"));
  }
  if (activeRecorder) {
    return Promise.reject(new Error("已在录音中"));
  }
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        activeStream = stream;
        const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
        const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
          cleanup();
          resolve(blob);
        };
        recorder.onerror = () => {
          cleanup();
          reject(new Error("recorder-error"));
        };
        recorder.start();
        activeRecorder = recorder;
        // 超时自动停，防忘关
        const timer = setTimeout(() => { if (activeRecorder === recorder) stopRecording(); }, maxMs);
        activeResolve = { timer };
      })
      .catch(err => reject(new Error(err.name === "NotAllowedError" ? "mic-denied" : "mic-failed")));
  });
}

export function stopRecording() {
  if (activeRecorder && activeRecorder.state !== "inactive") {
    activeRecorder.stop();
  }
}

export function isRecording() {
  return Boolean(activeRecorder);
}

function cleanup() {
  if (activeResolve) { clearTimeout(activeResolve.timer); activeResolve = null; }
  activeRecorder = null;
  if (activeStream) {
    activeStream.getTracks().forEach(t => t.stop());
    activeStream = null;
  }
}

// 解码为单声道 Float32 采样 + 时长
export async function decodeRecording(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  try {
    const buffer = await ctx.decodeAudioData(arrayBuffer);
    const ch = buffer.getChannelData(0);
    return { samples: new Float32Array(ch), sampleRate: buffer.sampleRate, durationSec: buffer.duration };
  } finally {
    ctx.close().catch(() => {});
  }
}

let lastAudio = null;
export function playBlob(blob) {
  if (!blob) return;
  if (lastAudio) { lastAudio.pause(); lastAudio = null; }
  lastAudio = new Audio(URL.createObjectURL(blob));
  return lastAudio.play().catch(() => {});
}
