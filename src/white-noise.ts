import { createFilter } from "./utils/filter";

// Adapted from: https://noisehack.com/generate-noise-web-audio-api/

export class WhiteNoise {

  bufferSource: AudioBufferSourceNode;
  gain: GainNode;
  output: AudioNode;
  destination: AudioNode|null = null;
  filter: BiquadFilterNode|null = null;
  lastTime = 0;

  static bufferSize: number = 0;
  static noiseBuffer: AudioBuffer|null = null;

  constructor(public audioContext: AudioContext) {
    this.createNoiseBuffer(audioContext);
    this.bufferSource = audioContext.createBufferSource();
    this.bufferSource.buffer = WhiteNoise.noiseBuffer;
    this.bufferSource.loop = true;
    this.bufferSource.start();
    this.gain = audioContext.createGain();
    this.bufferSource.connect(this.gain);
    this.output = this.gain;
  }

  toDestination(destination: AudioNode|null = null) {
    this.destination = destination || this.audioContext.destination;
    this.output.connect(this.destination);
    return this;
  }

  withFilter(type: BiquadFilterType, frequency: number, Q?: number) {
    this.filter = createFilter(this.audioContext, type, frequency, Q);
    this.bufferSource.connect(this.filter);
    this.filter.connect(this.output);
    this.gain.connect(this.filter);
    this.output = this.filter;
    return this;
  }

  rampFilterFreqAtTime(frequency: number, time = 0) {
    this.lastTime = Math.max(time, this.lastTime);
    const absTime = this.audioContext.currentTime + time;
    this.filter?.frequency.linearRampToValueAtTime(frequency, time);
    return this;
  }

  expRampFilterFreqAtTime(frequency: number, time = 0) {
    this.lastTime = Math.max(time, this.lastTime);
    const absTime = this.audioContext.currentTime + time;
    this.filter?.frequency.exponentialRampToValueAtTime(frequency, time);
    return this;
  }

  private createNoiseBuffer(audioContext: AudioContext) {
    if (WhiteNoise.noiseBuffer || WhiteNoise.bufferSize > 0) {
      return;
    }
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output: Float32Array = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    WhiteNoise.bufferSize = bufferSize;
    WhiteNoise.noiseBuffer = noiseBuffer;
  }
}
