import { Instrument } from './instrument';
import { Sound, WhiteNoise } from './retro-sound';

function $<T = HTMLElement>(sel: string, con?: HTMLElement|Document) {
	return (con ?? document).querySelector(sel) as T;
}

const AC = new AudioContext();
const masterVolume = AC.createGain();

masterVolume.gain.setValueAtTime(0.25, AC.currentTime);
masterVolume.connect(AC.destination);

$('#noise').addEventListener('click', () => {
	AC.resume();
	const noise = new WhiteNoise(AC).withFilter('lowpass', 10000).toDestination(masterVolume);
	noise.play()
		.rampFilterFreqAtTime(1000, .25)
		.rampToVolumeAtTime(0, .5).waitDispose();
});


$('#noise2').addEventListener('click', () => {
	AC.resume();
	const noise = new WhiteNoise(AC).withFilter('lowpass', 50).toDestination(masterVolume);
	noise.play()
		.expRampFilterFreqAtTime(10000, .25)
		.rampToVolumeAtTime(0, .5).waitDispose();
});


$('#noise3').addEventListener('click', () => {
	AC.resume();
	const noise = new WhiteNoise(AC).withFilter('lowpass', 10000).toDestination(masterVolume);
	noise.play()
		.expRampFilterFreqAtTime(10, .25)
		.rampToVolumeAtTime(0, .5).waitDispose();
});

$('#noise4').addEventListener('click', () => {
	AC.resume();
	const noise = new WhiteNoise(AC).withFilter('lowpass', 1000).toDestination(masterVolume);
	noise.play()
		.expRampFilterFreqAtTime(10, .25)
		.rampToVolumeAtTime(0, .5).waitDispose();
});

$('#bling').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'triangle')
    .withModulator('square', 6, 600, 'detune')
		.withModulator('square', 12, 300, 'detune')
    .withFilter('lowpass', 1000)
    .toDestination(masterVolume);

  FM.play('A5')
		.rampToVolumeAtTime(0, 1)
		.waitDispose();
});


$('#ring').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'triangle')
    .withModulator('square', 12, 300, 'detune')
    .withFilter('lowpass', 400)
    .toDestination(masterVolume);

  FM.play('C5')
    .setVolumeAtTime(1, 1)
    .rampToVolumeAtTime(0, 1.25)
    .waitDispose()
});

$('#laser').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'sawtooth')
    .withModulator('triangle', 120, 100)
    .withFilter('lowpass', 1800)
    .toDestination(masterVolume);

  FM.play('C6')
    .rampToNoteAtTime('C5', .25)
    .rampToVolumeAtTime(0, .5)
    .waitDispose();
});

$('#witch').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'sawtooth')
    .withModulator('sine', 18, 150, 'detune')
    .withModulator('sine', 12, 50, 'last')
    .withFilter('lowpass', 1000)
    .withModulator('triangle', 4, 1000, 'filter')
    .toDestination(masterVolume);

  FM.play('A4', 0.0)
    .rampToVolumeAtTime(1, 0.125)
    .rampToNoteAtTime('G3', 3)
    .rampToVolumeAtTime(0, 3.5)
    .waitDispose();
});

$('#emergency').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'sine')
    .withModulator('sine', 2, 600, 'detune')
    .withFilter('lowpass', 800)
    .toDestination(masterVolume);
  FM.play('A4')
    .rampToVolumeAtTime(0,2)
    .waitDispose()
});

$('#gameover').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'sawtooth')
    .withModulator('sine', 4, 100, 'detune')
    .withFilter('lowpass', 1200)
    .toDestination(masterVolume);
  FM.play('A3')
    .rampToNoteAtTime('E2', 3)
    .rampToVolumeAtTime(0,4)
    .waitDispose();
});


$('#won').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'sawtooth')
    .withFilter('lowpass', 800)
    .toDestination(masterVolume);
  FM.play('C3')
    .setToNoteAtTime('E3', 0.25)
    .setToNoteAtTime('G3', 0.5)
    .setToNoteAtTime('C4', 0.75)
    .setVolumeAtTime(1, 1)
    .rampToVolumeAtTime(0, 2)
    .waitDispose()
});

$('#smoke').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'sawtooth')
    .withFilter('lowpass', 600)
    .withModulator('sine', 32, 400, 'filter')
    .toDestination(masterVolume);
  FM.play('C3')
    .setVolumeAtTime(0, 0.25)
    .setToNoteAtTime('D#3', 0.5)
    .setVolumeAtTime(1, 0.5)
    .setVolumeAtTime(0, 0.75)
    .setToNoteAtTime('F3', 1)
    .setVolumeAtTime(1, 1)
    .setVolumeAtTime(1, 1.5)
    .rampToVolumeAtTime(0, 1.74)
    .setToNoteAtTime('C3', 1.75)
    .setVolumeAtTime(1, 1.75)
    .setVolumeAtTime(0, 2)
    .setToNoteAtTime('D#3', 2.25)
    .setVolumeAtTime(1, 2.25)
    .setVolumeAtTime(0, 2.5)
    .setVolumeAtTime(1, 2.75)
    .setToNoteAtTime('F#3', 2.75)
    .setVolumeAtTime(0, 2.99)
    .setVolumeAtTime(1, 3)
    .setToNoteAtTime('F3', 3)
    .setVolumeAtTime(1, 3.5)
    .rampToVolumeAtTime(0, 3.75)
    .waitDispose()
});


const violin = new Instrument(AC)
	.withSound(new Sound(AC, 'triangle').withModulator('sine', 6, 10, 'detune').withFilter('lowpass', 10000))
	.withAttack(0.5).withDecay(0.1).withSustain(0.9).withRelease(0.5)
	.toDestination(masterVolume);

	/*@ts-ignore */
window.violin = violin;window.ac = violin.audioContext;


$('#melody')?.addEventListener('click', () => {
	window.setTimeout(() => {
		AC.resume();
	violin
		.play('C4', 0)
		.play('D4', 0.5)
		.play('E4', 1)
		.play('F4', 1.5)
		.play('G4', 2)
		.play('A4', 2.5)
		.play('B4', 3)
		.play('C5', 3.5)
		.release(4)

	}, 0)


})
