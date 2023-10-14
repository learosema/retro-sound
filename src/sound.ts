import { createFilter } from "./utils/filter";
import { noteToFrequency } from "./utils/note-utils";
import { OscGainNode, createOscGainNode } from "./utils/osc-gain";

export class Sound {

  carrier: OscGainNode;
  output: AudioNode;
  destination: AudioNode|null = null;
  filter: BiquadFilterNode|null = null;
  time: number = 0;

  modulator: OscGainNode|null = null;

  modulators: Array<OscGainNode> = [];

  constructor(
    public audioContext: AudioContext,
    carrierType: OscillatorType = 'square') {
    this.audioContext = audioContext;
    this.carrier = createOscGainNode(this.audioContext, carrierType);
    this.output = this.carrier.gain;
  }

  withFilter(type: BiquadFilterType, frequency: number, Q?: number) {
    // TODO: maybe put the filter directly after the oscillator :)
    this.filter = createFilter(this.audioContext, type, frequency, Q);
    this.carrier.gain.connect(this.filter);
    this.output = this.filter;
    return this;
  }

  withModulator(
    modulatorType: OscillatorType = 'square',
    frequency: number,
    amount: number,
    assignTo: 'frequency'|'detune'|'gain'|'filter'|'last' = 'frequency'
  ) {
    const modulator = createOscGainNode(this.audioContext, modulatorType);
    modulator.osc.frequency.value = frequency;
    modulator.gain.gain.value = amount;
    let target = null;
    if (! target) {
      switch (assignTo) {
        case 'frequency':
          target = this.carrier.osc.frequency;
          break;
        case 'gain':
          target = this.carrier.gain.gain;
          break;
        case 'filter':
          target = this.filter?.frequency;
          break;
        case 'detune':
          target = this.carrier.osc.detune;
          break;
        case 'last':
          if (this.modulators.length > 0) {
            target = this.modulators.slice(-1).pop()!.osc.frequency;
          }
      }
    }
    if (target) {
      modulator.gain.connect(target);
    }
    this.modulators.push(modulator);
    return this;
  }

  toDestination(destination: AudioNode|null = null) {
    this.destination = destination || this.audioContext.destination;
    this.output.connect(this.destination);
    return this;
  }

  play(note: string, startVolume = 1, startTime = 0) {
    const absStartTime = this.audioContext.currentTime + startTime;
    const frequency = noteToFrequency(note);
    this.carrier.osc.frequency.setValueAtTime(frequency, absStartTime);
    this.carrier.gain.gain.setValueAtTime(startVolume, absStartTime);
    this.time = Math.max(startTime, this.time);
    return this;
  }

  rampToVolumeAtTime(volume: number, time: number) {
    const absTime = this.audioContext.currentTime + time;
    this.carrier.gain.gain.linearRampToValueAtTime(volume, absTime);
    this.time = Math.max(time, this.time);
    return this;
  }

  expRampToVolumeAtTime2(volume: number, time: number) {
    const absTime = this.audioContext.currentTime + time;
    this.carrier.gain.gain.exponentialRampToValueAtTime(volume, absTime);
    this.time = Math.max(time, this.time);
    return this;
  }

  rampToNoteAtTime(note: string, time: number) {
    const absTime = this.audioContext.currentTime + time;
    const frequency = noteToFrequency(note);
    this.carrier.osc.frequency.exponentialRampToValueAtTime(frequency, absTime);
    this.time = Math.max(time, this.time);
    return this;
  }

  setToNoteAtTime(note: string, time: number) {
    const absTime = this.audioContext.currentTime + time;
    const frequency = noteToFrequency(note);
    this.carrier.osc.frequency.setValueAtTime(frequency, absTime);
    this.time = Math.max(time, this.time);
    return this;
  }

  setVolumeAtTime(volume: number, time: number) {
    const absTime = this.audioContext.currentTime + time;
    this.carrier.gain.gain.setValueAtTime(volume, absTime);
    this.time = Math.max(time, this.time);
    return this;
  }

  rampFilterFreqAtTime(frequency: number, time = 0) {
    this.time = Math.max(time, this.time);
    const absTime = this.audioContext.currentTime + time;
    this.filter?.frequency.linearRampToValueAtTime(frequency, time);
    return this;
  }

  expRampFilterFreqAtTime(frequency: number, time = 0) {
    this.time = Math.max(time, this.time);
    const absTime = this.audioContext.currentTime + time;
    this.filter?.frequency.exponentialRampToValueAtTime(frequency, time);
    return this;
  }

  wait(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.time * 1000));
  }

  dispose() {
    this.carrier.osc.stop();
    this.carrier.osc.disconnect();
    this.carrier.gain.disconnect();
    this.filter?.disconnect();

    for (const modulator of this.modulators) {
      modulator.osc.stop();
      modulator.osc.disconnect();
      modulator.gain.disconnect();
    }
    this.modulators = []
  }
}
