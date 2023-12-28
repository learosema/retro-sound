import { Playable } from "./playable";
import { createFilter } from "./utils/filter";
import { noteToFrequency } from "./utils/note-utils";
import { OscGainNode, createOscGainNode } from "./utils/osc-gain";

export class Sound implements Playable {

	carrier: OscGainNode;
	volume: GainNode;
	output: AudioNode;
	destination: AudioNode | null = null;
	filter: BiquadFilterNode | null = null;
	time: number = 0;

	modulators: Array<OscGainNode> = [];
	attackTime: number = 0;
	attackLevel: number = 1;
	decayTime: number = 0;
	sustainLevel: number = 1;
	releaseTime: number = 0;

	constructor(
		public audioContext: AudioContext,
		carrierType: OscillatorType = 'square') {
		this.audioContext = audioContext;
		this.carrier = createOscGainNode(this.audioContext, carrierType);
		this.volume = this.carrier.gain;
		this.output = this.volume;
		this.setVolumeAtTime(0, 0);
	}

	withFilter(type: BiquadFilterType, frequency: number, Q?: number) {
		this.filter = createFilter(this.audioContext, type, frequency, Q);
		this.carrier.gain.connect(this.filter);
		this.output = this.filter;
		return this;
	}

	withModulator(
		modulatorType: OscillatorType = 'square',
		frequency: number,
		amount: number,
		assignTo: 'frequency' | 'detune' | 'gain' | 'filter' | 'last' = 'frequency'
	) {
		const modulator = createOscGainNode(this.audioContext, modulatorType);
		modulator.osc.frequency.value = frequency;
		modulator.gain.gain.value = amount;
		let target = null;
		if (!target) {
			switch (assignTo) {
				case 'frequency':
					target = this.carrier.osc.frequency;
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

	toDestination(destination: AudioNode | null = null) {
		if (this.destination) {
			this.output.disconnect(this.destination);
		}
		this.destination = destination || this.audioContext.destination;
		this.output.connect(this.destination);
		return this;
	}

	play(note: string, time?: number): Sound;
	play(frequency: number, time?: number): Sound;
	play(noteOrFrequency: string|number, time = 0): Sound {
		const frequency = typeof noteOrFrequency === 'string' ? noteToFrequency(noteOrFrequency) : noteOrFrequency;
		const absTime = this.audioContext.currentTime + time;
		this.carrier.osc.frequency.setValueAtTime(frequency, absTime);
		this.volume.gain.linearRampToValueAtTime(this.attackLevel, absTime + this.attackTime);
		this.volume.gain.linearRampToValueAtTime(this.sustainLevel, absTime + this.attackTime + this.decayTime);
		this.time = Math.max(absTime, this.time);
		return this;
	}

	release(time: number): Playable {
		const absReleaseTime = this.audioContext.currentTime + time + this.releaseTime;
		this.volume.gain.linearRampToValueAtTime(0, absReleaseTime);
		this.volume.gain.setValueAtTime(0, absReleaseTime);
		this.time = Math.max(absReleaseTime, this.time);
		return this;
	}

	rampToVolumeAtTime(volume: number, time: number) {
		const absTime = this.audioContext.currentTime + time;
		this.carrier.gain.gain.linearRampToValueAtTime(volume, absTime);
		this.time = Math.max(time, this.time);
		return this;
	}

	expRampToVolumeAtTime(volume: number, time: number) {
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

	withAttack(attackTime: number, attackLevel = 1) {
		this.attackTime = attackTime;
		this.attackLevel = attackLevel;
		return this;
	}

	withDecay(decayTime: number) {
		this.decayTime = decayTime;
		return this;
	}

	withSustain(sustainLevel: number) {
		this.sustainLevel = sustainLevel;
		return this;
	}

	withRelease(releaseTime: number) {
		this.releaseTime = releaseTime;
		return this;
	}

	wait(): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, this.time * 1000));
	}

	async dispose(): Promise<void> {
		await this.wait();
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
