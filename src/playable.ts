export interface Playable {
	play(note: string, time: number): Playable
	release(time: number): Playable
	dispose(): Promise<void>;
}
