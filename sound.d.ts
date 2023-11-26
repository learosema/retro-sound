import { OscGainNode } from "./utils/osc-gain";
export declare class Sound {
    audioContext: AudioContext;
    carrier: OscGainNode;
    output: AudioNode;
    destination: AudioNode | null;
    filter: BiquadFilterNode | null;
    time: number;
    modulators: Array<OscGainNode>;
    constructor(audioContext: AudioContext, carrierType?: OscillatorType);
    withFilter(type: BiquadFilterType, frequency: number, Q?: number): this;
    withModulator(modulatorType: OscillatorType | undefined, frequency: number, amount: number, assignTo?: 'frequency' | 'detune' | 'gain' | 'filter' | 'last'): this;
    toDestination(destination?: AudioNode | null): this;
    play(note: string, startVolume?: number, startTime?: number): this;
    rampToVolumeAtTime(volume: number, time: number): this;
    expRampToVolumeAtTime(volume: number, time: number): this;
    rampToNoteAtTime(note: string, time: number): this;
    setToNoteAtTime(note: string, time: number): this;
    setVolumeAtTime(volume: number, time: number): this;
    rampFilterFreqAtTime(frequency: number, time?: number): this;
    expRampFilterFreqAtTime(frequency: number, time?: number): this;
    wait(): Promise<void>;
    dispose(): void;
    waitDispose(): Promise<void>;
}
