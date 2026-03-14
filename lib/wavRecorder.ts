/**
 * WAV Recorder — captures audio from a MediaStream as a WAV file.
 *
 * The browser's MediaRecorder only outputs WebM/Opus, but Azure Speech SDK
 * needs WAV (PCM). This utility uses AudioContext + ScriptProcessorNode
 * to capture raw PCM samples and encode them as a proper WAV file.
 *
 * Usage:
 *   const recorder = new WavRecorder();
 *   await recorder.start(mediaStream);
 *   // ... user speaks ...
 *   const blob = recorder.stop();  // Blob of type audio/wav
 */

const SAMPLE_RATE = 16000; // 16 kHz — Azure's preferred rate
const NUM_CHANNELS = 1;    // mono
const BITS_PER_SAMPLE = 16;

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const dataLength = samples.length * (BITS_PER_SAMPLE / 8);
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  // ── RIFF header ──────────────────────────────────────────────────────
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, "WAVE");

  // ── fmt chunk ────────────────────────────────────────────────────────
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);                               // chunk size
  view.setUint16(20, 1, true);                                // PCM format
  view.setUint16(22, NUM_CHANNELS, true);                     // channels
  view.setUint32(24, sampleRate, true);                        // sample rate
  view.setUint32(28, sampleRate * NUM_CHANNELS * (BITS_PER_SAMPLE / 8), true); // byte rate
  view.setUint16(32, NUM_CHANNELS * (BITS_PER_SAMPLE / 8), true);  // block align
  view.setUint16(34, BITS_PER_SAMPLE, true);                   // bits per sample

  // ── data chunk ───────────────────────────────────────────────────────
  writeString(view, 36, "data");
  view.setUint32(40, dataLength, true);

  // Convert float32 [-1, 1] → int16 [-32768, 32767]
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export class WavRecorder {
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private chunks: Float32Array[] = [];

  /**
   * Start recording from the given MediaStream.
   * The stream must have at least one audio track.
   */
  async start(stream: MediaStream): Promise<void> {
    this.chunks = [];

    // Create an AudioContext at our target sample rate
    this.audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
    this.source = this.audioContext.createMediaStreamSource(stream);

    // ScriptProcessorNode captures raw PCM frames
    // (deprecated but universally supported; AudioWorklet is more complex)
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (event) => {
      const inputData = event.inputBuffer.getChannelData(0);
      // Clone the buffer — it gets reused by the engine
      this.chunks.push(new Float32Array(inputData));
    };

    this.source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  /**
   * Stop recording and return the audio as a WAV Blob.
   */
  stop(): Blob {
    // Disconnect nodes
    if (this.processor) this.processor.disconnect();
    if (this.source) this.source.disconnect();
    if (this.audioContext) this.audioContext.close();

    // Concatenate all chunks into one buffer
    const totalLength = this.chunks.reduce((sum, c) => sum + c.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of this.chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    this.chunks = [];
    return encodeWav(merged, SAMPLE_RATE);
  }
}
