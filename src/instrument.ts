import { Sound } from "./sound";

export interface Playable {

	play(note: string, time: number): Playable

	release(time: number): Playable

}

export class Instrument implements Playable {

	volume: GainNode;
	destination: AudioNode|null = null;

	attackTime = 0;
	attackLevel = 1;
	decayTime = 0;
	sustainLevel = 0.5;
	releaseTime = 0;

	sounds: Sound[] = [];

	constructor(public audioContext: AudioContext, ) {

		this.volume = this.audioContext.createGain();
		this.volume.gain.setValueAtTime(0, audioContext.currentTime);

	}

	withSound(...sounds: Sound[]) {
		this.sounds.push(...sounds);
		for (const sound of sounds) {
			sound.toDestination(this.volume);
			sound.setVolumeAtTime(1, this.audioContext.currentTime);
		}
		return this;
	}

	toDestination(destination ?: AudioNode) {
		if (this.destination) {
			this.destination.disconnect(this.destination);
		}
		this.destination = typeof destination === "undefined" ? this.audioContext.destination : destination;
		if (this.destination) {
			this.volume.connect(this.destination);
		}
		return this;
	}

	play(note: string, time: number): Playable {
		const absTime = this.audioContext.currentTime + time;
		this.volume.gain.linearRampToValueAtTime(this.attackLevel, absTime + this.attackTime);
		this.volume.gain.linearRampToValueAtTime(this.sustainLevel, absTime + this.attackTime + this.decayTime);
		for (const sound of this.sounds) {
			sound.setToNoteAtTime(note, time);
		}
		return this;
	}

	release(time: number): Playable {
		const absReleaseTime = this.audioContext.currentTime + time + this.releaseTime;
		this.volume.gain.linearRampToValueAtTime(0, absReleaseTime);
		this.volume.gain.setValueAtTime(0, absReleaseTime);
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

}
