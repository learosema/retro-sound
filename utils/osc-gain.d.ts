export type OscGainNode = {
    osc: OscillatorNode;
    gain: GainNode;
};
export declare function createOscGainNode(AC: AudioContext, type?: OscillatorType): {
    osc: OscillatorNode;
    gain: GainNode;
};
