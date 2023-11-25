export declare class WhiteNoise {
    audioContext: AudioContext;
    bufferSource: AudioBufferSourceNode;
    gain: GainNode;
    output: AudioNode;
    destination: AudioNode | null;
    filter: BiquadFilterNode | null;
    time: number;
    static bufferSize: number;
    static noiseBuffer: AudioBuffer | null;
    constructor(audioContext: AudioContext);
    play(time?: number): this;
    stop(time?: number): this;
    toDestination(destination?: AudioNode | null): this;
    withFilter(type: BiquadFilterType, frequency: number, Q?: number): this;
    setFilterFreqAtTime(frequency: number, time?: number): this;
    rampFilterFreqAtTime(frequency: number, time?: number): this;
    expRampFilterFreqAtTime(frequency: number, time?: number): this;
    rampToVolumeAtTime(volume: number, time: number): this;
    expRampToVolumeAtTime(volume: number, time: number): this;
    setVolumeAtTime(volume: number, time: number): this;
    private createNoiseBuffer;
    wait(): Promise<void>;
    dispose(): void;
    waitDispose(): Promise<void>;
}
