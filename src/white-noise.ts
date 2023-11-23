import { createFilter } from "./utils/filter";

// Adapted from: https://noisehack.com/generate-noise-web-audio-api/

export class WhiteNoise {

	bufferSource: AudioBufferSourceNode;
	gain: GainNode;
	output: AudioNode;
	destination: AudioNode | null = null;
	filter: BiquadFilterNode | null = null;
	time = 0;

	static bufferSize: number = 0;
	static noiseBuffer: AudioBuffer | null = null;

	constructor(public audioContext: AudioContext) {
		this.createNoiseBuffer(audioContext);
		this.bufferSource = audioContext.createBufferSource();
		this.bufferSource.buffer = WhiteNoise.noiseBuffer;
		this.bufferSource.loop = true;
		this.gain = audioContext.createGain();
		this.bufferSource.connect(this.gain);
		this.output = this.gain;
	}

	play() {
		this.bufferSource.start();
		return this;
	}

	toDestination(destination: AudioNode | null = null) {
		this.destination = destination || this.audioContext.destination;
		this.output.connect(this.destination);
		return this;
	}

	withFilter(type: BiquadFilterType, frequency: number, Q?: number) {
		this.filter = createFilter(this.audioContext, type, frequency, Q);
		this.bufferSource.disconnect();
		this.bufferSource.connect(this.filter);
		this.filter.connect(this.output);
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

	rampToVolumeAtTime(volume: number, time: number) {
		const absTime = this.audioContext.currentTime + time;
		this.gain.gain.linearRampToValueAtTime(volume, absTime);
		this.time = Math.max(time, this.time);
		return this;
	}

	expRampToVolumeAtTime(volume: number, time: number) {
		const absTime = this.audioContext.currentTime + time;
		this.gain.gain.exponentialRampToValueAtTime(volume, absTime);
		this.time = Math.max(time, this.time);
		return this;
	}

	setVolumeAtTime(volume: number, time: number) {
		const absTime = this.audioContext.currentTime + time;
		this.gain.gain.setValueAtTime(volume, absTime);
		this.time = Math.max(time, this.time);
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

	wait(): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, this.time * 1000));
	}

	dispose() {
		this.gain.disconnect();
		this.bufferSource.stop();
		this.filter?.disconnect();
	}

	async waitDispose() {
		await this.wait();
		this.dispose();
	}
}
