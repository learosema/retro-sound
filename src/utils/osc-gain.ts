export type OscGainNode = {
	osc: OscillatorNode;
	gain: GainNode;
}

export function createOscGainNode(AC: AudioContext, type: OscillatorType = 'square') {
	const node = {
		osc: AC.createOscillator(),
		gain: AC.createGain(),
	}
	node.osc.type = type;

	node.osc.start();
	node.osc.connect(node.gain)
	return node;
}
